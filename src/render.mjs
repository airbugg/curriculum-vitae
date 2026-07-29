import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { person, jobs, education, skills } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const esc = (s) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// ---------------------------------------------------------------- fonts ----
const FONT_SETS = {
  sourceSans: [
    ['Source Sans Pro', 'SourceSansPro-Regular.otf', 400, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-It.otf', 400, 'italic'],
    ['Source Sans Pro', 'SourceSansPro-Semibold.otf', 600, 'normal'],
    ['Source Sans Pro', 'SourceSansPro-Bold.otf', 700, 'normal'],
  ],
  roboto: [
    ['Roboto', 'Roboto-Light.ttf', 300, 'normal'],
    ['Roboto', 'Roboto-Regular.ttf', 400, 'normal'],
    ['Roboto', 'Roboto-Italic.ttf', 400, 'italic'],
    ['Roboto', 'Roboto-Medium.ttf', 500, 'normal'],
    ['Roboto', 'Roboto-Bold.ttf', 700, 'normal'],
  ],
  robotoThin: [['Roboto Thin', 'Roboto-Thin.ttf', 100, 'normal']],
  mono: [
    ['Roboto Mono', 'RobotoMono-Regular.ttf', 400, 'normal'],
    ['Roboto Mono', 'RobotoMono-Medium.ttf', 500, 'normal'],
  ],
  codePro: [
    ['Source Code Pro', 'SourceCodePro-Regular.ttf', 400, 'normal'],
    ['Source Code Pro', 'SourceCodePro-Semibold.ttf', 600, 'normal'],
  ],
};

const THEME_FONTS = {
  platform: ['sourceSans', 'codePro'],
  generalist: ['roboto'],
  ai: ['sourceSans', 'mono'],
  looker: ['sourceSans', 'roboto', 'robotoThin'],
  parser: [],
};

function fontFaces(theme) {
  const sets = THEME_FONTS[theme] ?? [];
  return sets
    .flatMap((set) => FONT_SETS[set])
    .map(([family, file, weight, style]) => {
      const buf = readFileSync(join(ROOT, 'fonts', file));
      const fmt = file.endsWith('.otf') ? 'opentype' : 'truetype';
      return `@font-face{font-family:'${family}';src:url(data:font/${fmt};base64,${buf.toString(
        'base64',
      )}) format('${fmt}');font-weight:${weight};font-style:${style};}`;
    })
    .join('\n');
}

// ------------------------------------------------------------- components ----
function contactItems(theme) {
  const items = [
    person.location,
    person.phone,
    person.email,
    person.github,
    person.linkedin,
    person.site,
  ];
  return items.map((i) => `<span>${esc(i)}</span>`).join('<span class="sep">·</span>');
}

function entryHtml(section) {
  const job = jobs[section.job];
  const bullets = section.bullets
    .map((id) => section.overrides?.[id] ?? job.bullets[id])
    .map((t) => `<li>${esc(t)}</li>`)
    .join('');
  const blurb = job.blurb ? `<span class="blurb">${esc(job.blurb)}</span>` : '';
  return `<article class="entry">
    <div class="entry-head">
      <div class="entry-co"><span class="company">${esc(job.company)}</span>${blurb}</div>
      <div class="dates">${esc(job.dates)}</div>
    </div>
    <div class="entry-sub"><span class="role">${esc(job.role)}</span><span class="loc">${esc(
      job.location,
    )}</span></div>
    <ul>${bullets}</ul>
  </article>`;
}

function skillsHtml(variant) {
  const rows = variant.skills
    .map(([cat, key]) => {
      const text = variant.skillsRaw ? key : skills[key] ?? key;
      return `<div class="skill"><span class="cat">${esc(cat)}</span><span class="val">${esc(
        text,
      )}</span></div>`;
    })
    .join('');
  return `<section class="skills"><h2>${esc(variant.headings.skills)}</h2>${rows}</section>`;
}

function educationHtml(variant) {
  return `<section class="edu"><h2>${esc(variant.headings.education)}</h2>
    <div class="edu-row"><span class="degree">${esc(education.degree)}</span><span class="school">${esc(
      education.school,
    )}</span><span class="dates">${esc(education.dates)}</span></div>
  </section>`;
}

function experienceHtml(variant) {
  return `<section class="xp"><h2>${esc(variant.headings.experience)}</h2>${variant.sections
    .map(entryHtml)
    .join('')}</section>`;
}

// ------------------------------------------------------------------ page ----
export function renderVariant(variant) {
  const base = readFileSync(join(ROOT, 'src', 'themes', 'base.css'), 'utf8');
  const theme = readFileSync(join(ROOT, 'src', 'themes', `${variant.theme}.css`), 'utf8');

  const howIWork = variant.howIWork
    ? `<section class="how"><h2>${esc(variant.howIWork.heading)}</h2><p>${esc(
        variant.howIWork.text,
      )}</p></section>`
    : '';

  const header = `<header>
    <h1>${esc(person.name)}</h1>
    <div class="title">${esc(person.title)}</div>
    <div class="contacts">${contactItems(variant.theme)}</div>
  </header>`;

  const intro = `<p class="intro">${esc(variant.intro)}</p>`;

  const body =
    variant.layout === 'sidebar'
      ? `${header}
        <div class="cols">
          <aside>${skillsHtml(variant)}${educationHtml(variant)}</aside>
          <div class="main">${intro}${howIWork}${experienceHtml(variant)}</div>
        </div>`
      : `${header}${intro}${howIWork}${experienceHtml(variant)}${skillsHtml(
          variant,
        )}${educationHtml(variant)}`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(person.name)} — CV</title>
<style>
${fontFaces(variant.theme)}
${base}
${theme}
</style></head>
<body><div class="page">${body}</div></body></html>`;
}
