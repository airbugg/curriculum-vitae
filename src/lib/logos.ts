// Company logos, inlined at build time from assets/logos/<slug>.{svg,png}.
//   mark     — a small glyph rendered BEFORE the company name.
//   wordmark — the logo IS the name, rendered IN PLACE of it (Wix and Rewire
//              have no separate mark, and printing both would duplicate it).
// SVGs are inlined verbatim and keep their own brand colours; nothing here
// recolours them to the surrounding ink. A missing file degrades to the
// plain text name, so dropping one into assets/logos/ lights it up on the
// next build.
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
  wordmark?: LogoAsset;
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
export const logos: Record<string, CompanyLogo> = {
  Rylo: { wordmark: load('rylo') }, // full lockup (swirl + name) from rylo.com
  Remitly: { mark: load('remitly') },
  Rewire: { wordmark: load('rewire') },
  'Wix.com': { wordmark: load('wix') },
};
