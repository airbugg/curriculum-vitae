// Loads CV content from content/*.md — frontmatter for facts, list items
// with {#id} anchors for bullets. No markdown library needed; the format is
// deliberately small. Loaders validate required keys at startup so the
// components can trust the shapes in src/types.ts.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Education, Job, Person, Publication } from '../types';

// Resolved from the working directory; build.ts chdirs to the repo root
// before importing, which is what makes this hold.
const CONTENT = join(process.cwd(), 'content');

function parseFrontmatter(src: string): [Record<string, string>, string] {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return [{}, src];
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return [meta, m[2]];
}

// Frontmatter → a typed record, throwing on missing required keys. The cast
// is honest: every non-optional key of T was just checked.
function typed<T>(meta: Record<string, string>, required: (keyof T & string)[], file: string): T {
  const missing = required.filter((k) => !meta[k]);
  if (missing.length) throw new Error(`${file}: missing frontmatter key(s): ${missing.join(', ')}`);
  return meta as T;
}

const front = (file: string) => parseFrontmatter(readFileSync(join(CONTENT, file), 'utf8'))[0];

// "- text possibly\n  wrapped {#id}" → { id: text }. Anything in the body
// that is not a bullet is a mistake (a `-text` typo would otherwise vanish
// silently), so it throws.
function parseBullets(body: string): Record<string, string> {
  const bullets: Record<string, string> = {};
  for (const block of body.split(/\n(?=- )/)) {
    const item = block.trim();
    if (!item) continue;
    if (!item.startsWith('- ')) throw new Error(`Not a bullet: ${item.slice(0, 60)}…`);
    const idMatch = item.match(/\{#([\w-]+)\}\s*$/);
    if (!idMatch) throw new Error(`Bullet missing {#id} anchor: ${item.slice(0, 60)}…`);
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
      const job = typed<Omit<Job, 'bullets'>>(meta, ['id', 'company', 'role', 'location', 'dates'], file);
      jobs[job.id] = { ...job, bullets: parseBullets(body) };
    } catch (e) {
      throw new Error(`content/jobs/${file}: ${(e as Error).message}`);
    }
  }
  return jobs;
}

// skills.md: one `## key` heading per group, the next non-empty line is the
// value (which may itself contain `#`, e.g. "C#" — only a newline ends it).
function loadSkills(): Record<string, string> {
  const src = readFileSync(join(CONTENT, 'skills.md'), 'utf8');
  const skills: Record<string, string> = {};
  for (const m of src.matchAll(/^## (\w+)\n+(.+)/gm)) skills[m[1]] = m[2].trim();
  return skills;
}

// intro.md: one `## key` paragraph per variant. The text reflows to a
// single line — the layout owns the wrapping, not the source file.
function loadIntros(): Record<string, string> {
  const src = readFileSync(join(CONTENT, 'intro.md'), 'utf8');
  const intros: Record<string, string> = {};
  for (const block of src.split(/^## /m).slice(1)) {
    const nl = (block + '\n').indexOf('\n');
    intros[block.slice(0, nl).trim()] = block.slice(nl).replace(/\s+/g, ' ').trim();
  }
  return intros;
}

export const person = typed<Person>(
  front('person.md'),
  ['name', 'title', 'location', 'phone', 'email', 'github', 'linkedin', 'langLevels', 'offHours'],
  'person.md',
);
export const education = typed<Education>(front('education.md'), ['school', 'degree', 'dates'], 'education.md');
export const intros = loadIntros();
export const jobs = loadJobs();
export const skills = loadSkills();
// Publications: one frontmatter block per paper. Returned as a list so the
// components render uniformly whether there is one paper or several.
export const publications: Publication[] = [
  typed<Publication>(front('publications.md'), ['title', 'journal', 'year', 'url', 'authors'], 'publications.md'),
];
