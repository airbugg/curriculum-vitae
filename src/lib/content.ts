// Loads CV content from content/*.md. Frontmatter carries the facts; list
// items with {#id} anchors carry the bullets. Everything is parsed and
// checked once, here, so components can trust the shapes in src/types.ts —
// and so a typo fails the build naming the file rather than quietly
// dropping a fact out of the PDF.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Education, Job, Person, Publication } from '../types.ts';

// Resolved from the working directory; build.ts chdirs to the repo root
// before importing, which is what makes this hold.
const CONTENT = join(process.cwd(), 'content');

/**
 * Reads content/<file> and runs `parse` over it, prefixing anything thrown
 * with the file's repo-relative path. Every loader goes through here, so an
 * error names its file exactly once — without it the message points into
 * .build/entry.mjs, a bundled artifact whoever is editing content has never
 * heard of.
 */
function inFile<T>(file: string, parse: (src: string) => T): T {
  try {
    return parse(readFileSync(join(CONTENT, file), 'utf8'));
  } catch (e) {
    throw new Error(`content/${file}: ${(e as Error).message}`, { cause: e });
  }
}

// `key: value`, one per line, value runs to the end of the line — not YAML,
// because these values are prose: YAML turns `[stealth]` into an array,
// `{redacted}` into an object, drops a leading `&` as an anchor, and throws
// on `blurb: fintech: cross-border payments`.
function parseFrontmatter(src: string): [Record<string, string>, string] {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  // Every caller requires frontmatter, so a missing match is a broken fence,
  // not an empty block. Returning {} here would report nine missing keys
  // instead of the one mistyped `---` sitting in front of the reader.
  if (!m) throw new Error('frontmatter must open and close with a line of exactly ---');
  const [, block = '', body = ''] = m;
  const meta: Record<string, string> = {};
  for (const line of block.split('\n')) {
    if (!line.trim()) continue;
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) throw new Error(`frontmatter line is not "key: value": ${line.trim().slice(0, 60)}…`);
    const [, key = '', value = ''] = kv;
    if (key in meta) throw new Error(`duplicate frontmatter key: ${key}`);
    meta[key] = value.replace(/^"(.*)"$/, '$1');
  }
  return [meta, body];
}

/**
 * Every key of T, marked by whether frontmatter must carry it. Because it is
 * a mapped type over `keyof T`, a spec cannot omit a key, cannot mark an
 * optional one required, and cannot describe a non-string field — which is
 * what makes the cast in `fields` sound rather than merely plausible.
 */
type Spec<T> = {
  [K in keyof T]-?: T[K] extends string | undefined
    ? undefined extends T[K]
      ? 'optional'
      : 'required'
    : never;
};

/**
 * Frontmatter → a typed record. Missing required keys throw, and so do keys
 * the spec does not mention: `summry:` would otherwise parse fine, be stored
 * under a name nothing reads, and take the summary line out of the PDF
 * without a word.
 */
function fields<T>(meta: Record<string, string>, spec: Spec<T>): T {
  const missing = Object.keys(spec).filter(
    (k) => spec[k as keyof T] === 'required' && !meta[k]?.trim(),
  );
  if (missing.length) throw new Error(`missing or empty frontmatter key(s): ${missing.join(', ')}`);
  const unknown = Object.keys(meta).filter((k) => !(k in spec));
  if (unknown.length)
    throw new Error(
      `unknown frontmatter key(s): ${unknown.join(', ')} — typo, or add it to the type`,
    );
  return meta as T;
}

/**
 * "- text possibly\n  wrapped {#id}" → { id: text }. Anything in the body
 * that is not a bullet is a mistake — a `-text` typo would otherwise vanish
 * silently — as is a reused anchor, which would overwrite the first bullet
 * and drop it from the page.
 */
