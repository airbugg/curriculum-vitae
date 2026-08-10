// One job record inside the shell's single `glow experience/*.md` command:
// a bat-style file rule, the glow-rendered header row, summary and bullets.
import type { ReactNode } from 'react';
import { jobs } from '../../lib/content';
import { compactDur, duration, shortRange } from '../../lib/dates';
import type { Section } from '../../types';
import { CompanyName } from '../shared/CompanyName';
import { Rich } from '../shared/Rich';
import { NoBreakCompounds } from '../shared/typography';

// experience/<start-year>-<company>.md — the fiction mirrors the repo
// truth (the jobs really are markdown files with front matter).
function slug(section: Section): string {
  const job = jobs[section.job];
  const yr = String(job.dates).match(/\d{4}/)![0];
  return `${yr}-${job.company.split('.')[0].toLowerCase()}.md`;
}

export function TermJob({ section }: { section: Section }): ReactNode {
  const job = jobs[section.job];
  const dur = compactDur(duration(job.dates));
  return (
    <div className="t-frec">
      {/* bat-style file rule: dim hairline + the filename — one glow
          command runs the glob; each file gets a rule, not a prompt
          (clig: group many similar items under one header). */}
      <div className="t-frule">experience/{slug(section)}</div>
      <div className="t-out t-jobhead">
        <span className="t-role">
          {/* Wordmarks replace the printed name (hidden text layer keeps
              it searchable); marks sit before it — terminal-scale sizes
              live in terminal.css. Kitty/iTerm render images; so do we. */}
          {job.role} @ <CompanyName id={job.company} text={job.company.split('.')[0]} />
        </span>
        <span className="t-jobmeta">
          {shortRange(job.dates)}
          {dur ? ` (${dur})` : ''}
          {'  '}
          {job.location.toLowerCase()}
        </span>
      </div>
      {job.summary && (
        <div className="t-out t-summary">
          <NoBreakCompounds text={job.summary} />
        </div>
      )}
      <ul className="t-bullets">
        {section.bullets.map((id) => (
          <li key={id}>
            <Rich text={job.bullets[id]} />
          </li>
        ))}
      </ul>
    </div>
  );
}
