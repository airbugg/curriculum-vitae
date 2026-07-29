import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const FONT_SETS = {
  sourceSans: [
    ['Source Sans Pro', 'SourceSansPro-Light.otf', 300, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-LightIt.otf', 300, 'italic'],
    ['Source Sans Pro', 'SourceSansPro-Regular.otf', 400, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-It.otf', 400, 'italic'],
    ['Source Sans Pro', 'SourceSansPro-Semibold.otf', 600, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-Bold.otf', 700, 'normal'],
  ],
  roboto: [
    ['Roboto', 'Roboto-Light.ttf', 300, 'normal'],
    ['Roboto', 'Roboto-Regular.ttf', 400, 'normal'],
    ['Roboto', 'Roboto-Italic.ttf', 400, 'italic'],
    ['Roboto', 'Roboto-Medium.ttf', 500, 'normal'],
    ['Roboto', 'Roboto-Bold.ttf', 700, 'normal'],
  ],
  mono: [
    ['Roboto Mono', 'RobotoMono-Thin.ttf', 100, 'normal'],
    ['Roboto Mono', 'RobotoMono-Light.ttf', 300, 'normal'],
    ['Roboto Mono', 'RobotoMono-Regular.ttf', 400, 'normal'],
    ['Roboto Mono', 'RobotoMono-Italic.ttf', 400, 'italic'],
    ['Roboto Mono', 'RobotoMono-Medium.ttf', 500, 'normal'],
    ['Roboto Mono', 'RobotoMono-Bold.ttf', 700, 'normal'],
  ],
  codePro: [
    ['Source Code Pro', 'SourceCodePro-ExtraLight.ttf', 200, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Light.ttf', 300, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Regular.ttf', 400, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Semibold.ttf', 600, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Bold.ttf', 700, 'normal'],
  ],
};

const THEME_FONTS = {
  platform: ['sourceSans', 'codePro', 'mono'],
  generalist: ['roboto', 'mono'],
  ai: ['sourceSans', 'mono'],
  looker: ['sourceSans', 'codePro', 'mono'],
  parser: [],
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
