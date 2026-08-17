// Build entry: bundled by esbuild, imported by build.ts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVPage } from './components/CVPage';
import { fontFaces } from './lib/fonts';
import type { Variant } from './types';

const SRC = join(process.cwd(), 'src');

export { variants } from './variants';
// Content atoms and the date parser re-exported for build.ts's pre-render
// validation pass, so it validates with the same code that renders.
export * as content from './lib/content';
export { duration } from './lib/dates';

export function renderVariant(variant: Variant): string {
  const css = [
    fontFaces(variant.theme),
    readFileSync(join(SRC, 'themes', 'base.css'), 'utf8'),
    readFileSync(join(SRC, 'themes', `${variant.theme}.css`), 'utf8'),
  ].join('\n');
  return '<!DOCTYPE html>' + renderToStaticMarkup(<CVPage variant={variant} css={css} />);
}
