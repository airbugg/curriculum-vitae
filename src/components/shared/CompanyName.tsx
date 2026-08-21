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

function Mark({ asset }: { asset: LogoAsset }): ReactNode {
  // co-art-<slug> lets a theme size each asset from its own geometry.
  const cls = `co-mark co-art-${asset.slug}`;
  if (asset.type === 'svg')
    return <span className={cls} dangerouslySetInnerHTML={{ __html: asset.data }} />;
  return (
    <span className={cls}>
      <img src={asset.data} alt="" />
    </span>
  );
}

export function CompanyName({ company, label }: { company: string; label?: string }): ReactNode {
  const mark = logos[company]?.mark;
  return (
    <>
      {mark && <Mark asset={mark} />}
      {tidyLabel(label ?? company)}
    </>
  );
}
