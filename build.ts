#!/usr/bin/env node
// Bundles the React entry with esbuild, validates every cross-file content
// reference, renders each variant to HTML, prints to PDF via headless
// Chromium, and verifies the one-page invariant.
// Runs directly under Node ≥ 22.18 (native type stripping); type-check with
// `npm run check`.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import { repairTextLayer } from './scripts/text-layer.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
// Everything under src/ resolves paths from the working directory; pin it.
process.chdir(ROOT);
const DIST = join(ROOT, 'dist');
const HTML = join(DIST, 'html');
mkdirSync(HTML, { recursive: true });

// Non-breaking spaces are rag control: they hold a two-word chip together,
// keep a padded column from wrapping. Written as '\u00A0' they are visible
// to a reader and survive a formatter; written as the raw character they are
// indistinguishable from a space, and any tidy-up silently reflows the page.
function rawNbspSites(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return rawNbspSites(path);
    if (!/\.(ts|tsx|css)$/.test(e.name)) return [];
    return readFileSync(path, 'utf8')
      .split('\n')
      .flatMap((line, i) =>
        line.includes('\u00A0') ? [`${path.slice(ROOT.length + 1)}:${i + 1}`] : [],
      );
  });
}

const rawNbsp = rawNbspSites(join(ROOT, 'src'));
if (rawNbsp.length) {
  for (const site of rawNbsp)
    console.error(`\u2717 ${site}: raw non-breaking space — write '\\u00A0' instead`);
  process.exit(1);
}

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
const { renderVariant, variants, validate, person } = entry;

const errors = validate(variants);
if (errors.length) {
  for (const e of errors) console.error(`\u2717 ${e}`);
  process.exit(1);
}

function chromium(): string {
  // 1. Explicit override (used by CI): CHROME_PATH=/path/to/chrome
  const override = process.env.CHROME_PATH;
  if (override && existsSync(override)) return override;

  // 2. A Playwright-managed browser, via the variable Playwright itself sets.
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (pw && existsSync(pw))
    for (const dir of readdirSync(pw).filter((d) => d.startsWith('chromium'))) {
      const bin = join(pw, dir, 'chrome-linux', 'chrome');
      if (existsSync(bin)) return bin;
    }

  // 3. Common system binaries on PATH (Linux distros / CI runners).
  for (const name of ['chromium-browser', 'chromium', 'google-chrome', 'google-chrome-stable']) {
    try {
      const found = execFileSync('which', [name], { stdio: 'pipe' }).toString().trim();
      if (found) return found;
    } catch {
      /* not found — try next */
    }
  }

  throw new Error('Chromium not found. Set CHROME_PATH, or put it on PATH.');
}

// Every class the render emits must have a rule in the stylesheets that
// render with it. A rename landing in the component and not the CSS drops
// the styling silently and still passes the one-page check — the same
// failure shape validate() exists to prevent on the content side.
// co-art-<slug> is exempt: it is an optional per-asset sizing hook, and a
// logo that needs no size override correctly has no rule.
function unstyledClasses(html: string, theme: string): string[] {
  const emitted = new Set(
    [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => (m[1] ?? '').split(' ')),
  );
  const css = ['base.css', `${theme}.css`]
    .map((f) => readFileSync(join(ROOT, 'src', 'themes', f), 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  return [...emitted]
    .filter((c) => c && !c.startsWith('co-art-'))
    .filter((c) => !new RegExp(`\\.${c}(?![\\w-])`).test(css));
}

const chrome = chromium();
let failed = false;

for (const v of variants) {
  const htmlPath = join(HTML, `${v.file}.html`);
  const pdfPath = join(DIST, `${v.file}.pdf`);
  const html = renderVariant(v);
  writeFileSync(htmlPath, html);
  const unstyled = unstyledClasses(html, v.theme);
  if (unstyled.length) {
    for (const c of unstyled) console.error(`\u2717 ${v.file}: class '${c}' has no CSS rule`);
    failed = true;
  }
  try {
    execFileSync(
      chrome,
      [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--print-to-pdf=${pdfPath}`,
        `file://${htmlPath}`,
      ],
      { stdio: 'pipe' },
    );
  } catch (err) {
    // Chromium reports print failures on stderr only.
    const stderr = (err as { stderr?: Buffer }).stderr;
    if (stderr) console.error(String(stderr));
    throw err;
  }
  // Skia's ToUnicode is faithful to the typography and wrong for a parser;
  // repair it before the page count, so a failure here fails the build.
  const { remapped, pages } = await repairTextLayer(pdfPath, {
    author: person.name,
    subject: 'Curriculum Vitae',
  });
  const ok = pages === 1;
  if (!ok) failed = true;
  console.log(
    `${ok ? '✓' : '✗'} ${v.file}.pdf — ${pages} page(s) [${v.label}]` +
      (remapped.length ? ` · text layer: ${remapped.join(', ')} remapped` : ''),
  );
}

process.exitCode = failed ? 1 : 0;
