// One role on the grid: meta column (company / blurb / location / dates)
// against the content column (role / summary / bullets).
import type { ReactNode } from 'react';
import { compactDur, duration, shortRange } from '../../lib/dates.ts';
import type { Role } from '../../types.ts';
import { CompanyName } from '../shared/CompanyName.tsx';
import { Rich } from '../shared/Rich.tsx';
import { NoBreakCompounds, tidyLabel } from '../shared/typography.tsx';

export function GridEntry({ role: { job, bullets } }: { role: Role }): ReactNode {
  const tenure = compactDur(duration(job.dates));
  return (
    <div className="g-row">
      <div className="g-meta">
        <div className="g-co">
          <CompanyName company={job.company} />
        </div>
        {job.blurb && <div className="g-mblurb">{tidyLabel(job.blurb)}</div>}
        <div className="g-loc">{job.location}</div>
        <span className="g-dates">
          {shortRange(job.dates)}
          {tenure && <span className="g-dur"> ({tenure})</span>}
        </span>
      </div>
      <div className="g-content">
        <div className="g-role">{job.role}</div>
        {job.summary && (
          <div className="g-summary">
            <NoBreakCompounds text={job.summary} />
          </div>
        )}
        <ul>
          {bullets.map(({ id, text }) => (
            <li key={id}>
              <Rich text={text} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
