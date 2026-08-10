import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const FONT_SETS = {
  sourceSans: [
    ['Source Sans Pro', 'SourceSansPro-Light.otf', 300, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-Regular.otf', 400, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-It.otf', 400, 'italic'],
    ['Source Sans Pro', 'SourceSansPro-Semibold.otf', 600, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-Bold.otf', 700, 'normal'],
  ],
  codePro: [
    ['Source Code Pro', 'SourceCodePro-Light.ttf', 300, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Regular.ttf', 400, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Semibold.ttf', 600, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Bold.ttf', 700, 'normal'],
  ],
};

const THEME_FONTS = {
  grid: ['sourceSans', 'codePro'], // sans content + mono data column
  terminal: ['codePro'], // shell — one mono family, like a terminal
};

export function fontFaces(theme) {
  return (THEME_FONTS[theme] ?? [])
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
