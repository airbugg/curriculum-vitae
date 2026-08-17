// Selection logic over the experience sections: grouping consecutive
// same-company sections and deriving company-level tenure.
import type { Section } from '../types';
import { jobs } from './content';
import { duration, splitRange } from './dates';

// Consecutive sections sharing a company merge into one group, so a
// promotion inside one employer stacks two roles under one company block.
// Latent with current content (Remitly and Rewire are distinct companies);
// every group is a single role today.
export function groupSections(sections: Section[]): Section[][] {
  const groups: Section[][] = [];
  for (const s of sections) {
    const co = jobs[s.job].company;
    const last = groups[groups.length - 1];
    if (last && jobs[last[0].job].company === co) last.push(s);
    else groups.push([s]);
  }
  return groups;
}

// The company-level tenure: total span for multi-role groups, the single
// role's span otherwise.
export function groupDuration(group: Section[]): string | null {
  const first = jobs[group[0].job];
  if (group.length === 1) return duration(first.dates);
  const oldest = jobs[group[group.length - 1].job];
  return duration(`${splitRange(oldest.dates)[0]} – ${splitRange(first.dates)[1]}`);
}
