// Loads CV content from content/*.md — frontmatter for facts, list items
// with {#id} anchors for bullets. No markdown library needed; the format is
// deliberately small.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Resolved from the working directory (build.mjs chdirs to the repo root)
// so the bundled build output can live anywhere.
const CONTENT = join(process.cwd(), 'content');

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return [{}, src];
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return [meta, m[2]];
}

// "- text possibly\n  wrapped {#id}" → { id, text }
function parseBullets(body) {
  const bullets = {};
  for (const block of body.split(/\n(?=- )/)) {
    const item = block.trim();
    if (!item.startsWith('- ')) continue;
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

function loadJobs() {
  const dir = join(CONTENT, 'jobs');
  const jobs = {};
  for (const file of readdirSync(dir).sort()) {
    const [meta, body] = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
    if (!meta.id) throw new Error(`${file}: missing id in frontmatter`);
    jobs[meta.id] = { ...meta, bullets: parseBullets(body) };
  }
  return jobs;
}

function loadSkills() {
  const src = readFileSync(join(CONTENT, 'skills.md'), 'utf8');
  const skills = {};
  for (const m of src.matchAll(/^## (\w+)\n+([^\n#]+)/gm)) skills[m[1]] = m[2].trim();
  return skills;
}

const front = (file) => parseFrontmatter(readFileSync(join(CONTENT, file), 'utf8'))[0];

export const person = front('person.md');
export const education = front('education.md');
export const jobs = loadJobs();
export const skills = loadSkills();
