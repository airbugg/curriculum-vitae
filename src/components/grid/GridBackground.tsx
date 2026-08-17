// { BACKGROUND } — the Manifest: the keys are set as the meta-column labels
// the rest of the page already uses (micro-caps in the data ink), with the
// year beneath them in the mono dates voice — so BACKGROUND speaks the exact
// dialect of EXPERIENCE. Facts run as content lines; stack items keep one
// whisper of the code soul as boxless deep-emerald mono chips.
// (The bgx- prefix = the BACKGROUND block, named in the §15–§19 studies
// that produced it — see DESIGN.md.)
import React, { type ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background';
import { education, publications, skills } from '../../lib/content';
import type { Variant } from '../../types';
import { GridSecMark } from './GridSecMark';

function Row({ label, year, children }: { label: string; year?: string; children: ReactNode }): ReactNode {
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
  return String(text)
    .split(',')
    .map((t, i) => (
      <React.Fragment key={t}>
        {i > 0 && <span className="bgx-sep">·</span>}
        {/* NBSP: a two-word chip must not break across lines. */}
        <span className="bgx-off">{t.trim().replace(/ /g, '\u00A0')}</span>
      </React.Fragment>
    ));
}

export function GridBackground({ variant }: { variant: Variant }): ReactNode {
  return (
    <section className="g-section g-bg">
      <GridSecMark>Background</GridSecMark>
      <Row label="Education" year={eduYears()}>
        <span className="bgx-strong">{education.degree}</span>
        <span className="bgx-dim"> · </span>
        {education.school}
      </Row>
      <Row label="Publication" year={publications[0].year}>
        <a href={publications[0].url} className="bgx-strong">
          {pubTitle()}
        </a>
        <span className="bgx-dim"> · </span>
        {publications[0].journal}
      </Row>
      <Row label="Languages">
        {langPairs().map(([k, v], i) => (
          <React.Fragment key={k}>
            {i > 0 && <span className="bgx-sep">·</span>}
            <span className="bgx-lang">{k[0].toUpperCase() + k.slice(1)}</span>{' '}
            {/* NBSP: "reads and speaks well" stays on one line. */}
            <span className="bgx-level">{v.replace(/ /g, '\u00A0')}</span>
          </React.Fragment>
        ))}
      </Row>
      <Row label="Stack">
        {/* The stack subdivides in place: three ledger lines inside the
            one STACK row, each led by a fixed-width muted sub-label so
            the chip groups align on a shared left edge. */}
        {(variant.stackRows ?? []).map(([sub, key]) => (
          <div className="bgx-srow" key={sub}>
            <span className="bgx-sub">{sub}</span>
            <Chips text={skills[key] ?? ''} />
          </div>
        ))}
      </Row>
    </section>
  );
}
