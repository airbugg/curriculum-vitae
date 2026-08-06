// Closest-possible react-pdf reproduction of the FLAGSHIP variant
// (dist/eugene-lerman.pdf). Run from the REPO ROOT so ../../src/lib/content.mjs
// resolves content/*.md against process.cwd():
//   node experiments/react-pdf/render.mjs
//
// Uses React.createElement directly (no JSX build step). The goal is fidelity
// analysis, not production code.
import { createElement as h } from 'react';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ReactPDF, { Document, Page, View, Text, Font, StyleSheet } from '@react-pdf/renderer';

// Real content (frontmatter + {#id} bullets parser lives in src/lib).
import { person, education, jobs, publications } from '../../src/lib/content.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FONTS = join(HERE, '..', '..', 'fonts');
const OUT = join(HERE, 'eugene-lerman-reactpdf.pdf');

// Allow OTF or TTF-fallback via an env flag so we can measure the difference.
const USE_OTF = process.env.SANS_FMT !== 'ttf';

// ---- Fonts --------------------------------------------------------------
// Source Sans Pro ships as OTF (CFF outlines) in this repo. Test whether
// react-pdf/fontkit can register + subset them. Fallback: Roboto (TTF).
if (USE_OTF) {
  Font.register({
    family: 'Source Sans Pro',
    fonts: [
      { src: join(FONTS, 'SourceSansPro-Light.otf'), fontWeight: 300 },
      { src: join(FONTS, 'SourceSansPro-LightIt.otf'), fontWeight: 300, fontStyle: 'italic' },
      { src: join(FONTS, 'SourceSansPro-Regular.otf'), fontWeight: 400 },
      { src: join(FONTS, 'SourceSansPro-It.otf'), fontWeight: 400, fontStyle: 'italic' },
      { src: join(FONTS, 'SourceSansPro-Semibold.otf'), fontWeight: 600 },
      { src: join(FONTS, 'SourceSansPro-Bold.otf'), fontWeight: 700 },
    ],
  });
} else {
  Font.register({
    family: 'Source Sans Pro',
    fonts: [
      { src: join(FONTS, 'Roboto-Light.ttf'), fontWeight: 300 },
      { src: join(FONTS, 'Roboto-LightItalic.ttf'), fontWeight: 300, fontStyle: 'italic' },
      { src: join(FONTS, 'Roboto-Regular.ttf'), fontWeight: 400 },
      { src: join(FONTS, 'Roboto-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
      { src: join(FONTS, 'Roboto-Medium.ttf'), fontWeight: 600 },
      { src: join(FONTS, 'Roboto-Bold.ttf'), fontWeight: 700 },
    ],
  });
}

// Source Code Pro (TTF) — name / headings / dates mono.
Font.register({
  family: 'Source Code Pro',
  fonts: [
    { src: join(FONTS, 'SourceCodePro-ExtraLight.ttf'), fontWeight: 200 },
    { src: join(FONTS, 'SourceCodePro-Light.ttf'), fontWeight: 300 },
    { src: join(FONTS, 'SourceCodePro-Regular.ttf'), fontWeight: 400 },
    { src: join(FONTS, 'SourceCodePro-It.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: join(FONTS, 'SourceCodePro-Semibold.ttf'), fontWeight: 600 },
    { src: join(FONTS, 'SourceCodePro-Bold.ttf'), fontWeight: 700 },
  ],
});
// Roboto Mono — chip font (light-bg code spans).
Font.register({
  family: 'Roboto Mono',
  fonts: [
    { src: join(FONTS, 'RobotoMono-Regular.ttf'), fontWeight: 400 },
    { src: join(FONTS, 'RobotoMono-Medium.ttf'), fontWeight: 500 },
  ],
});

// Disable hyphenation to mirror the HTML pipeline (no soft hyphens there).
Font.registerHyphenationCallback((word) => [word]);

// ---- Palette (from looker.css) ------------------------------------------
const C = {
  chipBg: '#eaf6f2', chipInk: '#29564b',
  nameFirst: '#93a39e', ink: '#232a32', inkStrong: '#14181d',
  muted: '#5c6672', accent: '#00A388', accentSoft: '#00806b',
  rule: '#cfe0da', labelInk: '#5c6672', skillInk: '#2c343d',
};

// pt-based sizes matched to base.css / looker.css (9.2pt body / 1.33).
const s = StyleSheet.create({
  page: { paddingTop: '13mm', paddingBottom: '16mm', paddingHorizontal: '16mm',
    fontFamily: 'Source Sans Pro', fontSize: 9.2, lineHeight: 1.33, color: C.ink },
  // header
  header: { textAlign: 'center' },
  h1: { fontFamily: 'Source Code Pro', fontSize: 24, fontWeight: 700, textAlign: 'center', lineHeight: 1 },
  nb: { fontWeight: 700, color: C.inkStrong, top: -1.4 },      // brace nudge (~-0.06em of 24pt)
  nf: { fontWeight: 300, color: C.nameFirst },
  nc: { fontWeight: 400, color: C.inkStrong },
  nl: { fontWeight: 700, color: C.inkStrong },
  title: { fontFamily: 'Source Code Pro', fontSize: 10.5, fontWeight: 400, color: C.accent,
    letterSpacing: 1.2, textTransform: 'uppercase', textAlign: 'center', marginTop: 2 },
  contacts: { fontSize: 7.8, color: C.muted, textAlign: 'center', marginTop: 2 },
  sep: { color: C.accent },
  intro: { fontSize: 9.5, lineHeight: 1.36, color: C.ink, marginTop: 8,
    marginHorizontal: 'auto', maxWidth: '150mm', textAlign: 'center' },
  // headings
  h2wrap: { marginTop: 11, marginBottom: 3, borderBottomWidth: 0.35, borderBottomColor: C.rule,
    paddingBottom: 2.3, flexDirection: 'row' },
  h2: { fontFamily: 'Source Code Pro', fontSize: 10.5, fontWeight: 600, letterSpacing: 0.7,
    color: C.inkStrong },
  hb: { color: C.inkStrong, fontWeight: 400 },
  hc: { color: C.accent },
  // entries
  entry: { marginBottom: 8 },
  entryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  company: { fontWeight: 700, fontSize: 9.5, color: C.inkStrong },
  blurb: { fontSize: 8, color: C.muted },
  loc: { fontSize: 8, color: C.accent, fontStyle: 'italic' },
  roleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 1 },
  role: { fontWeight: 600, fontSize: 8.5, color: C.accentSoft, letterSpacing: 0.4 },
  dates: { fontFamily: 'Source Code Pro', fontSize: 8, color: C.muted, letterSpacing: -0.2 },
  dur: { color: C.muted },
  ul: { marginTop: 3, paddingLeft: 9 },
  li: { flexDirection: 'row', marginBottom: 1.9 },
  bullet: { color: C.accent, width: 9, marginLeft: -9 },
  liText: { flex: 1 },
  chip: { fontFamily: 'Roboto Mono', fontSize: 7.9, backgroundColor: C.chipBg, color: C.chipInk },
  // skills / education
  eduRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  degree: { fontWeight: 600 },
  school: { color: C.muted, fontSize: 8, marginLeft: 7 },
  eduDates: { marginLeft: 'auto', fontFamily: 'Source Code Pro', fontSize: 8, color: C.muted },
  pubSub: { marginTop: 7, marginBottom: 2, fontSize: 8, fontWeight: 600, letterSpacing: 0.5,
    color: C.muted },
  pubHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  pubTitle: { fontWeight: 600, fontSize: 8.7, color: C.inkStrong, flex: 1 },
  pubMeta: { alignItems: 'flex-end' },
  pubJournal: { color: C.accentSoft, fontStyle: 'italic', fontSize: 8.5 },
  pubYear: { fontFamily: 'Source Code Pro', fontSize: 8, color: C.muted, fontStyle: 'italic' },
  pubAuthors: { marginTop: 1, fontSize: 8, color: C.muted, letterSpacing: 0.2 },
});

// ---- duration (ported from src/components/CV.jsx) -----------------------
const MONTHS = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
const parseMonth = (str) => { const m = String(str).trim().match(/^([A-Z][a-z]{2})\w*\s+(\d{4})$/); return m ? { y:+m[2], m:MONTHS[m[1]] } : null; };
function duration(dates) {
  const [from, to] = String(dates).split('–').map((x) => x.trim());
  const start = parseMonth(from); const now = new Date();
  const end = /present/i.test(to || '') ? { y: now.getFullYear(), m: now.getMonth()+1 } : parseMonth(to);
  if (!start || !end) return null;
  const months = (end.y-start.y)*12 + (end.m-start.m) + 1;
  if (months <= 0) return null;
  const y = Math.floor(months/12), mo = months%12;
  return [y?`${y} yr`:null, mo?`${mo} mo`:null].filter(Boolean).join(' ');
}

// ---- small-caps emulation ----------------------------------------------
// react-pdf has NO font-variant: small-caps. Emulate: uppercase everything,
// render leading letters at full size and the rest at ~78% size. This is the
// classic "faked small caps" — real small-caps glyphs would be heavier.
function SmallCaps({ children, style }) {
  const words = String(children).split(/(\s+)/);
  return h(Text, { style }, words.map((w, i) => {
    if (/^\s+$/.test(w) || !w) return w;
    const first = w[0].toUpperCase();
    const rest = w.slice(1).toUpperCase();
    return h(Text, { key: i }, h(Text, null, first), h(Text, { style: { fontSize: (style?.fontSize || 8) * 0.78 } }, rest));
  }));
}

// ---- chips inside wrapping bullet text ----------------------------------
// `tech` spans become inline nested <Text> with a light bg. Tests whether
// react-pdf renders inline backgrounds mid-paragraph with correct wrapping.
function Rich({ text }) {
  const parts = String(text).split('`');
  return parts.map((p, i) => (i % 2
    ? h(Text, { key: i, style: s.chip }, ` ${p} `)   // pad via spaces; no inline padding/radius on inline Text
    : p));
}

// ---- components ---------------------------------------------------------
function Name() {
  const [first, last] = person.name.toUpperCase().split(' ');
  return h(Text, { style: s.h1 },
    h(Text, { style: s.nb }, '{'), '  ',
    h(Text, { style: s.nf }, first),
    ' ', h(Text, { style: s.nc }, ':'), ' ',
    h(Text, { style: s.nl }, last), '  ',
    h(Text, { style: s.nb }, '}'));
}

function Heading({ children }) {
  const t = String(children).toUpperCase();
  return h(View, { style: s.h2wrap },
    h(Text, { style: s.h2 },
      h(Text, { style: s.hb }, '{ '),
      h(Text, { style: s.hc }, t[0]), t.slice(1),
      h(Text, { style: s.hb }, ' }')));
}

function Dates({ dates }) {
  const d = duration(dates);
  return h(Text, { style: s.dates }, dates, d ? h(Text, { style: s.dur }, ` · ${d}`) : null);
}

function Bullet({ text }) {
  return h(View, { style: s.li },
    h(Text, { style: s.bullet }, '•'),
    h(Text, { style: s.liText }, h(Rich, { text })));
}

const SECTIONS = [
  { job: 'rylo', bullets: ['rewrite','onboarding','platform','release','agentSkills'] },
  { job: 'remitlyStaff', bullets: ['lead','l10n','semanticKeys','apollo'] },
  { job: 'remitlySenior', bullets: ['reactNative','xstate','ci'] },
  { job: 'wix', bullets: ['forms','auth'] },
];

function groupSections(sections) {
  const groups = [];
  for (const sec of sections) {
    const co = jobs[sec.job].company;
    const last = groups[groups.length-1];
    if (last && jobs[last[0].job].company === co) last.push(sec);
    else groups.push([sec]);
  }
  return groups;
}

function Group({ group }) {
  const first = jobs[group[0].job];
  const multi = group.length > 1;
  const totalSpan = multi
    ? `${String(jobs[group[group.length-1].job].dates).split('–')[0].trim()} – ${String(first.dates).split('–')[1].trim()}`
    : null;
  const total = totalSpan ? duration(totalSpan) : null;
  return h(View, { style: s.entry, wrap: false },
    h(View, { style: s.entryHead },
      h(Text, null, h(Text, { style: s.company }, first.company),
        first.blurb ? h(Text, { style: s.blurb }, `  ${first.blurb}`) : null),
      h(Text, { style: s.loc }, first.location, total ? h(Text, { style: s.dur }, ` · ${total}`) : null)),
    group.map((sec) => {
      const job = jobs[sec.job];
      return h(View, { key: sec.job },
        h(View, { style: s.roleRow },
          h(SmallCaps, { style: s.role }, job.role),
          h(Dates, { dates: job.dates })),
        h(View, { style: s.ul },
          sec.bullets.map((id) => h(Bullet, { key: id, text: job.bullets[id] }))));
    }));
}

function Doc() {
  const groups = groupSections(SECTIONS);
  const contacts = [person.location, person.phone, person.email, person.github, person.linkedin, 'English · Hebrew · Russian'].filter(Boolean);
  return h(Document, null,
    h(Page, { size: 'A4', style: s.page },
      // header
      h(View, { style: s.header },
        h(Name),
        h(Text, { style: s.title }, person.title),
        h(Text, { style: s.contacts }, contacts.flatMap((c, i) => i ? [h(Text, { key: `s${i}`, style: s.sep }, '  ·  '), c] : [c]))),
      h(Text, { style: s.intro }, 'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.'),
      // experience
      h(Heading, null, 'Experience'),
      groups.map((g) => h(Group, { key: g[0].job, group: g })),
      // education
      h(Heading, null, 'Education'),
      h(View, { style: s.eduRow },
        h(Text, { style: s.degree }, education.degree),
        h(Text, { style: s.school }, education.school),
        h(Text, { style: s.eduDates }, education.dates)),
      h(SmallCaps, { style: s.pubSub }, 'Publications'),
      publications.map((p) => h(View, { key: p.title },
        h(View, { style: s.pubHead },
          h(Text, { style: s.pubTitle }, p.title),
          h(View, { style: s.pubMeta },
            h(Text, { style: s.pubJournal }, p.journal),
            h(Text, { style: s.pubYear }, String(p.year)))),
        h(SmallCaps, { style: s.pubAuthors }, p.authors)))));
}

await ReactPDF.render(h(Doc), OUT);
console.log('wrote', OUT);
