import React from 'react';
import { education, jobs, person, publications, skills } from '../lib/content.mjs';

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
      <div className="title">{person.title}</div>
      {lines.map((line, li) => (
        <div className="contacts" key={li}>
          {line.map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <span className="sep">·</span>}
              <span>{c}</span>
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
// on the company line (Tufte: the duration is redundant ink at role level —
// within a company the ranges share endpoints — but earns its place for
// "Present" arithmetic and cross-role totals).
function Dates({ dates, className }) {
  return <span className={className}>{dates}</span>;
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
          {total && <span className="dur"> · {total}</span>}
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

function contactList(variant) {
  return [
    person.location,
    person.phone,
    person.email,
    person.github,
    person.linkedin,
    person.site,
    variant.contactExtra,
  ].filter(Boolean);
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
                  <div className="g-co">{tidyLabel(first.company)}</div>
                  {first.blurb && <div className="g-mblurb">{first.blurb}</div>}
                  <div className="g-loc">{first.location}</div>
                  <div className="g-dur">{groupDuration(group)}</div>
                </>
              )}
              <Dates className="g-dates" dates={job.dates} />
            </div>
            <div className="g-content">
              <div className="g-role">{job.role}</div>
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
      <header className="g-header">
        <div className="g-idcol">
          <div className="g-label">Curriculum Vitae</div>
        </div>
        <div className="g-idmain">
          <h1>
            <span className="g-nb">{'{'}</span>
            <span className="g-nf">{first}</span>
            <span className="g-nc">:</span>
            <span className="g-nl">{last}</span>
            <span className="g-nb">{'}'}</span>
          </h1>
          <div className="g-title">{person.title}</div>
        </div>
      </header>

      <div className="g-row g-introrow">
        <div className="g-meta">
          <div className="g-contacts">
            {contacts.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </div>
        <div className="g-content">
          <p className="intro">
            <NoBreakCompounds text={variant.intro} />
          </p>
        </div>
      </div>

      <section className="g-section">
        <GridSecMark>{variant.headings.experience}</GridSecMark>
        {groups.map((g) => (
          <GridEntry key={g[0].job} group={g} />
        ))}
      </section>

      <section className="g-section">
        <GridSecMark>{variant.headings.education}</GridSecMark>
        <div className="g-row">
          <div className="g-meta">
            <div className="g-co">{tidyLabel(education.school)}</div>
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
      </section>
    </div>
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
        <span className="ed-loc">
          {first.location}
          <span className="dur"> · {groupDuration(group)}</span>
        </span>
      </div>
      {group.map((s) => {
        const job = jobs[s.job];
        return (
          <div className="ed-role-block" key={s.job}>
            <div className="ed-role-row">
              <span className="ed-role">{job.role}</span>
              <Dates className="ed-dates" dates={job.dates} />
            </div>
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
  const [first, last] = person.name.toUpperCase().split(' ');
  const contacts = contactList(variant);
  return (
    <div className="page ed-page">
      <header className="ed-hero">
        <h1 className="ed-name">
          <span className="nb">{'{'}</span>
          <span className="nf">{first}</span>
          <span className="nc">:</span>
          <span className="nl">{last}</span>
          <span className="nb">{'}'}</span>
        </h1>
        <div className="ed-title">{person.title}</div>
        <p className="ed-intro">
          <NoBreakCompounds text={variant.intro} />
        </p>
        {/* Two intentionally balanced lines — never an accidental dangle. */}
        <div className="ed-contacts">
          {[contacts.slice(0, 3), contacts.slice(3)].map((line, li) => (
            <div key={li}>
              {line.map((c, i) => (
                <React.Fragment key={c}>
                  {i > 0 && <span className="ed-sep">·</span>}
                  <span>{c}</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </header>

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
      <body className={variant.theme + identity}>{body}</body>
    </html>
  );

  if (variant.layout === 'grid') return shell(<GridPage variant={variant} />);
  if (variant.layout === 'editorial') return shell(<EditorialPage variant={variant} />);

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
