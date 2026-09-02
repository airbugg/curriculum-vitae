// The variants: which bullets, what intro, which theme. The theme picks
// the stylesheet, the font sets and the layout — see entry.tsx, lib/fonts.ts
// and the dispatch in components/CVPage.tsx.
import { intro } from './lib/content.ts';
import type { GridVariant, Section, Variant } from './types.ts';

// Content parity between the two design variants is an owner decree: same
// bullet set, same summaries — the shell's terminal look does the calming,
// not cuts. Shared here so parity cannot silently drift. The full-stack
// screening cut is exempt (decree lifted for that cut alone, 2026-09-01).
const SECTIONS: Section[] = [
  { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
  { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
  { job: 'rewire', bullets: ['reactNative', 'xstate', 'secondAuth'] },
  { job: 'wix', bullets: ['forms', 'auth'] },
];

// The full-stack cut, shared by its two files so the cut cannot fork: same
// page, backend-first bullet selection. The §13 parity decree was lifted for
// this cut only (owner, 2026-09-01) — it reframes the same true work
// server-side-first for backend/AI screening, and every claim in its bullets
// is owner-confirmed, not inferred.
const FULLSTACK = {
  theme: 'grid',
  density: 'dense',
  stackPlacement: 'combined',
  stackRows: [
    ['languages', 'stackLanguages'],
    ['full-stack', 'stackFullstack'],
    ['infra', 'stackInfra'],
  ],
  intro: intro('fullstack'),
  sections: [
    { job: 'rylo', bullets: ['rewrite', 'release', 'agentSkills'] },
    { job: 'remitlyStaff', bullets: ['lead', 'llmPipeline', 'l10nService'] },
    { job: 'rewire', bullets: ['workflowEngine', 'ci'] },
    { job: 'wix', bullets: ['forms', 'auth'] },
  ],
} satisfies Omit<GridVariant, 'file' | 'label'>;

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
      ['cloud & CI', 'stackInfra'],
    ],
    intro: intro('default'),
    sections: SECTIONS,
  },

  {
    ...FULLSTACK,
    file: 'eugene-lerman-fullstack',
    label: 'The Full-Stack · backend-first cut',
  },

  // The screening cut again, with brand marks on the tech chips. Builds
  // (and ships in PR artifacts) but is not attached to releases:
  // .releaserc.json omits it pending the owner's verdict on the look.
  {
    ...FULLSTACK,
    file: 'eugene-lerman-fullstack-icons',
    label: 'The Full-Stack · tech marks',
    techIcons: true,
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
