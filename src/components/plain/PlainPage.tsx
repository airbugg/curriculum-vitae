// The ATS cut: one linear column that extracts in reading order. Standard
// headings, per-role Technologies lines, no chips or icons — Israeli
// screens Ctrl+F this page (see DESIGN.md), so every keyword is plain
// text bound to the role that earned it. The beauty budget is typography
// only, in themes/plain.css.
import { Fragment, type ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background.ts';
import { education, person, publication, skills, splitChips } from '../../lib/content.ts';
import { compactDur, duration } from '../../lib/dates.ts';
import { resolve } from '../../lib/experience.ts';
import type { PlainVariant, Role } from '../../types.ts';
import { Contact, type ContactItem, contacts } from '../shared/Contact.tsx';
import { Rich } from '../shared/Rich.tsx';
import { NoBreakCompounds } from '../shared/typography.tsx';

/** Location and direct channels on one line, https profile links on the
 * next; a group that comes up empty (the public cut) drops its line. */
function splitContacts(items: ContactItem[]): ContactItem[][] {
  const profile = (c: ContactItem) => c.href?.startsWith('https://');
  return [items.filter((c) => !profile(c)), items.filter(profile)].filter((l) => l.length > 0);
}

function PlainJob({ role: { job, bullets } }: { role: Role }): ReactNode {
  const dur = compactDur(duration(job.dates));
  return (
    <div className="p-job">
      <div className="p-jobhead">
        {/* Role and company share one inline context: as separate flex
            items the space before the middot sat at the start of a line
            box and collapsed away ("Engineer· Rylo"). */}
        <span className="p-headline">
          <span className="p-role">{job.role}</span>
          <span className="p-co">
            {' '}
            · {job.company}, {job.location}
          </span>
        </span>
        <span className="p-dates">
          {job.dates}
          {dur && <span className="p-dur"> ({dur})</span>}
        </span>
      </div>
      {job.summary && (
        <p className="p-summary">
          <NoBreakCompounds text={job.summary} />
        </p>
      )}
      <ul className="p-bullets">
        {bullets.map(({ id, text }) => (
          <li key={id}>
            <Rich text={text} />
          </li>
        ))}
      </ul>
      {job.tech && (
        <p className="p-tech">
          <span className="p-techlabel">Technologies: </span>
          {job.tech}
        </p>
      )}
    </div>
  );
}

export function PlainPage({ variant }: { variant: PlainVariant }): ReactNode {
  return (
    <div className="plain-page">
      <header className="p-header">
        <h1>{person.name}</h1>
        <div className="p-title">{variant.title ?? person.title}</div>
        {/* The full run outgrows the measure, so the split is deliberate:
            direct channels on one line, profile links on the next — never
            a mid-item break or a dangling separator. */}
        {splitContacts(contacts(variant.publicContact)).map((line) => (
          <div className="p-contact" key={line[0]?.text}>
            {line.map((c, i) => (
              <Fragment key={c.text}>
                {i > 0 && <span className="p-sep"> · </span>}
                <Contact item={c} />
              </Fragment>
            ))}
          </div>
        ))}
      </header>

      <p className="p-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      <section>
        <h2>Professional Experience</h2>
        {variant.sections.map((section) => (
          <PlainJob key={section.job} role={resolve(section)} />
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        {variant.skillsRows.map(([label, key]) => (
          <p className="p-skillrow" key={key}>
            <span className="p-skilllabel">{label}: </span>
            {splitChips(skills(key)).join(', ')}
          </p>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        <p className="p-edu">
          <span className="p-strong">{education.degree}</span> — {education.school}, {eduYears}
        </p>
        <p className="p-edu">
          <span className="p-skilllabel">Publication: </span>
          <a href={publication.url}>{pubTitle}</a> — {publication.journal}, {publication.year}
        </p>
      </section>

      <section>
        <h2>Languages</h2>
        <p className="p-langs">
          {langPairs.map(([k, v], i) => (
            <Fragment key={k}>
              {i > 0 && ' · '}
              {k} ({v})
            </Fragment>
          ))}
        </p>
      </section>
    </div>
  );
}
