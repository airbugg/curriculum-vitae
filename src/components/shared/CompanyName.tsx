// The employer name with its official artwork. A `mark` renders before the
// name; a `wordmark` renders IN PLACE of the name (Wix/Rewire have no
// separate mark, and a wordmark next to the printed name would duplicate
// it). Missing assets degrade to the plain text name. The g-lg-<slug> class
// lets themes size each asset from its own internal geometry.
import type { ReactNode } from 'react';
import { logos, type LogoAsset } from '../../lib/logos';
import { tidyLabel } from './typography';

function Asset({ asset, className }: { asset: LogoAsset; className: string }): ReactNode {
  const cls = `${className} g-lg-${asset.slug}`;
  if (asset.type === 'svg')
    return <span className={cls} dangerouslySetInnerHTML={{ __html: asset.data }} />;
  return (
    <span className={cls}>
      <img src={asset.data} alt="" />
    </span>
  );
}

export function CompanyName({ id, text }: { id: string; text?: string }): ReactNode {
  const logo = logos[id];
  if (logo?.wordmark)
    return (
      <>
        <Asset asset={logo.wordmark} className="g-wordmark" />
        {/* The name stays in the PDF text layer (transparent, zero-width)
            so search and parsers still find the employer. */}
        <span className="g-alt">{text ?? id}</span>
      </>
    );
  return (
    <>
      {logo?.mark && <Asset asset={logo.mark} className="g-logo" />}
      {tidyLabel(text ?? id)}
    </>
  );
}
