// `tech` spans in content become <code> chips — the original CV's \mylib.
import type { ReactNode } from 'react';

export function Rich({ text }: { text: string }): ReactNode {
  const parts = String(text).split('`');
  return parts.map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}
