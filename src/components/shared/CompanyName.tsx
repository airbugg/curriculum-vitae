// The employer name with its official artwork. A `mark` renders before the
// name; a `wordmark` renders IN PLACE of the name (Wix/Rewire have no
// separate mark, and a wordmark next to the printed name would duplicate
// it). Missing assets degrade to the plain text name. The co-art-<slug>
// class lets themes size each asset from its own internal geometry.
//
// Rendered by both themes, so its classes take the shared co- prefix rather
// than either theme's g-/t-.
import type { ReactNode } from 'react';
import { logos, type LogoAsset } from '../../lib/logos.ts';
import { tidyLabel } from './typography.tsx';

function Asset({ asset, className }: { asset: LogoAsset; className: string }): ReactNode {
  const cls = `${className} co-art-${asset.slug}`;
  if (asset.type === 'svg')
    return <span className={cls} dangerouslySetInnerHTML={{ __html: asset.data }} />;
  return (
    <span className={cls}>
      <img src={asset.data} alt="" />
    </span>
  );
}

export function CompanyName({ company, label }: { company: string; label?: string }): ReactNode {
  const logo = logos[company];
  if (logo?.wordmark)
    return (
      <>
        <Asset asset={logo.wordmark} className="co-wordmark" />
        {/* The name stays in the PDF text layer so search and parsers still
            find the employer: white 4pt, out of flow (see .co-alt). Only
            invisible because the page is white. */}
        <span className="co-alt">{label ?? company}</span>
      </>
    );
  return (
    <>
      {logo?.mark && <Asset asset={logo.mark} className="co-mark" />}
      {tidyLabel(label ?? company)}
    </>
  );
}
