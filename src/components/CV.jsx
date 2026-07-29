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
  return (
    <h2>
      <span className="hb">{'{ '}</span>
      <span className="hw">
        <span className="hc">{t[0]}</span>
        {t.slice(1)}
      </span>
      <span className="hb">{' }'}</span>
    </h2>
  );
}

function Header({ variant }) {
  const contacts = [
    person.location,
    person.phone,
    person.email,
    person.github,
    person.linkedin,
    person.site,
  ].filter(Boolean);
  return (
    <header>
      <h1>
        <Name variant={variant} />
      </h1>
      <div className="title">{person.title}</div>
      <div className="contacts">
        {contacts.map((c, i) => (
          <React.Fragment key={c}>
            {i > 0 && <span className="sep">·</span>}
            <span>{c}</span>
          </React.Fragment>
        ))}
      </div>
    </header>
  );
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

// A single-company block. One company header (company + blurb + location +
// dates), then one role line per section. When a company holds two consecutive
// roles (the Remitly promotion) they read as two role lines inside one block:
// the company header, its location and the combined span appear ONCE, and each
// role carries its own dates — the promotion is legible at a glance.
function Group({ group }) {
  const first = jobs[group[0].job];
  const multi = group.length > 1;
  // Combined span for a merged block: last role's start … first role's end
  // (sections run newest-first). Dates fields are "Start – End" en-dash pairs.
  const end = (String(first.dates).split('–')[1] || '').trim();
  const start = (String(jobs[group[group.length - 1].job].dates).split('–')[0] || '').trim();
  const spanDates = multi ? `${start} – ${end}` : first.dates;
  return (
    <article className={multi ? 'entry group' : 'entry'}>
      <div className="entry-head">
        <div className="entry-co">
          <span className="company">{first.company}</span>
          {first.blurb && <span className="blurb">{first.blurb}</span>}
          {multi && first.location && <span className="loc">{first.location}</span>}
        </div>
        <div className="dates">{spanDates}</div>
      </div>
      {multi ? (
        group.map((s) => {
          const job = jobs[s.job];
          return (
            <div className="role-block" key={s.job}>
              <div className="entry-sub role-row">
                <span className="role">{job.role}</span>
                <span className="dates">{job.dates}</span>
              </div>
              <Bullets section={s} job={job} />
            </div>
          );
        })
      ) : (
        <>
          <div className="entry-sub">
            <span className="role">{first.role}</span>
            <span className="loc">{first.location}</span>
          </div>
          <Bullets section={group[0]} job={first} />
        </>
      )}
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

// { EDUCATION } — the degree row, then the publication folded in beneath it:
// title semibold, journal accent-italic + year right-aligned, authors on a
// small muted line below. One heading where there used to be two.
function Education({ variant }) {
  return (
    <section className="edu">
      <Heading variant={variant}>{variant.headings.education}</Heading>
      <div className="edu-row">
        <span className="degree">{education.degree}</span>
        <span className="school">{education.school}</span>
        <span className="dates">{education.dates}</span>
      </div>
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

export function CVPage({ variant, css }) {
  const intro = <p className="intro">{variant.intro}</p>;
  const identity = variant.nameStyle === 'plain' ? '' : ' id-braces';
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{`${person.name} — CV`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body className={variant.theme + identity}>
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
        </div>
      </body>
    </html>
  );
}
