// An inline logo asset: SVG markup verbatim, PNG as a data-URI img. Shared
// by every mark on the page; the className carries each site's sizing.
import type { ReactNode } from 'react';
import type { LogoAsset } from '../../lib/logos.ts';

export function InlineMark({
  asset,
  className,
}: {
  asset: LogoAsset;
  className: string;
}): ReactNode {
  if (asset.type === 'svg')
    return <span className={className} dangerouslySetInnerHTML={{ __html: asset.data }} />;
  return (
    <span className={className}>
      <img src={asset.data} alt="" />
    </span>
  );
}
