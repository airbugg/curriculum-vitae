import React from 'react';
import { education, jobs, person, publications, skills } from '../lib/content.mjs';
import { logos } from '../lib/logos.mjs';

// Company logos in the grid layouts. A `mark` renders before the name; a
// `wordmark` renders IN PLACE of the name (Wix/Rewire have no separate
// mark, and a wordmark next to the printed name would duplicate it).
// Missing files degrade to the plain text name.
function LogoAsset({ asset, className }) {
  const cls = `${className} g-lg-${asset.slug}`;
  if (asset.type === 'svg')
    return <span className={cls} dangerouslySetInnerHTML={{ __html: asset.data }} />;
  return (
    <span className={cls}>
      <img src={asset.data} alt="" />
    </span>
  );
}

function CompanyName({ id, text }) {
  const l = logos[id];
  if (l?.wordmark)
    return (
      <>
        <LogoAsset asset={l.wordmark} className="g-wordmark" />
        {/* The name stays in the PDF text layer (transparent, zero-width)
            so search and parsers still find the employer. */}
        <span className="g-alt">{text ?? id}</span>
      </>
    );
  return (
    <>
      {l?.mark && <LogoAsset asset={l.mark} className="g-logo" />}
      {tidyLabel(text ?? id)}
    </>
  );
}

// `tech` spans in content become <code> chips — the original CV's \mylib.
export function Rich({ text }) {
  const parts = String(text).split('`');
  return parts.map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

// { EUGENE : LERMAN } — the original header, a key:value pair with braces.
// Word gaps come from CSS margins on .nb/.nc (see base.css), tuned to the
// original PDF's tighter density — no literal monospace spaces here.
function Name({ variant }) {
  if (variant.nameStyle === 'plain') return person.name;
  const [first, last] = person.name.toUpperCase().split(' ');
  return (
    <>
      <span className="nb">{'{'}</span>
      <span className="nf">{first}</span>
      <span className="nc">:</span>
      <span className="nl">{last}</span>
      <span className="nb">{'}'}</span>
    </>
  );
}

// { E}XPERIENCE-style headings: brace-wrapped, accent capital. The heading
// word itself is wrapped in .hw so themes can anchor decorations (e.g. the
// generalist's short accent bar) to the first LETTER, not the brace.
function Heading({ variant, children }) {
  if (variant.nameStyle === 'plain') return <h2>{children}</h2>;
  const t = String(children).toUpperCase();
  // Braces carry NO literal spaces: the word gaps are CSS margins (base.css
  // h2 .hb), because the brace spans are inline-block (transformable for the
  // sub-pixel vertical nudge) and inline-block would drop edge whitespace.
  return (
    <h2>
      <span className="hb">{'{'}</span>
      <span className="hw">
        <span className="hc">{t[0]}</span>
        {t.slice(1)}
      </span>
      <span className="hb">{'}'}</span>
    </h2>
  );
}

function Header({ variant }) {
  const contacts = contactList(variant);
  // contactSplit: intentionally break the contact run into two balanced lines
  // (index = first item of line two) instead of letting it crowd the margin.
  const lines =
    variant.contactSplit != null
      ? [contacts.slice(0, variant.contactSplit), contacts.slice(variant.contactSplit)]
      : [contacts];
  return (
    <header>
      <h1>
        <Name variant={variant} />
      </h1>
      <div className="title">{variant.title ?? person.title}</div>
      {lines.map((line, li) => (
        <div className="contacts" key={li}>
          {line.map((c, i) => (
            <React.Fragment key={c.text}>
              {i > 0 && <span className="sep">·</span>}
              <Contact item={c} />
            </React.Fragment>
          ))}
        </div>
      ))}
    </header>
  );
}

// "Dec 2022 – Feb 2026" → "3 yr 3 mo", computed at build time so tenure is
// readable at a glance without mental date arithmetic. Inclusive month count
// (the LinkedIn convention); "Present" resolves to the build date.
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
function parseMonth(s) {
  const m = String(s).trim().match(/^([A-Z][a-z]{2})\w*\s+(\d{4})$/);
  if (!m) return null;
  return { y: Number(m[2]), m: MONTHS[m[1]] };
}
export function duration(dates) {
  const [from, to] = String(dates).split('–').map((s) => s.trim());
  const start = parseMonth(from);
  const now = new Date();
  const end = /present/i.test(to || '') ? { y: now.getFullYear(), m: now.getMonth() + 1 } : parseMonth(to);
  if (!start || !end) return null;
  const months = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  if (months <= 0) return null;
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return [y ? `${y} yr` : null, mo ? `${mo} mo` : null].filter(Boolean).join(' ');
}

// Role lines carry the bare range; the derived tenure lives ONCE per company
// (Tufte: the duration is redundant ink repeated per role — but earns its
// place for "Present" arithmetic). Where it sits is a per-layout decision:
// `withDur` renders it inline after the range ("Dec 2022 – Feb 2026 · 3 yr
// 3 mo"), for layouts whose role line is the company line.
function Dates({ dates, className, withDur }) {
  const d = withDur ? duration(dates) : null;
  return (
    <span className={className}>
      {dates}
      {d && <span className="dur"> ({d})</span>}
    </span>
  );
}

// The company-level tenure: total span for multi-role groups, the single
// role's span otherwise.
function groupDuration(group) {
  const first = jobs[group[0].job];
  const span =
    group.length > 1
      ? `${String(jobs[group[group.length - 1].job].dates).split('–')[0].trim()} – ${String(first.dates).split('–')[1].trim()}`
      : first.dates;
  return duration(span);
}

function Bullets({ section, job }) {
  return (
    <ul>
      {section.bullets.map((id) => (
        <li key={id}>
          <Rich text={section.overrides?.[id] ?? job.bullets[id]} />
        </li>
      ))}
    </ul>
  );
}

// A single-company block with one consistent alignment scheme everywhere:
// the company line carries the LOCATION on the right; every role line carries
// its own DATES on the right. A company holding two consecutive roles (the
// Remitly promotion) simply stacks two role lines — no combined span, so
// nothing on adjacent lines reads as accidentally related.
function Group({ group }) {
  const first = jobs[group[0].job];
  const multi = group.length > 1;
  // One uniform rule: every company line answers "how long at this place".
  const total = groupDuration(group);
  return (
    <article className={multi ? 'entry group' : 'entry'}>
      <div className="entry-head">
        <div className="entry-co">
          <span className="company">{first.company}</span>
          {first.blurb && <span className="blurb">{first.blurb}</span>}
        </div>
        <div className="loc">
          {first.location}
          {total && <span className="dur"> ({total})</span>}
        </div>
      </div>
      {group.map((s) => {
        const job = jobs[s.job];
        return (
          <div className="role-block" key={s.job}>
            <div className="entry-sub role-row">
              <span className="role">{job.role}</span>
              <Dates className="dates" dates={job.dates} />
            </div>
            {job.summary && (
              <div className="summary">
                <NoBreakCompounds text={job.summary} />
              </div>
            )}
            <Bullets section={s} job={job} />
          </div>
        );
      })}
    </article>
  );
}

// Consecutive sections sharing a company merge into one Group.
function groupSections(sections) {
  const groups = [];
  for (const s of sections) {
    const co = jobs[s.job].company;
    const last = groups[groups.length - 1];
    if (last && jobs[last[0].job].company === co) last.push(s);
    else groups.push([s]);
  }
  return groups;
}

function Experience({ variant }) {
  const groups = groupSections(variant.sections);
  return (
    <section className="xp">
      <Heading variant={variant}>{variant.headings.experience}</Heading>
      {groups.map((g) => (
        <Group key={g[0].job} group={g} />
      ))}
    </section>
  );
}

// Skill values: a whole literal [ ... ] group renders as ONE continuous mono
// run (span.bg) with muted brackets — no per-chip backgrounds here. Backticks
// inside a group are dropped (the group is already mono); text outside groups
// falls back to normal Rich rendering.
function SkillValue({ text }) {
  const str = String(text);
  const out = [];
  const re = /\[[^\]]*\]/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) {
      out.push(<Rich key={out.length} text={str.slice(last, m.index)} />);
    }
    // Trim the source's full spaces; the thin [\, …\,] inset is a CSS margin.
    const inner = m[0].slice(1, -1).replaceAll('`', '').trim();
    out.push(
      <span className="bg" key={out.length}>
        <span className="bk">[</span>
        {inner}
        <span className="bk">]</span>
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push(<Rich key={out.length} text={str.slice(last)} />);
  return out;
}

