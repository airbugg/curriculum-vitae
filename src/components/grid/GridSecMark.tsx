// { EXPERIENCE } — the braces join the section mark as quiet structural
// glyphs in the muted data ink; the word keeps the accent.
import type { ReactNode } from 'react';

export function GridSecMark({ children }: { children: string }): ReactNode {
  return (
    <div className="g-secmark">
      <span className="g-sb">{'{'}</span>
      <span className="g-sw">{children.toUpperCase()}</span>
      <span className="g-sb">{'}'}</span>
    </div>
  );
}
