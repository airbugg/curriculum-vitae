// Per-theme @font-face CSS with the font binaries embedded as base64, so
// the rendered HTML is self-contained for Chromium's print pass.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Theme } from '../types.ts';

const ROOT = process.cwd();

type FontFace = [family: string, file: string, weight: number, style: 'normal' | 'italic'];

const CODE_PRO: FontFace[] = [
  ['Source Code Pro', 'SourceCodePro-Light.ttf', 300, 'normal'],
  ['Source Code Pro', 'SourceCodePro-Regular.ttf', 400, 'normal'],
  ['Source Code Pro', 'SourceCodePro-Semibold.ttf', 600, 'normal'],
  ['Source Code Pro', 'SourceCodePro-Bold.ttf', 700, 'normal'],
];

const SOURCE_SANS: FontFace[] = [
  ['Source Sans Pro', 'SourceSansPro-Light.otf', 300, 'normal'],
  ['Source Sans Pro', 'SourceSansPro-Regular.otf', 400, 'normal'],
  ['Source Sans Pro', 'SourceSansPro-It.otf', 400, 'italic'],
  ['Source Sans Pro', 'SourceSansPro-Semibold.otf', 600, 'normal'],
  ['Source Sans Pro', 'SourceSansPro-Bold.otf', 700, 'normal'],
];

// The grid renders mono at 400 only. If a grid rule ever asks for bold or
// light, point it back at CODE_PRO — otherwise Chromium synthesises the
// weight and the pixel-tuned page shifts. (Verified with `pdffonts`: the
// grid PDF embeds SourceCodePro-Regular and nothing else.) Derived rather
// than copied, so a font-file rename cannot update one list and miss the
// other.
const CODE_PRO_REGULAR: FontFace[] = CODE_PRO.filter(([, , weight]) => weight === 400);

const THEME_FONTS: Record<Theme, FontFace[][]> = {
  grid: [SOURCE_SANS, CODE_PRO_REGULAR], // sans content + mono data column
  terminal: [CODE_PRO], // shell — genuinely uses all four mono weights
};

export function fontFaces(theme: Theme): string {
  return THEME_FONTS[theme]
    .flat()
    .map(([family, file, weight, style]) => {
      const buf = readFileSync(join(ROOT, 'fonts', file));
      const fmt = file.endsWith('.otf') ? 'opentype' : 'truetype';
      return `@font-face{font-family:'${family}';src:url(data:font/${fmt};base64,${buf.toString(
        'base64',
      )}) format('${fmt}');font-weight:${weight};font-style:${style};}`;
    })
    .join('\n');
}
