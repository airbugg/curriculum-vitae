// The default variant: a hard left meta-column (company / blurb / location /
// dates) against a right content column, with the braces identity carried in
// the muted data-column ink around the name and the section marks.
import { Fragment, type ReactNode } from 'react';
import { person, skills } from '../../lib/content.ts';
import { resolve } from '../../lib/experience.ts';
import type { GridVariant } from '../../types.ts';
import { Contact, contacts } from '../shared/Contact.tsx';
import { nbsp, NoBreakCompounds } from '../shared/typography.tsx';
import { GridBackground } from './GridBackground.tsx';
import { GridEntry } from './GridEntry.tsx';
import { GridSecMark } from './GridSecMark.tsx';

export function GridPage({ variant }: { variant: GridVariant }): ReactNode {
  const [first, ...rest] = person.name.toUpperCase().split(' ');
  const last = rest.join(' ');
  return (
    <div className="page grid-page">
      {/* Centered identity above the grid: name, title, and one centered
          contact line. The braces stay quiet structural glyphs in the muted
          data ink; the title line carries the emerald. */}
      <header className="g-header">
        <h1>
          <span className="g-nb">{'{'}</span>
          <span className="g-nf">{first}</span>
          <span className="g-nc">:</span>
          <span className="g-nl">{last}</span>
          <span className="g-nb">{'}'}</span>
        </h1>
        <div className="g-title">{person.title}</div>
        <div className="g-contactline">
          {contacts.map((c, i) => (
            <Fragment key={c.text}>
              {i > 0 && <span className="sep">·</span>}
              <Contact item={c} />
            </Fragment>
          ))}
        </div>
        {/* The distilled core stack as a nameplate subline: identity, not
            inventory — curated in content/skills.md ## stackCore, no
            labels, quieter than the contact line. */}
        {variant.stackPlacement === 'combined' && (
          <div className="g-mastack">
            {skills('stackCore')
              .split(',')
              .map((t, i) => (
                <Fragment key={t}>
                  {i > 0 && <span className="g-msep">·</span>}
                  <span>{nbsp(t.trim())}</span>
                </Fragment>
              ))}
          </div>
        )}
      </header>

      <p className="intro g-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      <section className="g-section">
        <GridSecMark>Experience</GridSecMark>
        {variant.sections.map((section) => (
          <GridEntry key={section.job} role={resolve(section)} />
        ))}
      </section>

      <GridBackground variant={variant} />
    </div>
  );
}
