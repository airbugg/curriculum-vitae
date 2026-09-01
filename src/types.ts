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
  /** "english=native, hebrew=native, …" — parsed by lib/background.ts. */
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
}

/** The modernist grid — src/themes/grid.css. */
export interface GridVariant extends VariantBase {
  theme: 'grid';
  /** Opts into grid.css's `.g-dense` package (a tighter --gp-* rhythm). */
  density?: 'dense';
  stackRows: StackRow[];
  /**
   * Render the stack ledger directly under the intro instead of inside
   * BACKGROUND — screeners resolve "what's their stack" in the first scan,
   * so a screening-oriented variant leads with it.
   */
  stackFirst?: boolean;
}

/** The terminal session — src/themes/terminal.css. */
export interface TerminalVariant extends VariantBase {
  theme: 'terminal';
}

/** Picking a theme picks a stylesheet, a font set, a layout — and a prop set. */
export type Variant = GridVariant | TerminalVariant;