function Skills({ variant }) {
  if (!variant.skills) return null;
  return (
    <section className="skills">
      <Heading variant={variant}>{variant.headings.skills}</Heading>
      {variant.skills.map(([cat, key]) => (
        <div className="skill" key={cat}>
          <span className="cat">{cat}</span>
          <span className="val">
            <SkillValue text={variant.skillsRaw ? key : skills[key] ?? key} />
          </span>
        </div>
      ))}
    </section>
  );
}

// { EDUCATION } — the degree row, then the publication beneath it under its
// own small subheading (one top-level heading, but the publication is clearly
// labeled instead of floating unexplained below the degree).
function Education({ variant }) {
  return (
    <section className="edu">
      <Heading variant={variant}>{variant.headings.education}</Heading>
      <div className="edu-row">
        <span className="degree">{education.degree}</span>
        <span className="school">{education.school}</span>
        <span className="dates">{education.dates}</span>
      </div>
      <div className="pub-sub">Publications</div>
      {publications.map((p) => (
        <article className="pub" key={p.title}>
          <div className="pub-head">
            <span className="pub-title">{p.title}</span>
            <span className="pub-meta">
              <span className="pub-journal">{p.journal}</span>
              <span className="pub-year">{p.year}</span>
            </span>
          </div>
          <div className="pub-authors">{p.authors}</div>
        </article>
      ))}
    </section>
  );
}

function HowIWork({ variant }) {
  if (!variant.howIWork) return null;
  return (
    <section className="how">
      <Heading variant={variant}>{variant.howIWork.heading}</Heading>
      <p>
        <Rich text={variant.howIWork.text} />
      </p>
    </section>
  );
}

// =========================================================================
// PROTOTYPE LAYOUTS — three opposed design philosophies (see DESIGN.md).
// These reuse the same content primitives (jobs/education/publications) but
// build radically different DOM so the CSS themes can express each philosophy.
// =========================================================================

// Contacts carry live hrefs into the PDF (Chromium preserves link
// annotations in print output): tel: for the phone, mailto: for the email,
// https:// for the profile URLs. Location and the extra run stay plain text.
function contactList(variant) {
  return [
    { text: person.location },
    { text: person.phone, href: person.phone && 'tel:' + String(person.phone).replace(/[^+\d]/g, '') },
    { text: person.email, href: person.email && `mailto:${person.email}` },
    { text: person.github, href: person.github && `https://${person.github}` },
    { text: person.linkedin, href: person.linkedin && `https://${person.linkedin}` },
    { text: person.site, href: person.site && `https://${person.site}` },
    { text: variant.contactExtra },
  ].filter((c) => c.text);
}

function Contact({ item }) {
  return item.href ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>;
}

// Rag control for narrow-column labels: parenthetical groups become
// unbreakable (break lands cleanly BEFORE the parenthesis), and otherwise the
// last space goes non-breaking so no single-word orphan wraps alone.
function tidyLabel(text) {
  const s = String(text);
  const paren = s.replace(/\(([^)]*)\)/g, (m) => m.replace(/ /g, '\u00A0'));
  if (paren !== s) return paren;
  return s.replace(/ (?=\S+$)/, '\u00A0');
}

// Hyphenated compounds ("early-stage") must never break at the hyphen.
function NoBreakCompounds({ text }) {
  const parts = String(text).split(/(\S+-\S+)/);
  return parts.map((p, i) =>
    i % 2 ? (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        {p}
      </span>
    ) : (
      p
    ),
  );
}

