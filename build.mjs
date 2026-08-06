#!/usr/bin/env node
// Bundles the React entry with esbuild, renders each variant to HTML,
// prints to PDF via headless Chromium, and verifies the one-page invariant.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const ROOT = dirname(fileURLToPath(import.meta.url));
process.chdir(ROOT);
const DIST = join(ROOT, 'dist');
const HTML = join(DIST, 'html');
mkdirSync(HTML, { recursive: true });

await esbuild.build({
  entryPoints: [join(ROOT, 'src', 'entry.jsx')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
  outfile: join(ROOT, '.build', 'entry.mjs'),
  logLevel: 'silent',
});
const { renderVariant, variants } = await import(
  pathToFileURL(join(ROOT, '.build', 'entry.mjs'))
);

function chromium() {
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

const pageCount = (pdf) =>
  (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;

const chrome = chromium();
let failed = false;

for (const v of variants) {
  const htmlPath = join(HTML, `${v.file}.html`);
  const pdfPath = join(DIST, `${v.file}.pdf`);
  writeFileSync(htmlPath, renderVariant(v));
  execFileSync(chrome, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'pipe' });
  const pages = pageCount(pdfPath);
  const ok = pages === 1;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${v.file}.pdf — ${pages} page(s) [${v.label}]`);
}

process.exit(failed ? 1 : 0);
