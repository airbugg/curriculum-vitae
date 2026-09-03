// The shell variant: the whole CV as one terminal session. One window, one
// session, and commands are the structure — no section markers. The colouring
// is terminal truth throughout: zsh verb highlighting, glow-rendered markdown
// for the job files, fastfetch-style aligned rows for the background block.
import { Fragment, type ReactNode } from 'react';
import { person } from '../../lib/content.ts';
import { resolve } from '../../lib/experience.ts';
import type { TerminalVariant } from '../../types.ts';
import { Contact, contacts } from '../shared/Contact.tsx';
import { NoBreakCompounds } from '../shared/typography.tsx';
import { TermBackground } from './TermBackground.tsx';
import { TermJob } from './TermJob.tsx';

function TCmd({
  verb,
  args,
  href,
  children,
}: {
  verb: string;
  args: string;
  href?: string;
  children: ReactNode;
}): ReactNode {
  const argText = ' ' + args;
  return (
    <div className="t-block">
      <div className="t-cmd">
        <span className="t-prompt">{'›'}</span> <span className="t-verb">{verb}</span>
        {href ? <a href={href}>{argText}</a> : argText}
      </div>
      {children}
    </div>
  );
}

export function TerminalPage({ variant }: { variant: TerminalVariant }): ReactNode {
  const [first, ...rest] = person.name.toLowerCase().split(' ');
  const last = rest.join(' ');
  return (
    <div className="page t-page">
      <header className="t-header">
        <h1>
          <span className="t-hb">{'{'}</span> <span className="t-hf">{first}</span>{' '}
          <span className="t-hc">:</span> {last} <span className="t-hb">{'}'}</span>
        </h1>
        <div className="t-title">{(variant.title ?? person.title).toLowerCase()}</div>
        <div className="t-contact">
          {contacts(variant.publicContact).map((c, i) => (
            <Fragment key={c.text}>
              {i > 0 && '  '}
              <Contact item={c} />
            </Fragment>
          ))}
        </div>
      </header>
      <div className="t-window">
        <div className="t-titlebar">
          <span className="t-wtitle">{`${first}@tlv:~/cv`}</span>
        </div>
        <div className="t-session">
          <TCmd verb="cat" args="README.md">
            <div className="t-out">
              <NoBreakCompounds text={variant.intro} />
            </div>
          </TCmd>
          <TCmd verb="glow" args="experience/*.md">
            {variant.sections.map((section) => (
              <TermJob key={section.job} role={resolve(section)} />
            ))}
          </TCmd>
          <TCmd verb="cat" args="background.yml">
            <TermBackground />
          </TCmd>
          {/* The session ends on a bare prompt with a resting cursor, the way
              an idle terminal does. */}
          <div className="t-cmd">
            <span className="t-prompt">{'›'}</span> <span className="t-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
