// { BACKGROUND }: education, publication, languages, stack. Keys are set as
// the meta-column labels EXPERIENCE already uses, with the year beneath them
// in the mono dates voice, so the two sections speak one dialect. Styled
// under the bgx- prefix in grid.css.
import { Fragment, type ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background.ts';
import { education, publication, skills } from '../../lib/content.ts';
import type { GridVariant } from '../../types.ts';
import { GridSecMark } from './GridSecMark.tsx';

function Row({
  label,
  year,
  children,
}: {
  label: string;
  year?: string;
  children: ReactNode;
}): ReactNode {
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

// Hierarchy prototype switch for the design loop: 'sibling' keeps the two
// sections; 'merged' folds the stack group rows into the top of BACKGROUND;
// 'swapped' puts BACKGROUND before { STACK }. Pruned after the owner picks.
export const HIER: 'sibling' | 'merged' | 'swapped' = 'sibling';
// Divider prototype for the { STACK } / education seam, same lifecycle.
export const DIV: 'marks' | 'rule' | 'subtitle' | 'subtitleIndent' = 'subtitleIndent';

/** The subdivided stack ledger; lives in BACKGROUND unless stackPlacement hoists it. */
export function StackLedger({ variant }: { variant: GridVariant }): ReactNode {
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

export function GridBackground({ variant }: { variant: GridVariant }): ReactNode {
  const divided = variant.stackPlacement === 'combined' && HIER === 'sibling' && DIV !== 'marks';
  return (
    <section className={`g-section g-bg${divided ? ` g-divided g-div-${DIV}` : ''}`}>
      {!divided && <GridSecMark>Background</GridSecMark>}
      {divided && DIV !== 'rule' && <div className="g-divsub">background</div>}
      {HIER === 'merged' && variant.stackPlacement === 'combined' && (
        <StackGroupRows variant={variant} />
      )}
      <Row label="Education" year={eduYears}>
        <span className="bgx-strong">{education.degree}</span>
        <span className="bgx-dim"> · </span>
        {education.school}
      </Row>
      <Row
        label={variant.nestedPublication ? '\u21b3 publication' : 'Publication'}
        year={publication.year}
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
      {(variant.stackPlacement ?? 'background') === 'background' && (
        <StackLedger variant={variant} />
      )}
      {variant.stackPlacement === 'masthead' && <StackGroupRows variant={variant} />}
    </section>
  );
}
