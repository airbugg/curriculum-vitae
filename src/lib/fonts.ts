// Per-theme @font-face CSS with the font binaries embedded as base64, so
// the rendered HTML is self-contained for Chromium's print pass.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Theme } from '../types';

const ROOT = process.cwd();

type FontFace = [family: string, file: string, weight: number, style: 'normal' | 'italic'];

const CODE_PRO: FontFace[] = [
  ['Source Code Pro', 'SourceCodePro-Light.ttf', 300, 'normal'],
  ['Source Code Pro', 'SourceCodePro-Regular.ttf', 400, 'normal'],
  ['Source Code Pro', 'SourceCodePro-Semibold.ttf', 600, 'normal'],
  ['Source Code Pro', 'SourceCodePro-Bold.ttf', 700, 'normal'],
];

const FONT_SETS: Record<string, FontFace[]> = {
  sourceSans: [
    ['Source Sans Pro', 'SourceSansPro-Light.otf', 300, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-Regular.otf', 400, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-It.otf', 400, 'italic'],
    ['Source Sans Pro', 'SourceSansPro-Semibold.otf', 600, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-Bold.otf', 700, 'normal'],
  ],
  codePro: CODE_PRO,
  // The grid asks for mono at weight 400 only (the braces, the title, the
  // section marks, the dates column, the background chips, `code` spans).
  // Shipping the other three weights added ~850 KB of base64 to its HTML
  // that Chromium then dropped on the way into the PDF. Confirmed with
  // `pdffonts`: the grid PDF embeds SourceCodePro-Regular and nothing else.
  // If a grid rule ever asks for bold or light mono, point it back at
  // CODE_PRO — otherwise the browser synthesises the weight and the page
  // shifts. Derived rather than copied, so a font-file rename cannot update
  // one list and miss the other.
  codeProRegular: CODE_PRO.filter(([, , weight]) => weight === 400),
};

const THEME_FONTS: Record<Theme, string[]> = {
  grid: ['sourceSans', 'codeProRegular'], // sans content + mono data column
  terminal: ['codePro'], // shell — genuinely uses all four mono weights
};

export function fontFaces(theme: Theme): string {
  return THEME_FONTS[theme]
    .flatMap((set) => FONT_SETS[set])
    .map(([family, file, weight, style]) => {
      const buf = readFileSync(join(ROOT, 'fonts', file));
      const fmt = file.endsWith('.otf') ? 'opentype' : 'truetype';
      return `@font-face{font-family:'${family}';src:url(data:font/${fmt};base64,${buf.toString(
        'base64',
      )}) format('${fmt}');font-weight:${weight};font-style:${style};}`;
    })
    .join('\n');
}
