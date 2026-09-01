// The default variant: a hard left meta-column (company / blurb / location /
// dates) against a right content column, with the braces identity carried in
// the muted data-column ink around the name and the section marks.
import { Fragment, type ReactNode } from 'react';
import { person } from '../../lib/content.ts';
import { resolve } from '../../lib/experience.ts';
import type { GridVariant } from '../../types.ts';
import { Contact, contacts } from '../shared/Contact.tsx';
import { NoBreakCompounds } from '../shared/typography.tsx';
import { GridBackground, StackLedger } from './GridBackground.tsx';
import { skills } from '../../lib/content.ts';
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
      </header>

      <p className="intro g-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      {variant.stackPlacement === 'strip' && (
        <div className="g-stackstrip bgx-crow">
          {/* The strip borrows the ledger row's two-column grid so it sits
              in the page's rhythm instead of interrupting it: STACK in the
              meta column, the groups flowing in the content column. */}
          <div className="bgx-cmeta">
            <div className="bgx-key">Stack</div>
          </div>
          <div className="bgx-cval">
            {variant.stackRows.map(([sub, key]) => (
              <span className="g-ssgroup" key={sub}>
                <span className="g-sslabel">{sub}</span>
                {/* Real spaces around the separators: they are the only wrap
                  points, since the chips themselves never break. */}
                {skills(key)
                  .split(',')
                  .map((t, i) => (
                    <Fragment key={t}>
                      {i > 0 && <span className="bgx-sep">·</span>}{' '}
                      <span className="bgx-chip">{t.trim().replace(/ /g, '\u00A0')}</span>{' '}
                    </Fragment>
                  ))}
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="g-section">
        <GridSecMark>Experience</GridSecMark>
        {variant.sections.map((section) => (
          <GridEntry key={section.job} role={resolve(section)} />
        ))}
      </section>

      {variant.stackPlacement === 'section' && (
        <section className="g-section g-bg">
          <GridSecMark>Stack</GridSecMark>
          <StackLedger variant={variant} />
        </section>
      )}

      <GridBackground variant={variant} />
    </div>
  );
}
