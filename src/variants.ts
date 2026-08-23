// The two variants: which bullets, what intro, which theme. The theme picks
// the stylesheet, the font sets and the layout — see entry.tsx, lib/fonts.ts
// and the dispatch in components/CVPage.tsx.
import { intro } from './lib/content.ts';
import type { Section, Variant } from './types.ts';

// Content parity between the two variants is an owner decree: same bullet
// set, same summaries — the shell's terminal look does the calming, not
// cuts. Shared here so parity cannot silently drift.
const SECTIONS: Section[] = [
  { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
  { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
  { job: 'rewire', bullets: ['reactNative', 'xstate', 'secondAuth'] },
  { job: 'wix', bullets: ['forms', 'auth'] },
];

export const variants: Variant[] = [
  // The canonical variant: modernist grid, dense rhythm, three stack rows.
  {
    file: 'eugene-lerman',
    label: 'The Default · Modernist Grid',
    theme: 'grid',
    density: 'dense',
    // The BACKGROUND stack row, subdivided (keys in content/skills.md).
    stackRows: [
      ['frontend', 'stackFrontend'],
      ['backend', 'stackBackend'],
      ['infra', 'stackInfra'],
    ],
    intro: intro('default'),
    sections: SECTIONS,
  },

  // The whole CV as one terminal session; commands are the structure.
  {
    file: 'eugene-lerman-shell',
    label: 'The Shell · full-page terminal session',
    theme: 'terminal',
    intro: intro('shell'),
    sections: SECTIONS,
  },
];
