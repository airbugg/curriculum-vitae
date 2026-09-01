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

// Bottom-zone rebuild switch (design loop round five): the fullstack
// variant's whole zone below EXPERIENCE renders per this mode. Pruned
// once the owner picks.
export const ZONE: 'twomarks' | 'split' | 'bookend' | 'lastentry' = 'twomarks';

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
            <span className="bgx-level">({v.replace(/ /g, '\u00A0')})</span>
          </Fragment>
        ))}
      </Row>
    </>
  );
}

function ChipLine({ skillsKey }: { skillsKey: string }): ReactNode {
  return skills(skillsKey)
    .split(',')
    .map((t, i) => (
      <Fragment key={t}>
        {i > 0 && <span className="bgx-sep">·</span>}{' '}
        <span className="bgx-chip">{t.trim().replace(/ /g, '\u00A0')}</span>{' '}
      </Fragment>
    ));
}

/** The fullstack variant's whole bottom zone, per the ZONE mode. */
function FullstackZone({ variant }: { variant: GridVariant }): ReactNode {
  if (ZONE === 'twomarks')
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
  if (ZONE === 'split')
    return (
      <section className="g-section g-bg g-skink g-zsplit">
        <div className="g-zheads">
          <span className="g-zh1">{'{ TECHNOLOGIES }'}</span>
          <span className="g-zh2">{'{ BACKGROUND }'}</span>
        </div>
        <div className="g-zcols">
          <div className="g-zleft">
            {variant.stackRows.map(([sub, key]) => (
              <div className="g-zgroup" key={sub}>
                <div className="g-zglabel">{sub}</div>
                <div className="g-zchips">
                  <ChipLine skillsKey={key} />
                </div>
              </div>
            ))}
          </div>
          <div className="g-zright">
            <div className="g-zgroup">
              <div className="g-zglabel">
                education <span className="g-zyear">2013–2017</span>
              </div>
              <div className="g-zfact">
                <span className="bgx-strong">{education.degree}</span>
                <span className="bgx-dim"> · </span>
                {education.school}
              </div>
              <div className="g-zfact g-zsub">
                {'\u21b3'}{' '}
                <a href={publication.url} className="bgx-strong">
                  {pubTitle}
                </a>
                <span className="bgx-dim"> · </span>
                {publication.journal} <span className="g-zyear">2016</span>
              </div>
            </div>
            <div className="g-zgroup">
              <div className="g-zglabel">understands</div>
              <div className="g-zfact">
                {langPairs.map(([k, v], i) => (
                  <Fragment key={k}>
                    {i > 0 && <span className="bgx-sep">·</span>}
                    <span className="bgx-lang">{k}</span>{' '}
                    <span className="bgx-level">({v.replace(/ /g, '\u00A0')})</span>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  if (ZONE === 'bookend')
    return (
      <>
        <section className="g-section g-bg g-skink">
          <GridSecMark>Technologies</GridSecMark>
          <StackGroupRows variant={variant} />
        </section>
        <div className="g-bookend">
          <div className="g-bkline">
            <span className="g-bkkey">education</span>
            <span className="bgx-strong">{education.degree}</span>
            <span className="bgx-dim"> · </span>
            {education.school}
            <span className="g-zyear"> {eduYears}</span>
          </div>
          <div className="g-bkline">
            <span className="g-bkkey">publication</span>
            <a href={publication.url} className="bgx-strong">
              {pubTitle}
            </a>
            <span className="bgx-dim"> · </span>
            {publication.journal}
            <span className="g-zyear"> {publication.year}</span>
          </div>
          <div className="g-bkline">
            <span className="g-bkkey">understands</span>
            {langPairs.map(([k, v], i) => (
              <Fragment key={k}>
                {i > 0 && <span className="bgx-sep">·</span>}
                <span className="bgx-lang">{k}</span>{' '}
                <span className="bgx-level">({v.replace(/ /g, '\u00A0')})</span>
              </Fragment>
            ))}
          </div>
        </div>
      </>
    );
  // lastentry
  return (
    <section className="g-section g-bg g-skink">
      <GridSecMark>Background</GridSecMark>
      <div className="g-lerow">
        <div className="g-lemeta">
          <div className="g-ledeg">{education.degree}</div>
          <div className="g-leschool">{education.school}</div>
          <div className="g-ledates">{eduYears}</div>
          <div className="g-lepub">
            {'\u21b3'} <a href={publication.url}>{pubTitle}</a> · {publication.journal} ·{' '}
            {publication.year}
          </div>
          <div className="g-lelang">
            {langPairs.map(([k, v], i) => (
              <Fragment key={k}>
                {i > 0 && ' · '}
                <span className="bgx-lang">{k}</span>{' '}
                <span className="bgx-level">({v.replace(/ /g, '\u00A0')})</span>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="g-lechips">
          {variant.stackRows.map(([sub, key]) => (
            <div className="bgx-srow" key={sub}>
              <span className="bgx-sub">{sub}</span>
              <ChipLine skillsKey={key} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GridBackground({ variant }: { variant: GridVariant }): ReactNode {
  if (variant.stackPlacement === 'combined') return <FullstackZone variant={variant} />;
  return (
    <section className="g-section g-bg">
      <GridSecMark>Background</GridSecMark>
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
      {(variant.stackPlacement ?? 'background') === 'background' && (
        <StackLedger variant={variant} />
      )}
      {variant.stackPlacement === 'masthead' && <StackGroupRows variant={variant} />}
    </section>
  );
}
