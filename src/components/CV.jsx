import React from 'react';
import { education, jobs, person, skills } from '../lib/content.mjs';

// `tech` spans in content become <code> chips — the original CV's \mylib.
export function Rich({ text }) {
  const parts = String(text).split('`');
  return parts.map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

// { EUGENE : LERMAN } — the original header, a key:value pair with braces.
function Name({ variant }) {
  if (variant.nameStyle === 'plain') return person.name;
  const [first, last] = person.name.toUpperCase().split(' ');
  return (
    <>
      <span className="nb">{'{ '}</span>
      <span className="nf">{first}</span>
      <span className="nc"> : </span>
      <span className="nl">{last}</span>
      <span className="nb">{' }'}</span>
    </>
  );
}

// { E}XPERIENCE-style headings: brace-wrapped, accent capital.
function Heading({ variant, children }) {
  if (variant.nameStyle === 'plain') return <h2>{children}</h2>;
  const t = String(children).toUpperCase();
  return (
    <h2>
      <span className="hb">{'{ '}</span>
      <span className="hc">{t[0]}</span>
      {t.slice(1)}
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
  ];
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

function Entry({ section }) {
  const job = jobs[section.job];
  return (
    <article className="entry">
      <div className="entry-head">
        <div className="entry-co">
          <span className="company">{job.company}</span>
          {job.blurb && <span className="blurb">{job.blurb}</span>}
        </div>
        <div className="dates">{job.dates}</div>
      </div>
      <div className="entry-sub">
        <span className="role">{job.role}</span>
        <span className="loc">{job.location}</span>
      </div>
      <ul>
        {section.bullets.map((id) => (
          <li key={id}>
            <Rich text={section.overrides?.[id] ?? job.bullets[id]} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function Experience({ variant }) {
  return (
    <section className="xp">
      <Heading variant={variant}>{variant.headings.experience}</Heading>
      {variant.sections.map((s) => (
        <Entry key={s.job} section={s} />
      ))}
    </section>
  );
}

function Skills({ variant }) {
  return (
    <section className="skills">
      <Heading variant={variant}>{variant.headings.skills}</Heading>
      {variant.skills.map(([cat, key]) => (
        <div className="skill" key={cat}>
          <span className="cat">{cat}</span>
          <span className="val">
            <Rich text={variant.skillsRaw ? key : skills[key] ?? key} />
          </span>
        </div>
      ))}
    </section>
  );
}

function Education({ variant }) {
  return (
    <section className="edu">
      <Heading variant={variant}>{variant.headings.education}</Heading>
      <div className="edu-row">
        <span className="degree">{education.degree}</span>
        <span className="school">{education.school}</span>
        <span className="dates">{education.dates}</span>
      </div>
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
              <Skills variant={variant} />
              <Education variant={variant} />
            </>
          )}
        </div>
      </body>
    </html>
  );
}
