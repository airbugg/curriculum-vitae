#!/usr/bin/env node
// Renders each CV variant to HTML, prints to PDF via headless Chromium,
// and verifies every variant stays on one page.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderVariant } from './src/render.mjs';
import { variants } from './src/variants.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const HTML = join(DIST, 'html');
mkdirSync(HTML, { recursive: true });

function chromium() {
  const base = '/opt/pw-browsers';
  const candidates = [
    join(base, 'chromium'),
    ...['chromium-1194'].map((d) => join(base, d, 'chrome-linux', 'chrome')),
  ];
  for (const c of candidates) {
    try {
      if (existsSync(c) && statSync(c).isFile()) return c;
      const inner = join(c, 'chrome-linux', 'chrome');
      if (existsSync(inner)) return inner;
    } catch {}
  }
  throw new Error('Chromium not found under /opt/pw-browsers');
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
