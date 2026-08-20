// One job record inside the shell's single `glow experience/*.md` command:
// a bat-style file rule, the glow-rendered header row, summary and bullets.
import type { ReactNode } from 'react';
import { compactDur, duration, parseMonth, shortRange, splitRange } from '../../lib/dates.ts';
import type { Job, Role } from '../../types.ts';
import { CompanyName } from '../shared/CompanyName.tsx';
import { Rich } from '../shared/Rich.tsx';
import { NoBreakCompounds } from '../shared/typography.tsx';

/** "Wix.com" → "Wix": the shell prints the bare company, never the domain. */
const bareName = (company: string): string => company.split('.')[0];

// experience/<start-year>-<company>.md — the fiction mirrors the repo truth
// (the jobs really are markdown files with front matter).
function fileName(job: Job): string {
  const start = parseMonth(splitRange(job.dates)[0]);
  // build.ts rejects any job whose dates duration() cannot parse, so this
  // never fires — but it fails by name rather than as a TypeError if it does.
  if (!start) throw new Error(`job '${job.id}': unparseable dates '${job.dates}'`);
  return `${start.y}-${bareName(job.company).toLowerCase()}.md`;
}

export function TermJob({ role: { job, bullets } }: { role: Role }): ReactNode {
  const dur = compactDur(duration(job.dates));
  return (
    <div className="t-frec">
      {/* bat-style file rule: dim hairline + the filename — one glow
          command runs the glob; each file gets a rule, not a prompt
          (clig: group many similar items under one header). */}
      <div className="t-frule">experience/{fileName(job)}</div>
      <div className="t-out t-jobhead">
        <span className="t-role">
          {/* Wordmarks replace the printed name (the hidden text layer keeps
              it searchable); marks sit before it — terminal-scale sizes live
              in terminal.css. */}
          {job.role} @ <CompanyName company={job.company} label={bareName(job.company)} />
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
        {bullets.map((id) => (
          <li key={id}>
            <Rich text={job.bullets[id]} />
          </li>
        ))}
      </ul>
    </div>
  );
}