function parseBullets(body: string): Record<string, string> {
  const bullets: Record<string, string> = {};
  for (const block of body.split(/\n(?=- )/)) {
    const item = block.trim();
    if (!item) continue;
    if (!item.startsWith('- ')) throw new Error(`not a bullet: ${item.slice(0, 60)}…`);
    const idMatch = item.match(/\{#([\w-]+)\}\s*$/);
    if (!idMatch) throw new Error(`bullet missing {#id} anchor: ${item.slice(0, 60)}…`);
    const [, id = ''] = idMatch;
    if (id in bullets) throw new Error(`duplicate bullet anchor {#${id}}`);
    const text = item
      .slice(2)
      .replace(/\{#[\w-]+\}\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
    // `- {#id}` parses fine and renders an empty <li> on the page.
    if (!text) throw new Error(`bullet {#${id}} has no text`);
    // Backticks become <code> chips downstream by splitting on them, so an
    // odd count means a chip silently renders as plain text in the PDF.
    if (text.split('`').length % 2 === 0)
      throw new Error(`bullet {#${id}} has an unclosed backtick`);
    bullets[id] = text;
  }
  return bullets;
}

function loadJobs(): Record<string, Job> {
  const dir = join(CONTENT, 'jobs');
  const jobs: Record<string, Job> = {};
  // The sort only makes iteration deterministic; the numeric filename
  // prefixes are documentation. Render order comes from variants.ts.
  for (const file of readdirSync(dir).sort()) {
    const job = inFile(join('jobs', file), (src) => {
      const [meta, body] = parseFrontmatter(src);
      return {
        ...fields<Omit<Job, 'bullets'>>(meta, {
          id: 'required',
          company: 'required',
          role: 'required',
          location: 'required',
          dates: 'required',
          blurb: 'optional',
          summary: 'optional',
        }),
        bullets: parseBullets(body),
      };
    });
    // Two files claiming one id would silently overwrite, and whichever
    // sorted later would render under the other's name.
    if (job.id in jobs) throw new Error(`content/jobs/${file}: duplicate job id '${job.id}'`);
    jobs[job.id] = job;
  }
  return jobs;
}

/**
 * skills.md and intro.md share one shape: an H1 and prose preamble, then
 * `## key` / blank line / value. Values reflow to a single line, so the
 * layout owns the wrapping rather than the source file, and a value may
 * contain a `#` (as in "C#") because only the next heading ends it.
 */
function loadHeadings(file: string): Record<string, string> {
  return inFile(file, (src) => {
    const keyed: Record<string, string> = {};
    for (const block of src.split(/^## /m).slice(1)) {
      const nl = (block + '\n').indexOf('\n');
      const key = block.slice(0, nl).trim();
      // A repeated heading would replace the first value outright — a whole
      // intro paragraph or skill row swapped, with nothing to notice it.
      if (key in keyed) throw new Error(`duplicate '## ${key}' section`);
      keyed[key] = block.slice(nl).replace(/\s+/g, ' ').trim();
    }
    return keyed;
  });
}

const frontmatterOf = <T>(file: string, spec: Spec<T>): T =>
  inFile(file, (src) => fields<T>(parseFrontmatter(src)[0], spec));

export const person = frontmatterOf<Person>('person.md', {
  name: 'required',
  title: 'required',
  location: 'required',
  phone: 'required',
  email: 'required',
  github: 'required',
  linkedin: 'required',
  langLevels: 'required',
  offHours: 'required',
});

export const education = frontmatterOf<Education>('education.md', {
  school: 'required',
  schoolShort: 'optional',
  degree: 'required',
  degreeShort: 'optional',
  dates: 'required',
});

export const publication = frontmatterOf<Publication>('publications.md', {
  title: 'required',
  journal: 'required',
  year: 'required',
  url: 'required',
  authors: 'optional',
});

// The one content value that lands in an href; the page must never link
// anywhere but over https.
if (!publication.url.startsWith('https://'))
  throw new Error(`publications.md: url must start with https:// (got '${publication.url}')`);

export const jobs = loadJobs();

/** A `## key` lookup that names the file and the key it could not find. */
function heading(file: string, groups: Record<string, string>) {
  return (key: string): string => {
    const value = groups[key];
    if (value === undefined) throw new Error(`no '${key}' key in content/${file}`);
    return value;
  };
}

const introSections = loadHeadings('intro.md');
const skillGroups = loadHeadings('skills.md');

/** The opening paragraph for a variant, by its `## key` in content/intro.md. */
export const intro = heading('intro.md', introSections);

/** The chip list under a `## key` in content/skills.md. */
export const skills = heading('skills.md', skillGroups);

/** The keys skills() will answer to — src/validate.ts checks variants first. */
export const skillKeys = Object.keys(skillGroups);
