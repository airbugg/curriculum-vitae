#!/usr/bin/env node
// Builds the README hero banner: identity, title, contact line, intro —
// nothing past it, so nothing reads as a section cut off mid-way. Two
// stages:
//
// 1. pdftoppm crops the already-built, pixel-verified print PDF (poppler's
//    own -x/-y/-W/-H crop) to just past the intro's last line. Rasterizing
//    the print PDF reuses the pipeline's proven output instead of a second
//    rendering path (screen media, no pagination) with its own paint-timing
//    quirks.
// 2. sharp turns that flat rectangle into a card: a few millimetres of
//    synthetic white padding at the bottom give the fade room to work in
//    without touching real text, a soft alpha gradient dissolves the card
//    into the page instead of a hard crop line, and a blurred, offset dark
//    rectangle behind it reads as a soft drop shadow. Output is a
//    transparent PNG, so it sits naturally on GitHub's light or dark theme.
//
// Regenerated on every release (see .github/workflows/release-cv.yml) so
// the README always shows the current CV, not a stale snapshot.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);

const PDF = join(ROOT, 'dist', 'eugene-lerman.pdf');
const RAW_PREFIX = join(ROOT, '.build', 'cv-preview-raw');
const OUT = join(ROOT, 'docs', 'cv-preview.png');

if (!existsSync(PDF)) {
  throw new Error(`${PDF} not found — run the build first (npm run build).`);
}

// Crop height, measured against the rendered PDF: the intro's second (and
// current last) line ends at 41.7mm, { EXPERIENCE } starts at 45.7mm. 44mm
// stops cleanly in the gap between them — past the intro, nowhere near the
// heading. Re-measure (pdftoppm -r 300, then find ink bands on the full
// page) if the intro's line count or the header block's rhythm changes.
const DPI = 200;
const PX_PER_MM = DPI / 25.4;
const WIDTH_MM = 210; // the page's own width — no side crop
const RAW_HEIGHT_MM = 44;
const requestWidth = Math.round(WIDTH_MM * PX_PER_MM);
const requestHeight = Math.round(RAW_HEIGHT_MM * PX_PER_MM);

mkdirSync(dirname(RAW_PREFIX), { recursive: true });
mkdirSync(dirname(OUT), { recursive: true });

try {
  execFileSync('pdftoppm', [
    '-png', '-singlefile', '-r', String(DPI),
    '-x', '0', '-y', '0', '-W', String(requestWidth), '-H', String(requestHeight),
    '-f', '1', '-l', '1',
    PDF, RAW_PREFIX,
  ], { stdio: 'pipe' });
} catch (err) {
  if ((err as NodeJS.ErrnoException).code === 'ENOENT')
    throw new Error('pdftoppm not found — install poppler-utils (apt-get install poppler-utils).');
  throw err;
}

// pdftoppm clamps a crop wider than the page's own raster at this DPI
// (210mm doesn't divide evenly into whole pixels), so the file can land a
// px off the math above. Every size from here drives off the real file,
// not the request.
const rawMeta = await sharp(`${RAW_PREFIX}.png`).metadata();
const rawWidth = rawMeta.width!;
const rawHeight = rawMeta.height!;

// Card treatment, all in device px at DPI above.
const BOTTOM_RUNWAY = 90; // synthetic white below the raw crop, for the fade to dissolve into
const FEATHER = 130; // fade zone height, measured up from the card's new bottom edge
const SHADOW_BLUR = 22;
const SHADOW_OPACITY = 0.22;
const SHADOW_OFFSET_Y = 14;
// A Gaussian blur needs margin to dissipate into on every side, or its own
// raster edge clips it back into a hard rectangle — three sigmas is enough
// for the falloff to reach fully transparent before it runs out of canvas.
// The canvas pads by exactly this much on top/sides so the shadow always
// fits flush, with BOTTOM_RUNWAY (comfortably larger) covering the bottom.
const shadowMargin = SHADOW_BLUR * 3;
const PAD_SIDE = shadowMargin;
const PAD_TOP = shadowMargin;

const cardWidth = rawWidth;
const cardHeight = rawHeight + BOTTOM_RUNWAY;

const fadeMask = Buffer.from(`
  <svg width="${cardWidth}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="${1 - FEATHER / cardHeight}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${cardWidth}" height="${cardHeight}" fill="url(#fade)"/>
  </svg>
`);

const card = await sharp(`${RAW_PREFIX}.png`)
  .extend({ bottom: BOTTOM_RUNWAY, background: '#ffffff' })
  .ensureAlpha()
  .composite([{ input: fadeMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const shadowRect = Buffer.from(`
  <svg width="${cardWidth + shadowMargin * 2}" height="${rawHeight + shadowMargin * 2}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${shadowMargin}" y="${shadowMargin}" width="${cardWidth}" height="${rawHeight}" fill="#000" fill-opacity="${SHADOW_OPACITY}"/>
  </svg>
`);
// Shadow is cast by the card's solid (pre-fade) rectangle, not the faded
// card itself — a shadow that faded out at the same rate as its card would
// just look like a second, blurrier card.
const shadow = await sharp(shadowRect).blur(SHADOW_BLUR).png().toBuffer();

await sharp({
  create: {
    width: cardWidth + PAD_SIDE * 2,
    // cardHeight already includes BOTTOM_RUNWAY; PAD_TOP is the only other
    // margin the canvas needs (no extra bottom pad — the fade IS the edge).
    height: cardHeight + PAD_TOP,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    // PAD_SIDE/PAD_TOP equal shadowMargin, so the shadow's own margin
    // cancels out and it sits flush at the canvas edge, offset only by
    // SHADOW_OFFSET_Y.
    { input: shadow, left: 0, top: SHADOW_OFFSET_Y },
    { input: card, left: PAD_SIDE, top: PAD_TOP },
  ])
  .png()
  .toFile(OUT);

console.log(`✓ ${OUT}`);
