// Backtick spans in content become <code> chips.
import type { ReactNode } from 'react';

export function Rich({ text }: { text: string }): ReactNode {
  return text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}
