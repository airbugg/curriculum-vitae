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
// W letterform and rewire.svg the dotted-stem ẅ, each cut from its official
// wordmark (the full lockups live in git history). Neither Wix nor Rewire
// published these as standalone icon files, so both are crops of official
// geometry, confirmed by the owner rather than by a press kit.
export const logos: Record<string, LogoAsset | undefined> = {
  Remitly: load('remitly'),
  Rewire: load('rewire'),
  Rylo: load('rylo'),
  Wix: load('wix'),
};

// The university's mark for the education row (assets/logos/bgu.svg); a
// missing file degrades to the school name alone, like any mark here.
// Provenance is campus-vetted second-hand (bgu.ac.il and Wikimedia were
// unreachable when it was hunted): the vector is
// BGUCompSci/CNNQuantizationThroughPDEs @ 3673709851c89bd0c3e6e49bc6ddbdc6065c8f58
// website/assets/bgu.svg, corroborated by a geometrically identical,
// byte-independent copy in galit20/knesset360
// @ 68f9fc6b32f78fce6703c4d36492d59e0956ec2c
// knesset360-frontend/public/bgu_logo.svg.
export const educationMark = load('bgu');
