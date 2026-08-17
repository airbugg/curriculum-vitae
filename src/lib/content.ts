// Loads CV content from content/*.md — frontmatter for facts, list items
// with {#id} anchors for bullets. No markdown library needed; the format is
// deliberately small. Loaders validate at startup so the components can
// trust the shapes in src/types.ts, and so a typo fails the build by name
// rather than quietly dropping a fact out of the PDF.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Education, Job, Person, Publication } from '../types';

// Resolved from the working directory; build.ts chdirs to the repo root
// before importing, which is what makes this hold.
const CONTENT = join(process.cwd(), 'content');

// `key: value`, one per line, value running to the end of the line. This is
// deliberately NOT YAML: every value here is human prose, and YAML reserves
// characters that prose uses freely. `blurb: fintech: cross-border payments`
// throws under YAML, `[stealth]` and `{redacted}` silently become an array
// and an object, and a leading `&` is read as an anchor and silently
// dropped. Taking the rest of the line as a string has none of those edges.
// A line that is neither blank nor a pair is a typo, and throws rather than
// disappearing.
function parseFrontmatter(src: string): [Record<string, string>, string] {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return [{}, src];
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) throw new Error(`frontmatter line is not "key: value": ${line.trim().slice(0, 60)}`);
    meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return [meta, m[2]];
}

// Frontmatter → a typed record. Missing required keys throw, and so do keys
// that belong to neither list: `summry:` would otherwise parse fine, be
// stored under a name nothing reads, and take the summary line out of the
// PDF without a word. The cast is honest — every non-optional key of T was
// just checked.
function typed<T>(
  meta: Record<string, string>,
  required: (keyof T & string)[],
  optional: (keyof T & string)[],
  file: string,
): T {
  const missing = required.filter((k) => !meta[k]);
  if (missing.length) throw new Error(`${file}: missing frontmatter key(s): ${missing.join(', ')}`);
  const known = new Set<string>([...required, ...optional]);
  const unknown = Object.keys(meta).filter((k) => !known.has(k));
  if (unknown.length)
    throw new Error(`${file}: unknown frontmatter key(s): ${unknown.join(', ')} — typo, or add it to the type`);
  return meta as T;
}

const front = (file: string) => parseFrontmatter(readFileSync(join(CONTENT, file), 'utf8'))[0];

// "- text possibly\n  wrapped {#id}" → { id: text }. Anything in the body
// that is not a bullet is a mistake (a `-text` typo would otherwise vanish
// silently), so it throws — as does a reused anchor, which would otherwise
// overwrite the first bullet and drop it from the page.
function parseBullets(body: string): Record<string, string> {
  const bullets: Record<string, string> = {};
  for (const block of body.split(/\n(?=- )/)) {
    const item = block.trim();
    if (!item) continue;
    if (!item.startsWith('- ')) throw new Error(`Not a bullet: ${item.slice(0, 60)}…`);
    const idMatch = item.match(/\{#([\w-]+)\}\s*$/);
    if (!idMatch) throw new Error(`Bullet missing {#id} anchor: ${item.slice(0, 60)}…`);
    if (idMatch[1] in bullets) throw new Error(`Duplicate bullet anchor {#${idMatch[1]}}`);
    bullets[idMatch[1]] = item
      .slice(2)
      .replace(/\{#[\w-]+\}\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return bullets;
}

function loadJobs(): Record<string, Job> {
  const dir = join(CONTENT, 'jobs');
  const jobs: Record<string, Job> = {};
  // The sort only makes iteration deterministic; the numeric filename
  // prefixes are documentation. Render order comes from variants.ts.
  for (const file of readdirSync(dir).sort()) {
    const [meta, body] = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
    try {
      const job = typed<Omit<Job, 'bullets'>>(
        meta,
        ['id', 'company', 'role', 'location', 'dates'],
        ['blurb', 'summary'],
        file,
      );
      jobs[job.id] = { ...job, bullets: parseBullets(body) };
    } catch (e) {
      throw new Error(`content/jobs/${file}: ${(e as Error).message}`);
    }
  }
  return jobs;
}

// skills.md and intro.md share one shape: an H1 and prose preamble, then
// `## key` / blank line / value. Values reflow to a single line, so the
// layout owns the wrapping rather than the source file, and a value may
// contain a `#` (as in "C#") because only the next heading ends it.
function loadKeyed(file: string): Record<string, string> {
  const src = readFileSync(join(CONTENT, file), 'utf8');
  const keyed: Record<string, string> = {};
  for (const block of src.split(/^## /m).slice(1)) {
    const nl = (block + '\n').indexOf('\n');
    keyed[block.slice(0, nl).trim()] = block.slice(nl).replace(/\s+/g, ' ').trim();
  }
  return keyed;
}

export const person = typed<Person>(
  front('person.md'),
  ['name', 'title', 'location', 'phone', 'email', 'github', 'linkedin', 'langLevels', 'offHours'],
  [],
  'person.md',
);
export const education = typed<Education>(
  front('education.md'),
  ['school', 'degree', 'dates'],
  ['schoolShort', 'degreeShort'],
  'education.md',
);
export const intros = loadKeyed('intro.md');
export const jobs = loadJobs();
export const skills = loadKeyed('skills.md');
// Publications: one frontmatter block per paper. Returned as a list so the
// components render uniformly whether there is one paper or several.
export const publications: Publication[] = [
  typed<Publication>(
    front('publications.md'),
    ['title', 'journal', 'year', 'url'],
    ['authors'],
    'publications.md',
  ),
];
