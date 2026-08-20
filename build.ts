#!/usr/bin/env node
// Bundles the React entry with esbuild, validates every cross-file content
// reference, renders each variant to HTML, prints to PDF via headless
// Chromium, and verifies the one-page invariant.
// Runs directly under Node ≥ 22.18 (native type stripping); type-check with
// `npm run check`.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import type { Variant } from './src/types.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
// Everything under src/ resolves paths from the working directory; pin it.
process.chdir(ROOT);
const DIST = join(ROOT, 'dist');
const HTML = join(DIST, 'html');
mkdirSync(HTML, { recursive: true });

await esbuild.build({
  entryPoints: [join(ROOT, 'src', 'entry.tsx')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
  outfile: join(ROOT, '.build', 'entry.mjs'),
  logLevel: 'silent',
});

// Derived from the entry module rather than hand-copied, so renaming or
// dropping an export there is a type error here instead of a runtime one.
type Entry = typeof import('./src/entry.tsx');

// Content errors are thrown while this module initialises. Unguarded, Node
// prints them with a stack pointing into .build/entry.mjs — the bundled
// artifact the loaders take care never to name.
let entry: Entry;
try {
  entry = (await import(pathToFileURL(join(ROOT, '.build', 'entry.mjs')).href)) as Entry;
} catch (e) {
  console.error(`\u2717 ${(e as Error).message}`);
  process.exit(1);
}
const { renderVariant, variants, validate } = entry;

const errors = validate(variants);
if (errors.length) {
  for (const e of errors) console.error(`\u2717 ${e}`);
  process.exit(1);
}

function chromium(): string {
  // 1. Explicit override (used by CI): CHROME_PATH=/path/to/chrome
  const override = process.env.CHROME_PATH;
  if (override && existsSync(override)) return override;

  // 2. Local sandbox Playwright-style install.
  const base = '/opt/pw-browsers';
  for (const dir of ['chromium', 'chromium-1194']) {
    const direct = join(base, dir);
    if (existsSync(direct) && statSync(direct).isFile()) return direct;
    const inner = join(direct, 'chrome-linux', 'chrome');
    if (existsSync(inner)) return inner;
  }

  // 3. Common system binaries on PATH (Linux distros / CI runners).
  for (const name of ['chromium-browser', 'chromium', 'google-chrome', 'google-chrome-stable']) {
    try {
      const found = execFileSync('which', [name], { stdio: 'pipe' }).toString().trim();
      if (found) return found;
    } catch { /* not found — try next */ }
  }

  throw new Error(
    'Chromium not found. Set CHROME_PATH, install it under /opt/pw-browsers, ' +
    'or put chromium/google-chrome on PATH.'
  );
}

// Counts uncompressed /Type /Page dicts — true of Skia's PDF backend
// (Chromium print), which never wraps page objects in object streams. If a
// future Chromium starts compressing them, every build fails loudly with a
// count of 0, and this note is the diagnosis.
const pageCount = (pdf: string): number =>
  (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;

const chrome = chromium();
let failed = false;

for (const v of variants) {
  const htmlPath = join(HTML, `${v.file}.html`);
  const pdfPath = join(DIST, `${v.file}.pdf`);
  writeFileSync(htmlPath, renderVariant(v));
  try {
    execFileSync(chrome, [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${pdfPath}`,
      `file://${htmlPath}`,
    ], { stdio: 'pipe' });
  } catch (err) {
    // Chromium reports print failures on stderr only.
    const stderr = (err as { stderr?: Buffer }).stderr;
    if (stderr) console.error(String(stderr));
    throw err;
  }
  const pages = pageCount(pdfPath);
  const ok = pages === 1;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${v.file}.pdf — ${pages} page(s) [${v.label}]`);
}

process.exitCode = failed ? 1 : 0;