// ---- B: MODERNIST GRID -------------------------------------------------
// A hard left meta-column (company / location / dates as a data column)
// against a right content column. Company shows once per employer; each role
// keeps its own dates in the meta column, aligned to its bullets.
//
// The braces identity joins the grid as quiet structure, not decoration:
// mono braces in the muted data-column ink around the name and the section
// labels, with the single functional accent staying exactly where it was.
function GridSecMark({ children }) {
  return (
    <div className="g-secmark">
      <span className="g-sb">{'{'}</span>
      <span className="g-sw">{String(children).toUpperCase()}</span>
      <span className="g-sb">{'}'}</span>
    </div>
  );
}
// Grid meta column runs the compact date form — "Dec 2022" → "Dec 22" — so
// the range and the derived tenure ("3 yr 3 mo" → "3y 3m") share one line
// inside the 40mm column instead of stacking.
const shortRange = (d) => String(d).replace(/\b20(\d\d)\b/g, '$1');
const compactDur = (d) => d && d.replace(/(\d+) yr/, '$1y').replace(/(\d+) mo/, '$1m');
function GridEntry({ group }) {
  const first = jobs[group[0].job];
  return (
    <>
      {group.map((s, i) => {
        const job = jobs[s.job];
        return (
          // Continuation rows (a promotion within the same employer) are
          // pulled tighter to their parent row so the lone dates block reads
          // bound to the company above, not adrift in whitespace.
          <div className={i === 0 ? 'g-row' : 'g-row g-cont'} key={s.job}>
            <div className="g-meta">
              {i === 0 && (
                <>
                  <div className="g-co">
                    <CompanyName id={first.company} />
                  </div>
                  {first.blurb && <div className="g-mblurb">{tidyLabel(first.blurb)}</div>}
                  <div className="g-loc">{first.location}</div>
                </>
              )}
              <span className="g-dates">
                {shortRange(job.dates)}
                {i === 0 && groupDuration(group) && (
                  <span className="g-dur"> ({compactDur(groupDuration(group))})</span>
                )}
              </span>
            </div>
            <div className="g-content">
              <div className="g-role">{job.role}</div>
              {job.summary && (
                <div className="g-summary">
                  <NoBreakCompounds text={job.summary} />
                </div>
              )}
              <ul>
                {s.bullets.map((id) => (
                  <li key={id}>
                    <Rich text={s.overrides?.[id] ?? job.bullets[id]} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </>
  );
}

function GridPage({ variant }) {
  const groups = groupSections(variant.sections);
  const contacts = contactList(variant);
  const [first, last] = person.name.toUpperCase().split(' ');
  return (
    <div className="page grid-page">
      {/* Centered identity above the grid: name, title, and the contact run
          organized C's way — one centered line under the title instead of a
          stacked data-column block. The braces stay quiet structural glyphs
          in the muted data ink; the title line carries the emerald. */}
      <header className="g-header">
        <h1>
          <span className="g-nb">{'{'}</span>
          <span className="g-nf">{first}</span>
          <span className="g-nc">:</span>
          <span className="g-nl">{last}</span>
          <span className="g-nb">{'}'}</span>
        </h1>
        <div className="g-title">{variant.title ?? person.title}</div>
        <div className="g-contactline">
          {contacts.map((c, i) => (
            <React.Fragment key={c.text}>
              {i > 0 && <span className="sep">·</span>}
              <Contact item={c} />
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* With the contacts gone from the data column, the intro no longer
          needs the grid row — it runs as a single full-measure lead. */}
      <p className="intro g-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      {/* How-I-work, grid-native: the prose is content, and the harness
          roster is exactly data-column material — a stacked mono list where
          company/dates data lives everywhere else on the page. */}
      {variant.howIWork && (
        <section className="g-section">
          <GridSecMark>{variant.howIWork.heading}</GridSecMark>
          <div className="g-row">
            <div className="g-meta">
              {variant.howIWork.metaLabel && (
                <div className="g-mblurb">{variant.howIWork.metaLabel}</div>
              )}
              <div className="g-harness">
                {(variant.howIWork.metaItems ?? []).map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </div>
            </div>
            <div className="g-content">
              <p className="g-how">
                <Rich text={variant.howIWork.text} />
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="g-section">
        <GridSecMark>{variant.headings.experience}</GridSecMark>
        {groups.map((g) => (
          <GridEntry key={g[0].job} group={g} />
        ))}
      </section>

      {/* { BACKGROUND } — canonical: the prettier-formatted code block
          (BgCode, extracted verbatim below). The bgStyle discriminator
          selects one of three experimental reinterpretations; undefined
          keeps the canonical output byte-identical. */}
      {variant.bgStyle === 'a' ? (
        <BgStyleA variant={variant} />
      ) : variant.bgStyle === 'b' ? (
        <BgStyleB variant={variant} />
      ) : variant.bgStyle === 'c' ? (
        <BgStyleC variant={variant} />
      ) : (
        <BgCode variant={variant} />
      )}
    </div>
  );
}

// { BACKGROUND } — the section set as CODE, properly formatted:
// every object fully exploded prettier-style (one property per
// line, two-space indents, trailing commas), because a mid-list
// wrap is what no formatter emits. The vertical cost is paid
// horizontally, per owner suggestion: two side-by-side columns —
// education (with its nested publications array) on the left,
// languages + offHours stacked on the right — balanced at ~10
// lines each. The co-author credit rides the year line as a
// trailing comment. Syntax colors from the page palette only:
// emerald top-level keys, muted scaffolding, ink facts.
function BgCode({ variant }) {
  return (
      <section className="g-section g-bg">
        <GridSecMark>{variant.headings.background ?? 'Background'}</GridSecMark>
        <div className="g-code2">
          <div>
            <div>
              <span className="ck1">education</span>
              <Cp t={': {'} />
            </div>
            <div>
              {'  '}
              <Ck n="school" />
              <Cs>{education.schoolShort ?? education.school}</Cs>
              <Cp t={','} />
            </div>
            <div>
              {'  '}
              <Ck n="degree" />
              <Cs>{education.degreeShort ?? education.degree}</Cs>
              <Cp t={','} />
            </div>
            <div>
              {'  '}
              <Ck n="years" />
              <Cs>{String(education.dates).replace(/\s*–\s*/, '–')}</Cs>
              <Cp t={','} />
            </div>
            <div>
              {'  '}
              <Ck n="publications" />
              <Cp t={'[{'} />
            </div>
            <div>
              {'    '}
              <Ck n="title" />
              {/* The title is a live link to the article (DOI) — Chromium
                  carries the anchor into the PDF as a link annotation. */}
              {publications[0].url ? (
                <a href={publications[0].url}>
                  <Cs>{publications[0].title.split(':')[0]}</Cs>
                </a>
              ) : (
                <Cs>{publications[0].title.split(':')[0]}</Cs>
              )}
              <Cp t={','} />
            </div>
            <div>
              {'    '}
              <Ck n="journal" />
              <Cs>{publications[0].journal}</Cs>
              <Cp t={','} />
            </div>
            <div>
              {'    '}
              <Ck n="year" />
              <span className="cs">{publications[0].year}</span>
              <Cp t={','} />
            </div>
            <div>
              {'  '}
              <Cp t={'}],'} />
            </div>
            <div>
              <Cp t={'}'} />
            </div>
          </div>
          <div>
            {variant.languages && person.langLevels && (
              <>
                <div>
                  <span className="ck1">languages</span>
                  <Cp t={': {'} />
                </div>
                {person.langLevels.split(',').map((pair) => {
                  const [k, v] = pair.split('=').map((s) => s.trim());
                  return (
                    <div key={k}>
                      {'  '}
                      <Ck n={k} />
                      <Cs>{v}</Cs>
                      <Cp t={','} />
                    </div>
                  );
                })}
                <div>
                  <Cp t={'}'} />
                </div>
              </>
            )}
            {variant.offHours && (
              <>
                <div className="g-c2gap">
                  <span className="ck1">offHours</span>
                  <Cp t={': ['} />
                </div>
                {variant.offHours.map((s) => (
                  <div key={s}>
                    {'  '}
                    <Cs>{s}</Cs>
                    <Cp t={','} />
                  </div>
                ))}
                <div>
                  <Cp t={']'} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
  );
}

// The BACKGROUND object's building blocks: Cp = punctuation (muted
// scaffolding), Ck = a nested key with its colon, Cs = a quoted string
// whose quotes stay muted so the fact inside stays the anchor, Cc = a
// trailing // comment (the code idiom for asides; two literal spaces of
// air survive the block's white-space: pre-wrap).
const Cp = ({ t }) => <span className="cp">{t}</span>;
const Cc = ({ t }) => <span className="cc">{'  // ' + t}</span>;
const Ck = ({ n }) => (
  <>
    <span className="ck2">{n}</span>
    <span className="cp">: </span>
  </>
);
const Cs = ({ children }) => (
  <>
    <span className="cp">"</span>
    <span className="cs">{children}</span>
    <span className="cp">"</span>
  </>
);

// Education + publication on the same data/content grid module — shared by
// the pure grid (B) and the grid × editorial hybrid (D).
function GridEduRows() {
  return (
    <>
      <div className="g-row">
        <div className="g-meta">
          <div className="g-co">
            <CompanyName id="bgu" text={education.school} />
          </div>
          <div className="g-dates">{education.dates}</div>
        </div>
        <div className="g-content">
          <div className="g-role">{education.degree}</div>
        </div>
      </div>
      {/* Journal is data → meta column; title + authors are content. */}
      <div className="g-row">
        <div className="g-meta">
          <div className="g-co">Publications</div>
          <div className="g-mblurb">{publications[0].journal}</div>
          <div className="g-dates">{publications[0].year}</div>
        </div>
        <div className="g-content">
          <div className="g-pubtitle">{publications[0].title}</div>
          <div className="g-pubmeta">{publications[0].authors}</div>
        </div>
      </div>
    </>
  );
}

// ---- C: EDITORIAL / EXPRESSIVE ----------------------------------------
// Big quiet hero, small dense text, braces amplified into giant structural
// section markers. Keeps the emerald braces soul alive.
function EdBrace({ children }) {
  return (
    <div className="ed-secrow">
      <div className="ed-brace">{'{'}</div>
      <h2 className="ed-h2">{String(children).toUpperCase()}</h2>
      <div className="ed-brace ed-brace-close">{'}'}</div>
    </div>
  );
}

function EdEntry({ group }) {
  const first = jobs[group[0].job];
  return (
    <article className="ed-entry">
      <div className="ed-entry-head">
        <span className="ed-co">{first.company}</span>
        {first.blurb && <span className="ed-blurb">{first.blurb}</span>}
        <span className="ed-loc">{first.location}</span>
      </div>
      {group.map((s) => {
        const job = jobs[s.job];
        return (
          <div className="ed-role-block" key={s.job}>
            <div className="ed-role-row">
              <span className="ed-role">{job.role}</span>
              {/* Tenure rides inline after the range — one dates line per
                  role, nothing stacked or duplicated on the company line. */}
              <Dates className="ed-dates" dates={job.dates} withDur />
            </div>
            {job.summary && (
              <div className="ed-summary">
                <NoBreakCompounds text={job.summary} />
              </div>
            )}
            <ul>
              {s.bullets.map((id) => (
                <li key={id}>
                  <Rich text={s.overrides?.[id] ?? job.bullets[id]} />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </article>
  );
}

function EditorialPage({ variant }) {
  const groups = groupSections(variant.sections);
  return (
    <div className="page ed-page">
      {/* The flagship's centered header — { EUGENE : LERMAN } at 24pt with
          the measured base.css brace metrics — wearing C's emerald. The
          display intro below keeps the editorial scale contrast. */}
      <Header variant={variant} />
      <p className="ed-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      <section className="ed-section">
        <EdBrace>{variant.headings.experience}</EdBrace>
        <div className="ed-body">
          {groups.map((g) => (
            <EdEntry key={g[0].job} group={g} />
          ))}
        </div>
      </section>

      <section className="ed-section ed-footer">
        <EdBrace>{variant.headings.education}</EdBrace>
        <div className="ed-body">
          <div className="ed-edu">
            <span className="ed-degree">{education.degree}</span>
            <span className="ed-school">{education.school}</span>
            <span className="ed-dates">{education.dates}</span>
          </div>
          <div className="ed-pub">
            <span className="ed-pub-title">{publications[0].title}</span>
            <span className="ed-pub-meta">
              {publications[0].journal} · {publications[0].year}
            </span>
          </div>
          <div className="ed-pub-authors">{publications[0].authors}</div>
        </div>
      </section>
    </div>
  );
}

// ---- D: GRID × EDITORIAL -----------------------------------------------
// C's structure and voice — centered braces header, display intro, emerald,
// brace section markers with the trailing rule — carrying B's per-entry
// metadata treatment: a left data column stacking company / blurb / location
// / dates / tenure, against a right column of role, summary and bullets.
function HybridPage({ variant }) {
  const groups = groupSections(variant.sections);
  return (
    <div className="page ed-page hy-page">
      <Header variant={variant} />
      <p className="ed-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      <section className="ed-section">
        <EdBrace>{variant.headings.experience}</EdBrace>
        <div className="hy-body">
          {groups.map((g) => (
            <GridEntry key={g[0].job} group={g} />
          ))}
        </div>
      </section>

      <section className="ed-section ed-footer">
        <EdBrace>{variant.headings.education}</EdBrace>
        <div className="hy-body">
          <GridEduRows />
        </div>
      </section>
    </div>
  );
}

// =========================================================================
// REIMAGINED LAYOUTS — two independent design statements (2026 redesign
// commission). New DOM + new themes; existing components untouched.
// =========================================================================

// ---- R1: THE BROADSHEET — brutalist Swiss poster -------------------------
// A full-bleed ink block with the name letterspaced edge to edge, one hot
// accent, numbered sections, slash markers. Type as image; the braces
// identity is deliberately discarded here — the statement is the wall of
// type itself.
function SpreadWord({ word, className }) {
  return (
    <span className={`r1-line ${className ?? ''}`}>
      {[...String(word)].map((ch, i) => (
        <span key={i}>{ch}</span>
      ))}
    </span>
  );
}

function R1Head({ n, children }) {
  return (
    <div className="r1-h">
      <span className="r1-hn">{n}</span>
      <span className="r1-hw">{String(children).toUpperCase()}</span>
    </div>
  );
}

function PosterPage({ variant }) {
  const groups = groupSections(variant.sections);
  // Location already anchors the hero topline; the contact row carries the
  // reachable coordinates only, spread across the full measure.
  const contacts = contactList(variant).filter((c) => c.text !== person.location);
  const [first, last] = person.name.toUpperCase().split(' ');
  return (
    <div className="page r1-page">
      <header className="r1-hero">
        <div className="r1-topline">
          <span>Curriculum Vitae</span>
          <span>{person.location}</span>
        </div>
        <h1 className="r1-name">
          <SpreadWord word={first} className="r1-first" />
          <SpreadWord word={last} className="r1-last" />
          {/* The letterspaced glyphs extract letter-by-letter; keep the
              intact name in the text layer for search and parsers. */}
          <span className="r1-alt">{person.name}</span>
        </h1>
        <div className="r1-titlerow">
          <span className="r1-title">{variant.title ?? person.title}</span>
        </div>
        <div className="r1-contacts">
          {contacts.map((c) => (
            <Contact item={c} key={c.text} />
          ))}
        </div>
      </header>

      <div className="r1-body">
        <p className="r1-intro">
          <NoBreakCompounds text={variant.intro} />
        </p>

        <section className="r1-xp">
          <R1Head n="01">{variant.headings.experience}</R1Head>
          {groups.map((g) => {
            const firstJob = jobs[g[0].job];
            const total = groupDuration(g);
            return (
              <article className="r1-entry" key={g[0].job}>
                <div className="r1-erow">
                  <span className="r1-co">{firstJob.company}</span>
                  {firstJob.blurb && <span className="r1-blurb">{firstJob.blurb}</span>}
                  <span className="r1-dates">
                    {firstJob.location}
                    {total && <span className="r1-dur"> · {total}</span>}
                  </span>
                </div>
                {g.map((s) => {
                  const job = jobs[s.job];
                  return (
                    <div className="r1-roleblock" key={s.job}>
                      <div className="r1-rolerow">
                        <span className="r1-role">{job.role}</span>
                        <span className="r1-dates">{job.dates}</span>
                      </div>
                      {job.summary && (
                        <div className="r1-summary">
                          <NoBreakCompounds text={job.summary} />
                        </div>
                      )}
                      <ul>
                        {s.bullets.map((id) => (
                          <li key={id}>
                            <Rich text={s.overrides?.[id] ?? job.bullets[id]} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </article>
            );
          })}
        </section>

        <section className="r1-bg">
          <R1Head n="02">{variant.headings.background ?? 'Background'}</R1Head>
          <div className="r1-cols">
            <div className="r1-col">
              <div className="r1-collabel">Education</div>
              <div className="r1-colmain">{education.degree}</div>
              <div className="r1-colmeta">{education.school}</div>
              <div className="r1-colmeta">{education.dates}</div>
            </div>
            <div className="r1-col">
              <div className="r1-collabel">Publication</div>
              <div className="r1-colmain">{publications[0].title}</div>
              <div className="r1-colmeta">
                {publications[0].journal}, {publications[0].year}
              </div>
            </div>
            <div className="r1-col">
              <div className="r1-collabel">Languages</div>
              <div className="r1-colmain">{person.languages}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---- R2: THE LEDGER — editorial career cartography -----------------------
// The twelve years drawn to scale: a vertical time axis in the margin,
// employment as filled emerald spans, the degree as a hollow one, the
// content column descending into the past alongside it. Tufte marginalia
// discipline; the data IS the ornament.
const monthIndex = (m) => m.y * 12 + m.m;

function ledgerAxisModel(groups) {
  const now = new Date();
  const top = monthIndex({ y: now.getFullYear(), m: now.getMonth() + 1 }) + 1;
  const bottom = monthIndex({ y: 2013, m: 1 });
  const H = 233; // mm — matches .lg-axis height in the theme
  const s = H / (top - bottom);
  const pos = (m) => (top - monthIndex(m)) * s;
  const bars = groups.map((g) => {
    const firstJob = jobs[g[0].job];
    const lastJob = jobs[g[g.length - 1].job];
    const from = parseMonth(String(lastJob.dates).split('–')[0]);
    const toRaw = String(firstJob.dates).split('–')[1] ?? '';
    const ongoing = /present/i.test(toRaw);
    const to = ongoing ? { y: now.getFullYear(), m: now.getMonth() + 1 } : parseMonth(toRaw);
    // Boundary convention: the transition month belongs to the NEWER span
    // (LinkedIn counts it in both; drawn both ways the bars overlap), so a
    // finished span's top sits one month band below its end month. Ongoing
    // spans keep their end month — nothing sits above them.
    const barTop = ongoing ? pos(to) : pos(to) + s;
    return { label: firstJob.company, top: barTop, height: pos(from) + s - barTop };
  });
  // The degree bar spans tick to tick — exactly what "2013 – 2017" prints.
  const [ey1, ey2] = String(education.dates)
    .split('–')
    .map((t) => Number(t.trim()));
  const edu = { top: pos({ y: ey2, m: 1 }), height: pos({ y: ey1, m: 1 }) - pos({ y: ey2, m: 1 }) };
  const ticks = [];
  for (let y = 2013; y <= now.getFullYear(); y++)
    ticks.push({ label: `’${String(y).slice(2)}`, top: pos({ y, m: 1 }) });
  return { H, bars, edu, ticks };
}

function LedgerAxis({ groups, caption }) {
  const { H, bars, edu, ticks } = ledgerAxisModel(groups);
  const mm = (v) => `${v.toFixed(2)}mm`;
  return (
    <div className="lg-rail">
      <div className="lg-axis" style={{ height: mm(H) }}>
        <div className="lg-axisline" />
        {ticks.map((t) => (
          <div className="lg-tick" key={t.label} style={{ top: mm(t.top) }}>
            <span>{t.label}</span>
          </div>
        ))}
        {/* A hair of inset at each end so back-to-back tenures (Remitly ends
            the month Rylo begins) read as separate spans, not one bar. */}
        {bars.map((b) => (
          <div
            className="lg-bar"
            key={b.label}
            style={{ top: mm(b.top + 0.35), height: mm(b.height - 0.7) }}
          >
            <span className="lg-barlabel">{b.label}</span>
          </div>
        ))}
        <div
          className="lg-bar lg-ebar"
          style={{ top: mm(edu.top + 0.35), height: mm(edu.height - 0.7) }}
        >
          <span className="lg-barlabel">{education.degreeShort?.split(',')[0] ?? 'BSc'}</span>
        </div>
        <div className="lg-nowdot" />
      </div>
      {caption && (
        <div className="lg-caption">
          {String(caption)
            .split('\n')
            .map((line) => (
              <div key={line}>{line}</div>
            ))}
        </div>
      )}
    </div>
  );
}

function LedgerPage({ variant }) {
  const groups = groupSections(variant.sections);
  const contacts = contactList(variant);
  const [firstName, lastName] = person.name.split(' ');
  return (
    <div className="page lg-page">
      <header className="lg-head">
        <div className="lg-ident">
          <h1>
            <span className="lg-nf">{firstName}</span> <span className="lg-nl">{lastName}</span>
          </h1>
          <div className="lg-title">{variant.title ?? person.title}</div>
        </div>
        <div className="lg-contacts">
          {contacts.map((c) => (
            <div key={c.text}>
              <Contact item={c} />
            </div>
          ))}
        </div>
      </header>

      <div className="lg-main">
        <LedgerAxis groups={groups} caption={variant.axisCaption} />
        <div className="lg-content">
          <p className="lg-intro">
            <NoBreakCompounds text={variant.intro} />
          </p>

          <section className="lg-xp">
            <h2 className="lg-h2">{variant.headings.experience}</h2>
            {groups.map((g) => {
              const firstJob = jobs[g[0].job];
              const total = groupDuration(g);
              return (
                <article className="lg-entry" key={g[0].job}>
                  <div className="lg-erow">
                    <span className="lg-co">{firstJob.company}</span>
                    {firstJob.blurb && <span className="lg-blurb">{firstJob.blurb}</span>}
                    <span className="lg-dates">
                      {shortRange(firstJob.dates)}
                      {total && <span className="lg-dur"> · {compactDur(total)}</span>}
                    </span>
                  </div>
                  {g.map((s) => {
                    const job = jobs[s.job];
                    return (
                      <div className="lg-roleblock" key={s.job}>
                        <div className="lg-rolerow">
                          <span className="lg-role">{job.role}</span>
                          <span className="lg-loc">{job.location}</span>
                        </div>
                        {job.summary && (
                          <div className="lg-summary">
                            <NoBreakCompounds text={job.summary} />
                          </div>
                        )}
                        <ul>
                          {s.bullets.map((id) => (
                            <li key={id}>
                              <Rich text={s.overrides?.[id] ?? job.bullets[id]} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </article>
              );
            })}
          </section>

          <section className="lg-edu">
            <h2 className="lg-h2">{variant.headings.education}</h2>
            <div className="lg-erow">
              <span className="lg-co">{education.school}</span>
              <span className="lg-blurb">{education.degree}</span>
              <span className="lg-dates">{education.dates}</span>
            </div>
            <div className="lg-pub">
              <span className="lg-pubtitle">{publications[0].title}</span>
              <span className="lg-pubmeta">
                {publications[0].journal} · {publications[0].year}
              </span>
            </div>
            <div className="lg-pubauthors">{publications[0].authors}</div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ---- THE SHELL — the whole CV as one terminal session -------------------
// Grown out of the BACKGROUND Session study the owner picked: every
// section leans into the transcript. One window, one session; commands
// are the structure (no section markers), and the coloring is terminal
// truth throughout — zsh verb highlighting, glow-rendered markdown for
// the job files, jq-colored JSON for the background block.
function TCmd({ verb, args, href, tail, children }) {
  const argText = args ? ' ' + args : null;
  return (
    <div className="t-block">
      <div className="t-cmd">
        <span className="t-prompt">{'\u203a'}</span>{' '}
        <span className="t-verb">{verb}</span>
        {argText && (href ? <a href={href}>{argText}</a> : argText)}
        {tail}
      </div>
      {children}
    </div>
  );
}

// experience/<start-year>-<company>.md — the fiction mirrors the repo
// truth (the jobs really are markdown files with front matter).
function tJobSlug(section) {
  const job = jobs[section.job];
  const yr = String(job.dates).match(/\d{4}/)[0];
  return `${yr}-${job.company.split('.')[0].toLowerCase()}.md`;
}

function TermJob({ section }) {
  const job = jobs[section.job];
  const dur = compactDur(duration(job.dates));
  return (
    <TCmd verb="glow" args={`experience/${tJobSlug(section)}`}>
      {/* The role is the line's one anchor (bold, left); dates and
          location sit flush right on a shared axis down the page — the
          ls -l column discipline, and the second alignment axis the
          CV-typography research ranks just under anchor-plus-muted-tail.
          No summary lines here: prose mass between anchors is what read
          as dense, and the bullets carry the evidence. */}
      <div className="t-out t-jobhead">
        <span className="t-role">
          {job.role} @ {job.company.split('.')[0]}
        </span>
        <span className="t-jobmeta">
          {shortRange(job.dates)}
          {dur ? ` (${dur})` : ''}
          {'  '}
          {job.location.toLowerCase()}
        </span>
      </div>
      <ul className="t-bullets">
        {section.bullets.map((id) => (
          <li key={id}>
            <Rich text={section.overrides?.[id] ?? job.bullets[id]} />
          </li>
        ))}
      </ul>
    </TCmd>
  );
}

function TerminalPage({ variant }) {
  const contacts = contactList(variant);
  const doi = String(publications[0].url).replace(/^https?:\/\//, '');
  const slugify = (x) => String(x).replace(/ /g, '-');
  return (
    <div className="page t-page">
      <header className="t-header">
        <h1>
          <span className="t-hb">{'{'}</span> <span className="t-hf">eugene</span>{' '}
          <span className="t-hc">:</span> lerman <span className="t-hb">{'}'}</span>
        </h1>
        <div className="t-title">{(variant.title ?? person.title).toLowerCase()}</div>
        <div className="t-contact">
          {contacts.map((c, i) => (
            <React.Fragment key={c.text}>
              {i > 0 && '  '}
              <Contact item={c} />
            </React.Fragment>
          ))}
        </div>
      </header>
      <div className="t-window">
        <div className="t-titlebar">
          <span className="t-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="t-wtitle">eugene@tlv:~/cv</span>
        </div>
        <div className="t-session">
          <TCmd verb="cat" args="README.md">
            <div className="t-out">
              <NoBreakCompounds text={variant.intro} />
            </div>
          </TCmd>
          <TCmd verb="ls" args="-t experience/">
            <div className="t-out">{variant.sections.map(tJobSlug).join('  ')}</div>
          </TCmd>
          {variant.sections.map((s) => (
            <TermJob key={s.job} section={s} />
          ))}
          <div className="t-bgrid">
            <div>
              <TCmd verb="jq" args=". education.json">
                <div className="t-out bgx-jp">{'{'}</div>
                <BgJson k="degree" v={education.degreeShort ?? education.degree} />
                <BgJson k="school" v={education.schoolShort ?? education.school} />
                <BgJson k="years" v={bgEduYears()} last />
                <div className="t-out bgx-jp">{'}'}</div>
              </TCmd>
              <TCmd verb="open" args={doi} href={publications[0].url}>
                <div className="t-out">
                  <a href={publications[0].url}>{bgPubTitle()}</a>, {publications[0].journal}{' '}
                  {publications[0].year}
                </div>
              </TCmd>
            </div>
            <div>
              <TCmd
                verb="locale"
                tail={
                  <>
                    {' '}
                    <span className="bgx-jp">|</span> <span className="t-verb">jq</span>
                  </>
                }
              >
                <div className="t-out bgx-jp">{'{'}</div>
                {bgLangPairs().map(([k, v], i, arr) => (
                  <BgJson k={k} v={v} last={i === arr.length - 1} key={k} />
                ))}
                <div className="t-out bgx-jp">{'}'}</div>
              </TCmd>
              <TCmd verb="ls" args="off-hours/">
                <div className="t-out">
                  {(variant.offHours ?? []).map((x, i) => (
                    <React.Fragment key={x}>
                      {i > 0 && '  '}
                      {slugify(x)}
                    </React.Fragment>
                  ))}
                </div>
              </TCmd>
            </div>
          </div>
          <div className="t-cmd">
            <span className="t-prompt">{'\u203a'}</span> <span className="t-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CVPage({ variant, css }) {
  // Prototypes get compound-safe intros; originals keep their exact output.
  const intro = (
    <p className="intro">
      {variant.theme.startsWith('proto') ? (
        <NoBreakCompounds text={variant.intro} />
      ) : (
        variant.intro
      )}
    </p>
  );
  const identity = variant.nameStyle === 'plain' ? '' : ' id-braces';
  const shell = (body) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{`${person.name} — CV`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body className={variant.theme + identity + (variant.bodyClass ? ` ${variant.bodyClass}` : '')}>
        {body}
      </body>
    </html>
  );

  if (variant.layout === 'terminal') return shell(<TerminalPage variant={variant} />);
  if (variant.layout === 'grid') return shell(<GridPage variant={variant} />);
  if (variant.layout === 'editorial') return shell(<EditorialPage variant={variant} />);
  if (variant.layout === 'hybrid') return shell(<HybridPage variant={variant} />);
  if (variant.layout === 'poster') return shell(<PosterPage variant={variant} />);
  if (variant.layout === 'ledger') return shell(<LedgerPage variant={variant} />);

  // single / sidebar / reduction all share the flow shell; reduction is a
  // CSS-only restraint pass over the single flow.
  return shell(
    <div className="page">
      <Header variant={variant} />
      {variant.layout === 'sidebar' ? (
        <div className="cols">
          <aside>
            <Skills variant={variant} />
            <Education variant={variant} />
          </aside>
          <div className="main">
            {intro}
            <HowIWork variant={variant} />
            <Experience variant={variant} />
          </div>
        </div>
      ) : (
        <>
          {intro}
          <HowIWork variant={variant} />
          <Experience variant={variant} />
          <Education variant={variant} />
          <Skills variant={variant} />
        </>
      )}
    </div>,
  );
}

// =========================================================================
// { BACKGROUND } EXPERIMENTS — three reinterpretations of the canonical
// code block (bgStyle 'a' | 'b' | 'c' on the grid layout). Same facts,
// same atoms, three answers to "do we need the object keys?".
// =========================================================================

// Shared: langLevels ("english=native, hebrew=native, …") → [[name, level]].
function bgLangPairs() {
  return String(person.langLevels)
    .split(',')
    .map((pair) => pair.split('=').map((s) => s.trim()));
}
const bgEduYears = () => String(education.dates).replace(/\s*–\s*/, '–');
const bgPubTitle = () => publications[0].title.split(':')[0];

// ---- A: THE SESSION — a terminal transcript ------------------------------
// The code soul kept, the braces dropped: the object keys become the
// commands you would actually type (cat education, locale, ls
// off-hours/), and the facts arrive as clean unquoted output, exactly
// as a terminal would print them. Faithfulness rules: a starship-style
// prompt (the › glyph, the closest Source Code Pro carries to ❯), and
// zsh-syntax-highlighting colors: prompt emerald, the command VERB
// deep-emerald (a valid command lights up green), arguments and output
// in the default foreground ink. No typographic separators in output;
// terminals print plain text.
function BgTerm({ verb, args, children, href, cmdTail }) {
  const argText = args ? ' ' + args : '';
  return (
    <>
      <div className="bgx-cmd">
        <span className="bgx-prompt">{'›'}</span>{' '}
        <span className="bgx-verb">{verb}</span>
        {href ? <a href={href}>{argText}</a> : argText}
        {cmdTail}
      </div>
      {children}
    </>
  );
}

// One line of jq-colored JSON output: jq really does color what it
// prints, so the fiction pays for the registers — keys take the deep
// emerald (jq's blue), strings the ink (jq's green), structure the
// muted gray (jq's plain punctuation). Quotes belong to their token,
// the way a terminal colors whole tokens, not typography.
function BgJson({ k, v, last }) {
  return (
    <div className="bgx-out">
      {'  '}
      <span className="bgx-jk">"{k}"</span>
      <span className="bgx-jp">: </span>
      <span className="bgx-js">"{v}"</span>
      {!last && <span className="bgx-jp">,</span>}
    </div>
  );
}

function BgStyleA({ variant }) {
  const doi = String(publications[0].url).replace(/^https?:\/\//, '');
  const slug = (s) => String(s).replace(/ /g, '-');
  return (
    <section className="g-section g-bg bgx-a">
      <GridSecMark>{variant.headings.background ?? 'Background'}</GridSecMark>
      <div className="bgx-term">
        <div>
          <BgTerm verb="jq" args=". education.json">
            <div className="bgx-out bgx-jp">{'{'}</div>
            <BgJson k="degree" v={education.degreeShort ?? education.degree} />
            <BgJson k="school" v={education.schoolShort ?? education.school} />
            <BgJson k="years" v={bgEduYears()} last />
            <div className="bgx-out bgx-jp">{'}'}</div>
          </BgTerm>
          <BgTerm verb="open" args={doi} href={publications[0].url}>
            <div className="bgx-out">
              <a href={publications[0].url}>{bgPubTitle()}</a>, {publications[0].journal}{' '}
              {publications[0].year}
            </div>
          </BgTerm>
        </div>
        <div>
          <BgTerm
            verb="locale"
            cmdTail={
              <>
                {' '}
                <span className="bgx-jp">|</span> <span className="bgx-verb">jq</span>
              </>
            }
          >
            <div className="bgx-out bgx-jp">{'{'}</div>
            {bgLangPairs().map(([k, v], i, arr) => (
              <BgJson k={k} v={v} last={i === arr.length - 1} key={k} />
            ))}
            <div className="bgx-out bgx-jp">{'}'}</div>
          </BgTerm>
          <BgTerm verb="ls" args="off-hours/">
            <div className="bgx-out">
              {(variant.offHours ?? []).map((s, i) => (
                <React.Fragment key={s}>
                  {/* ls's two-space column gap; NBSPs so HTML keeps both. */}
                  {i > 0 && '\u00A0\u00A0'}
                  {slug(s)}
                </React.Fragment>
              ))}
            </div>
          </BgTerm>
        </div>
      </div>
    </section>
  );
}

// ---- B: THE COLOPHON — a keyless ledger ----------------------------------
// The owner's open question answered with a hard yes: no keys at all.
// The two dated facts run as ledger lines — fact, hairline dot leader,
// mono year on the right margin (the dates voice the grid already
// speaks). The two undated facts follow in a quieter register and are
// left to explain themselves; "other over-engineering" was always
// going to. Pure typography, no code, nothing to parse.
function BgLedgerRow({ children, year }) {
  return (
    <div className="bgx-lrow">
      <span className="bgx-fact">{children}</span>
      <span className="bgx-lead" />
      <span className="bgx-yr">{year}</span>
    </div>
  );
}

function BgStyleB({ variant }) {
  return (
    <section className="g-section g-bg bgx-b">
      <GridSecMark>{variant.headings.background ?? 'Background'}</GridSecMark>
      <div className="bgx-ledger">
        <BgLedgerRow year={education.dates}>
          <span className="bgx-strong">{education.degree}</span>
          <span className="bgx-dim"> · </span>
          {education.schoolShort ?? education.school}
        </BgLedgerRow>
        <BgLedgerRow year={publications[0].year}>
          <a href={publications[0].url} className="bgx-strong">
            {bgPubTitle()}
          </a>
          <span className="bgx-dim"> · </span>
          {publications[0].journal}
        </BgLedgerRow>
        <div className="bgx-quiet">
          {bgLangPairs().map(([k, v], i) => (
            <React.Fragment key={k}>
              {i > 0 && <span className="bgx-sep">·</span>}
              <span className="bgx-lang">{k[0].toUpperCase() + k.slice(1)}</span>{' '}
              <span className="bgx-level">{v.replace(/ /g, '\u00A0')}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="bgx-quiet">
          {(variant.offHours ?? []).map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="bgx-sep">·</span>}
              <span className="bgx-off">{s.replace(/ /g, '\u00A0')}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- C: THE MANIFEST — the keys join the grid ----------------------------
// The keys stay, but stop pretending to be syntax: they are set as the
// meta-column labels the rest of the page already uses (micro-caps in
// the data ink), with the year beneath them in the mono dates voice —
// so BACKGROUND finally speaks the exact dialect of EXPERIENCE. Facts
// run as content lines; off-hours items keep one whisper of the code
// soul as boxless deep-emerald mono chips.
function BgManifestRow({ label, year, children }) {
  return (
    <div className="bgx-crow">
      <div className="bgx-cmeta">
        <div className="bgx-key">{label}</div>
        {year && <div className="bgx-cyr">{year}</div>}
      </div>
      <div className="bgx-cval">{children}</div>
    </div>
  );
}

function BgStyleC({ variant }) {
  return (
    <section className="g-section g-bg bgx-c">
      <GridSecMark>{variant.headings.background ?? 'Background'}</GridSecMark>
      <BgManifestRow label="Education" year={bgEduYears()}>
        <span className="bgx-strong">{education.degree}</span>
        <span className="bgx-dim"> · </span>
        {education.school}
      </BgManifestRow>
      <BgManifestRow label="Publication" year={publications[0].year}>
        <a href={publications[0].url} className="bgx-strong">
          {bgPubTitle()}
        </a>
        <span className="bgx-dim"> · </span>
        {publications[0].journal}
      </BgManifestRow>
      <BgManifestRow label="Languages">
        {bgLangPairs().map(([k, v], i) => (
          <React.Fragment key={k}>
            {i > 0 && <span className="bgx-sep">·</span>}
            <span className="bgx-lang">{k[0].toUpperCase() + k.slice(1)}</span>{' '}
            <span className="bgx-level">{v.replace(/ /g, '\u00A0')}</span>
          </React.Fragment>
        ))}
      </BgManifestRow>
      <BgManifestRow label="Off hours">
        {(variant.offHours ?? []).map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <span className="bgx-sep">·</span>}
            <span className="bgx-off">{s.replace(/ /g, '\u00A0')}</span>
          </React.Fragment>
        ))}
      </BgManifestRow>
    </section>
  );
}
