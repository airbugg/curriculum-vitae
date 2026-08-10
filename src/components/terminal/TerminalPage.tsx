// THE SHELL — the whole CV as one terminal session (theme 'terminal').
// One window, one session; commands are the structure (no section markers),
// and the coloring is terminal truth throughout — zsh verb highlighting,
// glow-rendered markdown for the job files, fastfetch-style aligned rows
// for the background block.
import React, { type ReactNode } from 'react';
import { eduYears, langPairs, pubTitle } from '../../lib/background';
import { education, person, publications } from '../../lib/content';
import type { Variant } from '../../types';
import { Contact, contactList } from '../shared/Contact';
import { NoBreakCompounds } from '../shared/typography';
import { TermJob } from './TermJob';

function TCmd({ verb, args, href, children }: { verb: string; args: string; href?: string; children: ReactNode }): ReactNode {
  const argText = ' ' + args;
  return (
    <div className="t-block">
      <div className="t-cmd">
        <span className="t-prompt">{'›'}</span>{' '}
        <span className="t-verb">{verb}</span>
        {href ? <a href={href}>{argText}</a> : argText}
      </div>
      {children}
    </div>
  );
}

export function TerminalPage({ variant }: { variant: Variant }): ReactNode {
  const contacts = contactList();
  const slugify = (x: string) => x.replace(/ /g, '-');
  const [first, last] = person.name.toLowerCase().split(' ');
  // background.yml: fastfetch-style aligned key/value rows — plain facts,
  // no syntax cosplay (braces and quotes carry zero information here).
  const yKey = (k: string) => (k + ':').padEnd(13, ' ');
  return (
    <div className="page t-page">
      <header className="t-header">
        <h1>
          <span className="t-hb">{'{'}</span> <span className="t-hf">{first}</span>{' '}
          <span className="t-hc">:</span> {last} <span className="t-hb">{'}'}</span>
        </h1>
        <div className="t-title">{person.title.toLowerCase()}</div>
        <div className="t-contact">
          {contacts.map((c, i) => (
            <React.Fragment key={c.text}>
              {i > 0 && '  '}
              <Contact item={c} />
            </React.Fragment>
          ))}
        </div>
      </header>
      <div className="t-window">
        <div className="t-titlebar">
          <span className="t-wtitle">eugene@tlv:~/cv</span>
        </div>
        <div className="t-session">
          <TCmd verb="cat" args="README.md">
            <div className="t-out">
              <NoBreakCompounds text={variant.intro} />
            </div>
          </TCmd>
          <TCmd verb="glow" args="experience/*.md">
            {variant.sections.map((s) => (
              <TermJob key={s.job} section={s} />
            ))}
          </TCmd>
          <TCmd verb="cat" args="background.yml">
            <div className="t-out t-yaml">
              {/* Years leave the prose and land on the page's shared
                  right axis, exactly like the job headers — the loose
                  two-space fields tighten into left fact + right datum. */}
              <div className="t-yrow">
                <span>
                  <span className="t-ykey">{yKey('education')}</span>
                  {education.degreeShort ?? education.degree}
                  {'  '}
                  {education.schoolShort ?? education.school}
                </span>
                <span className="t-jobmeta">{eduYears()}</span>
              </div>
              <div className="t-yrow">
                <span>
                  <span className="t-ykey">{yKey('publication')}</span>
                  <a href={publications[0].url}>{pubTitle()}</a>
                  {'  '}
                  {publications[0].journal}
                </span>
                <span className="t-jobmeta">{publications[0].year}</span>
              </div>
              <div>
                <span className="t-ykey">{yKey('languages')}</span>
                {langPairs()
                  .map(([k, v]) => (v === 'native' ? `${k} native` : `${k} (${v})`))
                  .join(', ')}
              </div>
              <div>
                <span className="t-ykey">{yKey('offHours')}</span>
                {person.offHours
                  .split(',')
                  .map((s) => slugify(s.trim()))
                  .join('  ')}
              </div>
            </div>
          </TCmd>
          <div className="t-cmd">
            <span className="t-prompt">{'›'}</span> <span className="t-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
