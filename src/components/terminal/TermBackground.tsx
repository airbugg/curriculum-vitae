// The shell's `cat background.yml` output: fastfetch-style aligned key/value
// rows — plain facts, no syntax cosplay (braces and quotes carry zero
// information here). Years leave the prose and land on the page's shared
// right axis, exactly like the job headers, so the loose two-space fields
// tighten into left fact + right datum.
import type { ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background.ts';
import { education, person, publication } from '../../lib/content.ts';

const KEY_WIDTH = 13;

// The pad is NBSP, not a space: the block sits under `white-space: pre-wrap`,
// where a run of ordinary trailing spaces is a legal break point and the value
// column would lose its alignment. Do not "simplify" this to ' '.
const yKey = (key: string): string => (key + ':').padEnd(KEY_WIDTH, '\u00A0');

const slugify = (x: string): string => x.replace(/ /g, '-');

export function TermBackground(): ReactNode {
  return (
    <div className="t-out t-yaml">
      <div className="t-yrow">
        <span>
          <span className="t-ykey">{yKey('education')}</span>
          {education.degreeShort ?? education.degree}
          {'  '}
          {education.schoolShort ?? education.school}
        </span>
        <span className="t-jobmeta">{eduYears}</span>
      </div>
      <div className="t-yrow">
        <span>
          <span className="t-ykey">{yKey('publication')}</span>
          <a href={publication.url}>{pubTitle}</a>
          {'  '}
          {publication.journal}
        </span>
        <span className="t-jobmeta">{publication.year}</span>
      </div>
      <div>
        <span className="t-ykey">{yKey('languages')}</span>
        {langPairs.map(([k, v]) => (v === 'native' ? `${k} native` : `${k} (${v})`)).join(', ')}
      </div>
      <div>
        <span className="t-ykey">{yKey('offHours')}</span>
        {person.offHours
          .split(',')
          .map((s) => slugify(s.trim()))
          .join('  ')}
      </div>
    </div>
  );
}
