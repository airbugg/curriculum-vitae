// The employer name as text, optionally preceded by the company's mark.
//
// The name is always real, visible, selectable text. It used to be replaced
// by a wordmark for Rylo, Rewire and Wix, with the name kept in the text
// layer as white 4pt out-of-flow type so parsers could still read it. That
// backfired twice: a hidden-text scanner flags white type on a résumé as
// keyword stuffing regardless of what it says, and absolute positioning made
// Skia paint those names last, so stream-order extractors reported them
// detached from the roles they belong to. Both are gone with the wordmarks.
//
// Rendered by both themes, so its classes take the shared co- prefix rather
// than either theme's g-/t-.
import type { ReactNode } from 'react';
import { logos, type LogoAsset } from '../../lib/logos.ts';
import { tidyLabel } from './typography.tsx';

/** An inline logo asset: SVG markup verbatim, PNG as a data-URI img. Shared
 * by every mark on the page; the className carries each site's sizing. */
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

export function CompanyName({ company }: { company: string }): ReactNode {
  const mark = logos[company];
  return (
    <>
      {/* co-art-<slug> lets a theme size each asset from its own geometry. */}
      {mark && <InlineMark asset={mark} className={`co-mark co-art-${mark.slug}`} />}
      {tidyLabel(company)}
    </>
  );
}
