// Build entry: bundled by esbuild, imported by build.ts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVPage } from './components/CVPage.tsx';
import { fontFaces } from './lib/fonts.ts';
import type { Variant } from './types.ts';

const SRC = join(process.cwd(), 'src');

export { variants } from './variants.ts';
// build.ts runs this before rendering, so it validates against the same
// modules that render.
export { validate } from './validate.ts';

export function renderVariant(variant: Variant): string {
  const css = [
    fontFaces(variant.theme),
    readFileSync(join(SRC, 'themes', 'base.css'), 'utf8'),
    readFileSync(join(SRC, 'themes', `${variant.theme}.css`), 'utf8'),
  ].join('\n');
  return '<!DOCTYPE html>' + renderToStaticMarkup(<CVPage variant={variant} css={css} />);
}
