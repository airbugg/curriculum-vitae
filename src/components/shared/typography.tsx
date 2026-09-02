// Rag-control typography helpers shared by both layouts.
import type { ReactNode } from 'react';

/** Every space non-breaking: the one home for CLAUDE.md's NBSP idiom. */
export function nbsp(text: string): string {
  return text.replace(/ /g, '\u00A0');
}

// Rag control for narrow-column labels: parenthetical groups become
// unbreakable (break lands cleanly BEFORE the parenthesis), and otherwise the
// last space goes non-breaking so no single-word orphan wraps alone.
export function tidyLabel(text: string): string {
  // (m) => nbsp(m), not bare nbsp: replace() calls back with extra
  // arguments a future nbsp parameter would silently absorb.
  const paren = text.replace(/\(([^)]*)\)/g, (m) => nbsp(m));
  if (paren !== text) return paren;
  return text.replace(/ (?=\S+$)/, '\u00A0');
}

// Hyphenated compounds ("early-stage") must never break at the hyphen.
export function NoBreakCompounds({ text }: { text: string }): ReactNode {
  const parts = text.split(/(\S+-\S+)/);
  return parts.map((p, i) =>
    i % 2 ? (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        {p}
      </span>
    ) : (
      p
    ),
  );
}
