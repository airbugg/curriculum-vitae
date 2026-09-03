// The content and variant schema. Loaders in lib/content.ts validate these
// at startup, so downstream code can trust them without optional chaining.

export interface Person {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  /** "English and Hebrew=natively; Russian=…" — ';'-separated pairs, so a
   * level may contain commas; parsed by lib/background.ts. */
  langLevels: string;
  /** Comma-separated hobby list, rendered by the shell's background block. */
  offHours: string;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  /** "Mon YYYY – Mon YYYY|Present", spaced en dash — see lib/dates.ts. */
  dates: string;
  blurb?: string;
  summary?: string;
  /** Bullet text keyed by the {#id} anchors in the job file. */
  bullets: Record<string, string>;
}

export interface Education {
  school: string;
  schoolShort?: string;
  degree: string;
  degreeShort?: string;
  dates: string;
}

export interface Publication {
  title: string;
  journal: string;
  year: string;
  url: string;
  /** Kept complete in the source of truth; no layout renders it. */
  authors?: string;
}

/** One role in a variant: which job, and which of its bullets to print. */
export interface Section {
  job: string;
  bullets: string[];
}

/** One bullet, resolved: the anchor that named it and the text it holds. */
export interface Bullet {
  id: string;
  text: string;
}

/** A Section with its job and bullets resolved — what components are handed. */
export interface Role {
  job: Job;
  /** In the order the variant asked for them. */
  bullets: Bullet[];
}

export type Theme = 'grid' | 'terminal';

/** One BACKGROUND STACK sub-row: a label and a key into content/skills.md. */
export type StackRow = [label: string, skillsKey: string];

interface VariantBase {
  /** Output basename: dist/<file>.pdf */
  file: string;
  label: string;
  intro: string;
  sections: Section[];
  /** Headline override for this cut; person.md's title otherwise. */
  title?: string;
  /** Omit the direct channels (phone, email) from the contact line — the
   * cut for posting in the open. Profile links stay. */
  publicContact?: boolean;
}

/** The modernist grid — src/themes/grid.css. */
export interface GridVariant extends VariantBase {
  theme: 'grid';
  /** Opts into grid.css's `.g-dense` package (a tighter --gp-* rhythm). */
  density?: 'dense';
  stackRows: StackRow[];
  /**
   * 'combined' is the screening cut's construction: the curated core-stack
   * line in the masthead, the { TECH } / { BACKGROUND } section pair, and
   * the publication typeset as a sub-entry of education. 'background' (the
   * default) keeps the classic single ledger row inside BACKGROUND, as the
   * design variants have always printed it.
   */
  stackPlacement?: 'combined' | 'background';
  /** Prefix each tech chip with its brand mark (src/lib/techicons.ts). */
  techIcons?: boolean;
  /** Drop the publication row from { BACKGROUND } — the staff cut trades
   * it for bullet space (owner, 2026-09-03). */
  omitPublication?: boolean;
  /** skills.md key for the masthead trio; 'stackCore' unless overridden
   * (the staff cut carries its own, screener-facing trio). */
  coreKey?: string;
}

/** The terminal session — src/themes/terminal.css. */
export interface TerminalVariant extends VariantBase {
  theme: 'terminal';
}

/** Picking a theme picks a stylesheet, a font set, a layout — and a prop set. */
export type Variant = GridVariant | TerminalVariant;
