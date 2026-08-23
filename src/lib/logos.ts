// Company marks, inlined at build time from assets/logos/<slug>.{svg,png}.
// A mark is a small glyph rendered BEFORE the company name, never instead of
// it — the name itself is always real text (see CompanyName).
// SVGs are inlined verbatim and keep their own brand colours; nothing here
// recolours them to the surrounding ink. A missing file degrades to the name
// alone, so dropping one into assets/logos/ lights it up on the next build.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface LogoAsset {
  type: 'svg' | 'png';
  slug: string;
  /** Inline SVG markup, or a data: URI for PNGs. */
  data: string;
}

export interface CompanyLogo {
  mark?: LogoAsset;
}

const dir = join(process.cwd(), 'assets', 'logos');

function load(slug: string): LogoAsset | undefined {
  const svg = join(dir, `${slug}.svg`);
  if (existsSync(svg)) return { type: 'svg', slug, data: readFileSync(svg, 'utf8').trim() };
  const png = join(dir, `${slug}.png`);
  if (existsSync(png))
    return {
      type: 'png',
      slug,
      data: `data:image/png;base64,${readFileSync(png).toString('base64')}`,
    };
  return undefined;
}

// Keyed by the company string as it appears in content frontmatter.
// rylo.svg is the two-leaf mark cut from the official lockup; wix.svg is the
// W letterform from the official wordmark (Wix publishes no standalone icon,
// so the W is a crop, not a released asset). Rewire has no entry: its only
// surviving artwork is the wordmark in git history, which contains the name
// and would print it twice.
export const logos: Record<string, CompanyLogo> = {
  Remitly: { mark: load('remitly') },
  Rylo: { mark: load('rylo') },
  'Wix.com': { mark: load('wix') },
};
