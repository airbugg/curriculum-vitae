// One employer on the grid: meta column (company / blurb / location / dates)
// against the content column (role / summary / bullets), one g-row per role.
import type { ReactNode } from 'react';
import { jobs } from '../../lib/content';
import { compactDur, shortRange } from '../../lib/dates';
import { groupDuration } from '../../lib/experience';
import type { Section } from '../../types';
import { CompanyName } from '../shared/CompanyName';
import { Rich } from '../shared/Rich';
import { NoBreakCompounds, tidyLabel } from '../shared/typography';

export function GridEntry({ group }: { group: Section[] }): ReactNode {
  const first = jobs[group[0].job];
  return (
    <>
      {group.map((s, i) => {
        const job = jobs[s.job];
        return (
          // Continuation rows (a promotion within the same employer) are
          // pulled tighter to their parent row so the lone dates block reads
          // bound to the company above, not adrift in whitespace.
          <div className={i === 0 ? 'g-row' : 'g-row g-cont'} key={s.job}>
            <div className="g-meta">
              {i === 0 && (
                <>
                  <div className="g-co">
                    <CompanyName id={first.company} />
                  </div>
                  {first.blurb && <div className="g-mblurb">{tidyLabel(first.blurb)}</div>}
                  <div className="g-loc">{first.location}</div>
                </>
              )}
              <span className="g-dates">
                {shortRange(job.dates)}
                {i === 0 && groupDuration(group) && (
                  <span className="g-dur"> ({compactDur(groupDuration(group))})</span>
                )}
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
                {s.bullets.map((id) => (
                  <li key={id}>
                    <Rich text={job.bullets[id]} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </>
  );
}
