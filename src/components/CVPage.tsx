// The document shell: <html>, embedded CSS, and the theme dispatch.
import type { ReactNode } from 'react';
import { person } from '../lib/content.ts';
import type { Variant } from '../types.ts';
import { GridPage } from './grid/GridPage.tsx';
import { TerminalPage } from './terminal/TerminalPage.tsx';

// The <body> classes are each theme's CSS entry point: the theme name selects
// the stylesheet's root block, and the grid's optional density package rides
// along with it (see .g-dense in themes/grid.css).
const bodyClass = (variant: Variant): string =>
  variant.theme === 'grid' && variant.density ? `grid g-${variant.density}` : variant.theme;

export function CVPage({ variant, css }: { variant: Variant; css: string }): ReactNode {
  const body =
    variant.theme === 'terminal' ? (
      <TerminalPage variant={variant} />
    ) : (
      <GridPage variant={variant} />
    );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{`${person.name} — CV`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body className={bodyClass(variant)}>{body}</body>
    </html>
  );
}
