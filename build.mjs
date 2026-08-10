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
const { renderVariant, variants, content } = await import(
  pathToFileURL(join(ROOT, '.build', 'entry.mjs'))
);

// Validate every cross-file reference before rendering: a bullet id, intro
// key or skills key that went missing would otherwise render as a literal
// "undefined" (or as silence), and the one-page check would happily pass.
function validate() {
  const { jobs, skills } = content;
  const errors = [];
  for (const v of variants) {
    if (!v.intro) errors.push(`${v.file}: intro is empty — check content/intro.md keys`);
    for (const s of v.sections) {
      const job = jobs[s.job];
      if (!job) {
        errors.push(`${v.file}: unknown job '${s.job}'`);
        continue;
      }
      if (!parseable(job.dates))
        errors.push(`${v.file}: job '${s.job}' dates '${job.dates}' do not parse (need "Mon YYYY – Mon YYYY|Present" with an en dash)`);
      for (const id of s.bullets)
        if (!(id in job.bullets)) errors.push(`${v.file}: job '${s.job}' has no bullet '${id}'`);
    }
    for (const [, key] of v.stackRows ?? [])
      if (!(key in skills)) errors.push(`${v.file}: no '${key}' key in content/skills.md`);
  }
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    process.exit(1);
  }
}
const parseable = (dates) => {
  const [from, to] = String(dates).split('–').map((s) => s.trim());
  const month = (s) => /^[A-Z][a-z]{2}\w*\s+\d{4}$/.test(s);
  return month(from) && (month(to) || /present/i.test(to || ''));
};
validate();

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

// Counts uncompressed /Type /Page dicts — true of Skia's PDF backend
// (Chromium print), which never wraps page objects in object streams. If a
// future Chromium starts compressing them, every build fails loudly with a
// count of 0; this comment is the diagnosis.
const pageCount = (pdf) =>
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
    // Surface Chromium's own words; a swallowed stderr costs a debug round.
    if (err.stderr) console.error(String(err.stderr));
    throw err;
  }
  const pages = pageCount(pdfPath);
  const ok = pages === 1;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${v.file}.pdf — ${pages} page(s) [${v.label}]`);
}

process.exit(failed ? 1 : 0);
