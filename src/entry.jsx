// Build entry: bundled by esbuild, imported by build.mjs.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVPage } from './components/CV.jsx';
import { fontFaces } from './lib/fonts.mjs';

const SRC = join(process.cwd(), 'src');

export { variants } from './variants.mjs';

export function renderVariant(variant) {
  const css = [
    fontFaces(variant.theme),
    readFileSync(join(SRC, 'themes', 'base.css'), 'utf8'),
    readFileSync(join(SRC, 'themes', `${variant.theme}.css`), 'utf8'),
  ].join('\n');
  return '<!DOCTYPE html>' + renderToStaticMarkup(<CVPage variant={variant} css={css} />);
}
