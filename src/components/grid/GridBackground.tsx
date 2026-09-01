// The page's bottom zone. The default grid variant prints one
// { BACKGROUND } section (education, publication, languages, stack); the
// screening cut ('combined') prints { TECHNOLOGIES } then { BACKGROUND }.
// Keys are set as the meta-column labels EXPERIENCE already uses, so the
// sections speak one dialect. Styled under the bgx- prefix in grid.css.
import { Fragment, type ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background.ts';
import { education, publication, skills } from '../../lib/content.ts';
import type { GridVariant } from '../../types.ts';
import { GridSecMark } from './GridSecMark.tsx';

function Row({
  label,
  year,
  className,
  children,
}: {
  label: string;
  year?: string;
  className?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={className ? `bgx-crow ${className}` : 'bgx-crow'}>
      <div className="bgx-cmeta">
        <div className="bgx-key">{label}</div>
        {year && <div className="bgx-cyr">{year}</div>}
      </div>
      <div className="bgx-cval">{children}</div>
    </div>
  );
}

function Chips({ text }: { text: string }): ReactNode {
  return text.split(',').map((t, i) => (
    <Fragment key={t}>
      {i > 0 && <span className="bgx-sep">·</span>}
      {/* NBSP: a two-word chip must not break across lines. */}
      <span className="bgx-chip">{t.trim().replace(/ /g, '\u00A0')}</span>
    </Fragment>
  ));
}

/**
 * The inventory as rows of the ledger the page already taught: each group
 * name in the mono meta column, exactly where company and dates live, terms
 * run-in in the content column. The Awesome-CV \cvskill pattern.
 */
export function StackGroupRows({ variant }: { variant: GridVariant }): ReactNode {
  return (
    <>
      {variant.stackRows.map(([sub, key]) => (
        <Row label={sub} key={sub}>
          <Chips text={skills(key)} />
        </Row>
      ))}
    </>
  );
}

/** The default variant's one-row stack: sub-labelled ledger lines inside BACKGROUND. */
function StackLedger({ variant }: { variant: GridVariant }): ReactNode {
  return (
    <Row label="Stack">
      {/* The stack subdivides in place: ledger lines inside the one STACK
          row, each led by a fixed-width muted sub-label so the chip groups
          align on a shared left edge. */}
      {variant.stackRows.map(([sub, key]) => (
        <div className="bgx-srow" key={sub}>
          <span className="bgx-sub">{sub}</span>
          <Chips text={skills(key)} />
        </div>
      ))}
    </Row>
  );
}

function EduRows({ variant }: { variant: GridVariant }): ReactNode {
  return (
    <>
      <Row label="Education" year={eduYears}>
        <span className="bgx-strong">{education.degree}</span>
        <span className="bgx-dim"> · </span>
        {education.school}
      </Row>
      <Row
        label={variant.nestedPublication ? '\u21b3 publication' : 'Publication'}
        year={publication.year}
        className={variant.nestedPublication ? 'bgx-nested' : undefined}
      >
        <a href={publication.url} className="bgx-strong">
          {pubTitle}
        </a>
        <span className="bgx-dim"> · </span>
        {publication.journal}
      </Row>
      <Row label="Understands">
        {langPairs.map(([k, v], i) => (
          <Fragment key={k}>
            {i > 0 && <span className="bgx-sep">·</span>}
            <span className="bgx-lang">{k}</span>{' '}
            {/* NBSP: a level phrase must not break across lines. */}
            <span className="bgx-level">({v.replace(/ /g, '\u00A0')})</span>
          </Fragment>
        ))}
      </Row>
    </>
  );
}

/**
 * The screening cut's bottom zone: the inventory as its own
 * { TECHNOLOGIES } section, then the credentials as { BACKGROUND } —
 * two honest names, two of the page's own full-measure hairlines.
 */
function FullstackZone({ variant }: { variant: GridVariant }): ReactNode {
  return (
    <>
      <section className="g-section g-bg g-skink">
        <GridSecMark>Technologies</GridSecMark>
        <StackGroupRows variant={variant} />
      </section>
      <section className="g-section g-bg g-z2">
        <GridSecMark>Background</GridSecMark>
        <EduRows variant={variant} />
      </section>
    </>
  );
}

export function GridBackground({ variant }: { variant: GridVariant }): ReactNode {
  if (variant.stackPlacement === 'combined') return <FullstackZone variant={variant} />;
  return (
    <section className="g-section g-bg">
      <GridSecMark>Background</GridSecMark>
      <EduRows variant={variant} />
      <StackLedger variant={variant} />
    </section>
  );
}
