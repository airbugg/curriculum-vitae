// The contact run. Links are live in the PDF (Chromium preserves link
// annotations in print output): tel: for the phone, mailto: for the email,
// https:// for the profile URLs. Location stays plain text.
import type { ReactNode } from 'react';
import { person } from '../../lib/content.ts';

export interface ContactItem {
  text: string;
  href?: string;
}

export const contacts: ContactItem[] = [
  { text: person.location },
  { text: person.phone, href: 'tel:' + person.phone.replace(/[^+\d]/g, '') },
  { text: person.email, href: `mailto:${person.email}` },
  { text: person.github, href: `https://${person.github}` },
  { text: person.linkedin, href: `https://${person.linkedin}` },
];

export function Contact({ item }: { item: ContactItem }): ReactNode {
  return item.href ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>;
}
