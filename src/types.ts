// The content and variant schema — the shapes content/*.md provides and a
// variant selects. Loaders in lib/content.ts validate required keys at
// startup, so downstream code can trust these without optional chaining.

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
  authors: string;
}

/** One employer block in a variant: which job, which of its bullets. */
export interface Section {
  job: string;
  bullets: string[];
}

export type Theme = 'grid' | 'terminal';

export interface Variant {
  /** Output basename: dist/<file>.pdf */
  file: string;
  label: string;
  /** Picks the CSS file, the font sets and the page layout. */
  theme: Theme;
  /** Extra class on <body> (the default variant's g-dense density package). */
  bodyClass?: string;
  /** BACKGROUND STACK sub-rows: [label, key into content/skills.md]. */
  stackRows?: [label: string, skillsKey: string][];
  intro: string;
  sections: Section[];
}
