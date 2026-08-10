// The document shell: <html>, embedded CSS, and the theme dispatch.
import type { ReactNode } from 'react';
import { person } from '../lib/content';
import type { Variant } from '../types';
import { GridPage } from './grid/GridPage';
import { TerminalPage } from './terminal/TerminalPage';

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
      <body className={variant.theme + (variant.bodyClass ? ` ${variant.bodyClass}` : '')}>
        {body}
      </body>
    </html>
  );
}
