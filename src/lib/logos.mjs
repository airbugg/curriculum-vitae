// Company marks, inlined at build time from assets/logos/<slug>.svg.
// Files are cleaned SVGs (viewBox only, inline fills, fill="currentColor"
// where single-color) so they can sit inline before the company name at
// ~3mm and take the surrounding ink. Missing files degrade to no mark —
// dropping a new slug.svg into assets/logos/ lights it up on next build.
//
// wix.svg exists but is the "WIX" wordmark glyph (Wix has no separate
// mark); placed before the text "Wix.com" it would duplicate the name,
// so it is deliberately left unmapped.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'assets', 'logos');
const load = (slug) => {
  const p = join(dir, `${slug}.svg`);
  return existsSync(p) ? readFileSync(p, 'utf8').trim() : null;
};

// Keyed by the company string as it appears in content frontmatter, plus
// two special slots for the education footer.
export const logos = {
  Rylo: load('rylo'),
  Remitly: load('remitly'),
  Rewire: load('rewire'),
  bgu: load('bgu'),
  nar: load('nar'),
};
