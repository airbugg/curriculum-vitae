#!/usr/bin/env node
// Crops the flagship PDF's header band into a wide banner for the README
// hero. Rasterizes the already-built, pixel-verified print PDF (poppler's
// pdftoppm) rather than re-rendering the page in a browser — this reuses the
// pipeline's proven output instead of a second rendering path (screen media,
// no pagination) with its own paint-timing quirks. Regenerated on every
// release (see .github/workflows/release-cv.yml) so the README always shows
// the current CV, not a stale snapshot.
//
// Crop height (58mm) was measured against the rendered PDF: the intro's
// last line ends at 48.2mm and { EXPERIENCE } spans 52.9–56.6mm, so 58mm
// includes the heading with a hair of air and stops before the hairline
// rule beneath it. Re-measure (pdftoppm -r 300, then find ink bands on the
// full page) if the header block's vertical rhythm changes enough to make
// the crop feel off.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);

const PDF = join(ROOT, 'dist', 'eugene-lerman.pdf');
const OUT_PREFIX = join(ROOT, 'docs', 'cv-preview');

if (!existsSync(PDF)) {
  throw new Error(`${PDF} not found — run the build first (npm run build).`);
}

const DPI = 200;
const PX_PER_MM = DPI / 25.4;
const WIDTH_MM = 210; // the page's own width — no side crop
const HEIGHT_MM = 58;
const width = Math.round(WIDTH_MM * PX_PER_MM);
const height = Math.round(HEIGHT_MM * PX_PER_MM);

mkdirSync(dirname(OUT_PREFIX), { recursive: true });

try {
  execFileSync('pdftoppm', [
    '-png', '-singlefile', '-r', String(DPI),
    '-x', '0', '-y', '0', '-W', String(width), '-H', String(height),
    '-f', '1', '-l', '1',
    PDF, OUT_PREFIX,
  ], { stdio: 'pipe' });
} catch (err) {
  if ((err as NodeJS.ErrnoException).code === 'ENOENT')
    throw new Error('pdftoppm not found — install poppler-utils (apt-get install poppler-utils).');
  throw err;
}

console.log(`✓ ${OUT_PREFIX}.png (${width}×${height}px @ ${DPI}dpi)`);
