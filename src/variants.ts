// The variants: which bullets, what intro, which theme. The theme picks
// the stylesheet, the font sets and the layout — see entry.tsx, lib/fonts.ts
// and the dispatch in components/CVPage.tsx.
import { intro } from './lib/content.ts';
import type { GridVariant, Section, Variant } from './types.ts';

// Content parity between the default and the shell is an owner decree: same
// bullet set, same summaries — the shell's terminal look does the calming,
// not cuts. Shared here so parity cannot silently drift. The full-stack
// screening cut is exempt (parity decree lifted for that cut alone; owner,
// 2026-09-01).
const SECTIONS: Section[] = [
  { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
  { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
  { job: 'rewire', bullets: ['reactNative', 'xstate', 'secondAuth'] },
  { job: 'wix', bullets: ['forms', 'auth'] },
];

// The one grid construction (owner decree, 2026-09-03): every grid cut is
// formatted as the icon-marked screening page — the masthead trio, the
// { TECH } / { BACKGROUND } sibling sections, brand marks on the chips.
// Cuts override content (intro, sections, headline, contact) only, so the
// formatting cannot drift across the family. Carries the screening cut's
// own backend-first bullets and intro as defaults; every claim in them is
// owner-confirmed, not inferred.
const SCREEN: Omit<GridVariant, 'file' | 'label'> = {
  theme: 'grid',
  density: 'dense',
  stackPlacement: 'combined',
  techIcons: true,
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
};

// The staff cut's shared shape, spread by its two files so it cannot fork.
const STAFF: Omit<GridVariant, 'file' | 'label'> = {
  ...SCREEN,
  title: 'Staff Software Engineer',
  omitPublication: true,
  intro: intro('staff'),
  sections: [
    { job: 'rylo', bullets: ['rewrite', 'direction', 'agentSkills'] },
    { job: 'remitlyStaff', bullets: ['lead', 'direction', 'llmPipeline'] },
    { job: 'rewire', bullets: ['reactNative', 'workflowEngine'] },
    { job: 'wix', bullets: ['forms', 'auth'] },
  ],
};

export const variants: Variant[] = [
  // The canonical variant: the construction above with the generalist
  // bullet set and intro.
  {
    ...SCREEN,
    file: 'eugene-lerman',
    label: 'The Default · Modernist Grid',
    intro: intro('default'),
    sections: SECTIONS,
  },

  // The screening cut without the direct contact channels: for posting in
  // the open, where a name/phone/email combination invites scraping.
  // Builds (and ships in PR artifacts) but is not attached to releases:
  // .releaserc.json omits it pending the owner's say-so.
  {
    ...SCREEN,
    file: 'eugene-lerman-public',
    label: 'The Full-Stack · public contact cut',
    publicContact: true,
  },

  // The staff cut: leadership-first bullets, the staff intro, and the
  // headline of the owner's last held level (Staff Software Engineer,
  // Remitly, Dec 2022 – Feb 2026; owner decision, 2026-09-03 — per-role
  // titles stay exact). Every claim owner-confirmed in a structured
  // interview. The publication row is traded for bullet space (owner,
  // 2026-09-03). Neither file is attached to releases yet.
  {
    ...STAFF,
    file: 'eugene-lerman-staff',
    label: 'The Staff · leadership-first cut',
  },

  // The staff cut again, without the direct contact channels: the copy to
  // post in the open.
  {
    ...STAFF,
    file: 'eugene-lerman-staff-public',
    label: 'The Staff · public contact cut',
    publicContact: true,
  },

  // The full-stack screening cut, exactly the base construction. The
  // separate tech-marks file was merged into this one (owner, 2026-09-03):
  // the icons ARE the formatting now, so one file serves both.
  {
    ...SCREEN,
    file: 'eugene-lerman-fullstack',
    label: 'The Full-Stack · backend-first cut',
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
