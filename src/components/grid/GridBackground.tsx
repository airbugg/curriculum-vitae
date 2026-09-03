// The page's bottom zone. The default grid variant prints one
// { BACKGROUND } section (education, publication, languages, stack); the
// screening cut ('combined') prints { TECH } then { BACKGROUND }.
// Keys are set as the meta-column labels EXPERIENCE already uses, so the
// sections speak one dialect. Styled under the bgx- prefix in grid.css.
import { Fragment, type ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background.ts';
import { education, publication, skills, splitChips } from '../../lib/content.ts';
import { educationMark } from '../../lib/logos.ts';
import { techIcon } from '../../lib/techicons.ts';
import type { GridVariant } from '../../types.ts';
import { InlineMark } from '../shared/InlineMark.tsx';
import { nbsp } from '../shared/typography.tsx';
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

function Chips({ text, icons }: { text: string; icons?: boolean }): ReactNode {
  return splitChips(text).map((t, i) => {
    const icon = icons ? techIcon(t) : null;
    return (
      <Fragment key={t}>
        {i > 0 && <span className="bgx-sep">·</span>}
        {/* NBSP: a two-word chip must not break across lines; the mark
            rides inside the chip span so it can never orphan. */}
        <span className="bgx-chip">
          {icon &&
            ('svg' in icon ? (
              <span className="bgx-ticon" dangerouslySetInnerHTML={{ __html: icon.svg }} />
            ) : (
              <svg className="bgx-ticon" viewBox="0 0 24 24" aria-hidden>
                <path d={icon.path} fill={`#${icon.hex}`} />
              </svg>
            ))}
          {nbsp(t)}
        </span>
      </Fragment>
    );
  });
}

/**
 * The inventory as rows of the ledger the page already taught: each group
 * name in the mono meta column, exactly where company and dates live, terms
 * run-in in the content column. The Awesome-CV \cvskill pattern.
 */
function StackGroupRows({ variant }: { variant: GridVariant }): ReactNode {
  return (
    <>
      {variant.stackRows.map(([sub, key]) => (
        <Row label={sub} key={sub}>
          <Chips text={skills(key)} icons={variant.techIcons} />
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
  // The screening cut nests the publication under education (the swept arrow
  // and a tighter pitch); the classic zone keys it as its own row.
  const nested = variant.stackPlacement === 'combined';
  return (
    <>
      <Row label="Education" year={eduYears}>
        <span className="bgx-strong">{education.degree}</span>
        <span className="bgx-dim"> · </span>
        {educationMark && <InlineMark asset={educationMark} className="bgx-emark" />}
        {education.school}
      </Row>
      {!variant.omitPublication && (
        <Row
          label={nested ? '\u21b3 publication' : 'Publication'}
          year={publication.year}
          className={nested ? 'bgx-nested' : undefined}
        >
          <a href={publication.url} className="bgx-strong">
            {pubTitle}
          </a>
          <span className="bgx-dim"> · </span>
          {publication.journal}
        </Row>
      )}
      <Row label="Understands">
        {langPairs.map(([k, v], i) => (
          <Fragment key={k}>
            {i > 0 && <span className="bgx-sep">·</span>}
            <span className="bgx-lang">{k}</span>{' '}
            {/* NBSP: a level phrase must not break across lines. */}
            <span className="bgx-level">({nbsp(v)})</span>
          </Fragment>
        ))}
      </Row>
    </>
  );
}

/**
 * The screening cut's bottom zone: the inventory as its own { TECH }
 * section, then the credentials as { BACKGROUND }.
 */
function FullstackZone({ variant }: { variant: GridVariant }): ReactNode {
  return (
    <>
      <section className="g-section g-bg g-skink">
        <GridSecMark>Tech</GridSecMark>
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
