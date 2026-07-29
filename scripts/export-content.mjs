// Export content/*.md + src/variants.mjs into .build/cv-content.json for the
// Typst toolchain. This is a SECOND, parallel toolchain: it deliberately does
// NOT import src/lib/content.mjs (owned by another agent). The frontmatter
// format is trivial and parsed here directly.
//
// Every human-readable string (bullets, skills, intro, howIWork, overrides) is
// pre-split on backticks into segment arrays: [["t","text"],["c","chip"],...]
// so cv.typ never has to parse markdown/backticks itself.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { variants } from '../src/variants.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const contentDir = join(root, 'content');
const jobsDir = join(contentDir, 'jobs');

// --- frontmatter parsing -----------------------------------------------------

// Parse `--- ... ---` frontmatter into { data, body }.
function parseFrontmatter(raw) {
  const text = raw.replace(/^﻿/, '');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text.trim() };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const km = line.match(/^([A-Za-z0-9_]+):\s?(.*)$/);
    if (!km) continue;
    let val = km[2].trim();
    // strip surrounding matching quotes
    if (
      (val.startsWith('"') && val.endsWith('"') && val.length >= 2) ||
      (val.startsWith("'") && val.endsWith("'") && val.length >= 2)
    ) {
      val = val.slice(1, -1);
    }
    data[km[1]] = val;
  }
  return { data, body: m[2].trim() };
}

// Collapse markdown soft-wrapping (newlines + indentation) into single spaces.
function unwrap(s) {
  return s.replace(/\s*\r?\n\s*/g, ' ').replace(/[ \t]+/g, ' ').trim();
}

// Split a string on backticks into typed segments. Even chunks are text ("t"),
// odd chunks are tech chips ("c"). Empty text chunks are dropped.
function segments(s) {
  const parts = String(s).split('`');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    const kind = i % 2 === 0 ? 't' : 'c';
    const piece = parts[i];
    if (kind === 't') {
      if (piece.length) out.push(['t', piece]);
    } else {
      out.push(['c', piece]);
    }
  }
  return out.length ? out : [['t', '']];
}

// --- person / education / publications --------------------------------------

const person = parseFrontmatter(readFileSync(join(contentDir, 'person.md'), 'utf8')).data;
const education = parseFrontmatter(readFileSync(join(contentDir, 'education.md'), 'utf8')).data;
const publications = parseFrontmatter(readFileSync(join(contentDir, 'publications.md'), 'utf8')).data;

// --- jobs --------------------------------------------------------------------

const jobs = {};
for (const fname of readdirSync(jobsDir).filter((f) => f.endsWith('.md'))) {
  const { data, body } = parseFrontmatter(readFileSync(join(jobsDir, fname), 'utf8'));
  const bullets = {};
  if (body) {
    for (const chunk of body.split(/\n(?=- )/)) {
      const trimmed = chunk.trim();
      if (!trimmed.startsWith('- ')) continue;
      const idm = trimmed.match(/\{#([A-Za-z0-9_-]+)\}\s*$/);
      const id = idm ? idm[1] : null;
      let textPart = trimmed.replace(/^-\s+/, '').replace(/\s*\{#[A-Za-z0-9_-]+\}\s*$/, '');
      textPart = unwrap(textPart);
      if (id) bullets[id] = segments(textPart);
    }
  }
  jobs[data.id] = {
    id: data.id,
    company: data.company || '',
    blurb: data.blurb || '',
    role: data.role || '',
    location: data.location || '',
    dates: data.dates || '',
    bullets,
  };
}

// --- skills (## key headings, one body line each) ----------------------------

const skillsRaw = readFileSync(join(contentDir, 'skills.md'), 'utf8');
const skills = {};
{
  const lines = skillsRaw.split(/\r?\n/);
  let key = null;
  const buf = [];
  const flush = () => {
    if (key) {
      const val = buf.join(' ').replace(/[ \t]+/g, ' ').trim();
      if (val) skills[key] = segments(val);
    }
    buf.length = 0;
  };
  for (const line of lines) {
    const hm = line.match(/^##\s+(.+?)\s*$/);
    if (hm) {
      flush();
      key = hm[1].trim();
      continue;
    }
    if (key) buf.push(line);
  }
  flush();
}

// --- resolve variants into a render-ready shape ------------------------------

const resolvedVariants = variants.map((v) => {
  const nameStyle = v.nameStyle === 'plain' ? 'plain' : 'braces';

  const sections = v.sections.map((sec) => {
    const job = jobs[sec.job];
    if (!job) throw new Error(`Unknown job id in variant ${v.file}: ${sec.job}`);
    const overrides = sec.overrides || {};
    const bullets = sec.bullets.map((bid) => {
      if (Object.prototype.hasOwnProperty.call(overrides, bid)) {
        return segments(unwrap(overrides[bid]));
      }
      const seg = job.bullets[bid];
      if (!seg) throw new Error(`Unknown bullet id ${bid} in job ${sec.job} (variant ${v.file})`);
      return seg;
    });
    return {
      job: job.id,
      company: job.company,
      blurb: job.blurb,
      role: job.role,
      location: job.location,
      dates: job.dates,
      bullets,
    };
  });

  // skills: either [label, rawStringValue] (skillsRaw) or [label, skills.md key]
  const skillRows = (v.skills || []).map(([label, ref]) => {
    if (v.skillsRaw) return [label, segments(ref)];
    const seg = skills[ref];
    if (!seg) throw new Error(`Unknown skill key ${ref} in variant ${v.file}`);
    return [label, seg];
  });

  return {
    file: v.file,
    label: v.label,
    theme: v.theme,
    nameStyle,
    intro: segments(v.intro || ''),
    howIWork: v.howIWork
      ? { heading: v.howIWork.heading, text: segments(unwrap(v.howIWork.text)) }
      : null,
    headings: v.headings,
    sections,
    skills: skillRows,
  };
});

// --- emit --------------------------------------------------------------------

const out = {
  person,
  education,
  publications,
  jobs,
  skills,
  variants: resolvedVariants,
};

const buildDir = join(root, '.build');
mkdirSync(buildDir, { recursive: true });
const outPath = join(buildDir, 'cv-content.json');
writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${outPath} (${resolvedVariants.length} variants)`);
