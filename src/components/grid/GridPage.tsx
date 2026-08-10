// THE FLAGSHIP — modernist grid (theme 'grid').
// A hard left meta-column (company / location / dates as a data column)
// against a right content column. Company shows once per employer; each role
// keeps its own dates in the meta column, aligned to its bullets.
//
// The braces identity joins the grid as quiet structure, not decoration:
// mono braces in the muted data-column ink around the name and the section
// labels, with the single functional accent staying exactly where it was.
import React, { type ReactNode } from 'react';
import { person } from '../../lib/content';
import { groupSections } from '../../lib/experience';
import type { Variant } from '../../types';
import { Contact, contactList } from '../shared/Contact';
import { NoBreakCompounds } from '../shared/typography';
import { GridBackground } from './GridBackground';
import { GridEntry } from './GridEntry';
import { GridSecMark } from './GridSecMark';

export function GridPage({ variant }: { variant: Variant }): ReactNode {
  const groups = groupSections(variant.sections);
  const contacts = contactList();
  const [first, last] = person.name.toUpperCase().split(' ');
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
            <React.Fragment key={c.text}>
              {i > 0 && <span className="sep">·</span>}
              <Contact item={c} />
            </React.Fragment>
          ))}
        </div>
      </header>

      <p className="intro g-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      <section className="g-section">
        <GridSecMark>Experience</GridSecMark>
        {groups.map((g) => (
          <GridEntry key={g[0].job} group={g} />
        ))}
      </section>

      <GridBackground variant={variant} />
    </div>
  );
}
