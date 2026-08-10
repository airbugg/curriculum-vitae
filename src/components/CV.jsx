import React from 'react';
import { education, jobs, person, publications, skills } from '../lib/content.mjs';
import { logos } from '../lib/logos.mjs';

// =========================================================================
// SHARED PRIMITIVES — content helpers used by both layouts.
// =========================================================================

// Company logos. A `mark` renders before the name; a `wordmark` renders IN
// PLACE of the name (Wix/Rewire have no separate mark, and a wordmark next
// to the printed name would duplicate it). Missing files degrade to the
// plain text name.
function LogoAsset({ asset, className }) {
  const cls = `${className} g-lg-${asset.slug}`;
  if (asset.type === 'svg')
    return <span className={cls} dangerouslySetInnerHTML={{ __html: asset.data }} />;
  return (
    <span className={cls}>
      <img src={asset.data} alt="" />
    </span>
  );
}

function CompanyName({ id, text }) {
  const l = logos[id];
  if (l?.wordmark)
    return (
      <>
        <LogoAsset asset={l.wordmark} className="g-wordmark" />
        {/* The name stays in the PDF text layer (transparent, zero-width)
            so search and parsers still find the employer. */}
        <span className="g-alt">{text ?? id}</span>
      </>
    );
  return (
    <>
      {l?.mark && <LogoAsset asset={l.mark} className="g-logo" />}
      {tidyLabel(text ?? id)}
    </>
  );
}

// `tech` spans in content become <code> chips — the original CV's \mylib.
function Rich({ text }) {
  const parts = String(text).split('`');
  return parts.map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

// "Dec 2022 – Feb 2026" → "3 yr 3 mo", computed at build time so tenure is
// readable at a glance without mental date arithmetic. Inclusive month count
// (the LinkedIn convention); "Present" resolves to the build date.
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
function parseMonth(s) {
  const m = String(s).trim().match(/^([A-Z][a-z]{2})\w*\s+(\d{4})$/);
  if (!m) return null;
  return { y: Number(m[2]), m: MONTHS[m[1]] };
}
function duration(dates) {
  const [from, to] = String(dates).split('–').map((s) => s.trim());
  const start = parseMonth(from);
  const now = new Date();
  const end = /present/i.test(to || '') ? { y: now.getFullYear(), m: now.getMonth() + 1 } : parseMonth(to);
  if (!start || !end) return null;
  const months = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  if (months <= 0) return null;
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return [y ? `${y} yr` : null, mo ? `${mo} mo` : null].filter(Boolean).join(' ');
}

// The company-level tenure: total span for multi-role groups, the single
// role's span otherwise.
function groupDuration(group) {
  const first = jobs[group[0].job];
  const span =
    group.length > 1
      ? `${String(jobs[group[group.length - 1].job].dates).split('–')[0].trim()} – ${String(first.dates).split('–')[1].trim()}`
      : first.dates;
  return duration(span);
}

// Consecutive sections sharing a company merge into one group (the Remitly
// promotion stacks two roles under one employer).
function groupSections(sections) {
  const groups = [];
  for (const s of sections) {
    const co = jobs[s.job].company;
    const last = groups[groups.length - 1];
    if (last && jobs[last[0].job].company === co) last.push(s);
    else groups.push([s]);
  }
  return groups;
}

// Contacts carry live hrefs into the PDF (Chromium preserves link
// annotations in print output): tel: for the phone, mailto: for the email,
// https:// for the profile URLs. Location stays plain text.
function contactList() {
  return [
    { text: person.location },
    { text: person.phone, href: person.phone && 'tel:' + String(person.phone).replace(/[^+\d]/g, '') },
    { text: person.email, href: person.email && `mailto:${person.email}` },
    { text: person.github, href: person.github && `https://${person.github}` },
    { text: person.linkedin, href: person.linkedin && `https://${person.linkedin}` },
  ].filter((c) => c.text);
}

function Contact({ item }) {
  return item.href ? <a href={item.href}>{item.text}</a> : <span>{item.text}</span>;
}

// Rag control for narrow-column labels: parenthetical groups become
// unbreakable (break lands cleanly BEFORE the parenthesis), and otherwise the
// last space goes non-breaking so no single-word orphan wraps alone.
function tidyLabel(text) {
  const s = String(text);
  const paren = s.replace(/\(([^)]*)\)/g, (m) => m.replace(/ /g, '\u00A0'));
  if (paren !== s) return paren;
  return s.replace(/ (?=\S+$)/, '\u00A0');
}

// Hyphenated compounds ("early-stage") must never break at the hyphen.
function NoBreakCompounds({ text }) {
  const parts = String(text).split(/(\S+-\S+)/);
  return parts.map((p, i) =>
    i % 2 ? (
      <span key={i} style={{ whiteSpace: 'nowrap' }}>
        {p}
      </span>
    ) : (
      p
    ),
  );
}

// Compact date forms for data columns — "Dec 2022" → "Dec 22", "3 yr 3 mo"
// → "3y 3m" — so a range and its derived tenure share one line.
const shortRange = (d) => String(d).replace(/\b20(\d\d)\b/g, '$1');
const compactDur = (d) => d && d.replace(/(\d+) yr/, '$1y').replace(/(\d+) mo/, '$1m');

// Background facts shared by both layouts.
// langLevels ("english=native, hebrew=native, …") → [[name, level]].
function bgLangPairs() {
  return String(person.langLevels)
    .split(',')
    .map((pair) => pair.split('=').map((s) => s.trim()));
}
const bgEduYears = () => String(education.dates).replace(/\s*–\s*/, '–');
const bgPubTitle = () => publications[0].title.split(':')[0];

// =========================================================================
// THE FLAGSHIP — modernist grid (theme proto-b, layout 'grid').
// A hard left meta-column (company / location / dates as a data column)
// against a right content column. Company shows once per employer; each role
// keeps its own dates in the meta column, aligned to its bullets.
//
// The braces identity joins the grid as quiet structure, not decoration:
// mono braces in the muted data-column ink around the name and the section
// labels, with the single functional accent staying exactly where it was.
// =========================================================================

function GridSecMark({ children }) {
  return (
    <div className="g-secmark">
      <span className="g-sb">{'{'}</span>
      <span className="g-sw">{String(children).toUpperCase()}</span>
      <span className="g-sb">{'}'}</span>
    </div>
  );
}

function GridEntry({ group }) {
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

// { BACKGROUND } — the Manifest: the keys are set as the meta-column labels
// the rest of the page already uses (micro-caps in the data ink), with the
// year beneath them in the mono dates voice — so BACKGROUND speaks the exact
// dialect of EXPERIENCE. Facts run as content lines; stack items keep one
// whisper of the code soul as boxless deep-emerald mono chips.
function BgManifestRow({ label, year, children }) {
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

function BgChips({ text }) {
  return String(text)
    .split(',')
    .map((t, i) => (
      <React.Fragment key={t}>
        {i > 0 && <span className="bgx-sep">·</span>}
        <span className="bgx-off">{t.trim().replace(/ /g, '\u00A0')}</span>
      </React.Fragment>
    ));
}

function GridBackground({ variant }) {
  return (
    <section className="g-section g-bg">
      <GridSecMark>{variant.headings.background}</GridSecMark>
      <BgManifestRow label="Education" year={bgEduYears()}>
        <span className="bgx-strong">{education.degree}</span>
        <span className="bgx-dim"> · </span>
        {education.school}
      </BgManifestRow>
      <BgManifestRow label="Publication" year={publications[0].year}>
        <a href={publications[0].url} className="bgx-strong">
          {bgPubTitle()}
        </a>
        <span className="bgx-dim"> · </span>
        {publications[0].journal}
      </BgManifestRow>
      <BgManifestRow label="Languages">
        {bgLangPairs().map(([k, v], i) => (
          <React.Fragment key={k}>
            {i > 0 && <span className="bgx-sep">·</span>}
            <span className="bgx-lang">{k[0].toUpperCase() + k.slice(1)}</span>{' '}
            <span className="bgx-level">{v.replace(/ /g, '\u00A0')}</span>
          </React.Fragment>
        ))}
      </BgManifestRow>
      <BgManifestRow label="Stack">
        {/* The stack subdivides in place: three ledger lines inside the
            one STACK row, each led by a fixed-width muted sub-label so
            the chip groups align on a shared left edge. */}
        {variant.stackRows.map(([sub, key]) => (
          <div className="bgx-srow" key={sub}>
            <span className="bgx-sub">{sub}</span>
            <BgChips text={skills[key] ?? ''} />
          </div>
        ))}
      </BgManifestRow>
    </section>
  );
}

function GridPage({ variant }) {
  const groups = groupSections(variant.sections);
  const contacts = contactList();
  const [first, last] = person.name.toUpperCase().split(' ');
  return (
    <div className="page grid-page">
      {/* Centered identity above the grid: name, title, and one centered
          contact line. The braces stay quiet structural glyphs in the muted
          data ink; the title line carries the emerald. */}
      <header className="g-header">
        <h1>
          <span className="g-nb">{'{'}</span>
          <span className="g-nf">{first}</span>
          <span className="g-nc">:</span>
          <span className="g-nl">{last}</span>
          <span className="g-nb">{'}'}</span>
        </h1>
        <div className="g-title">{person.title}</div>
        <div className="g-contactline">
          {contacts.map((c, i) => (
            <React.Fragment key={c.text}>
              {i > 0 && <span className="sep">·</span>}
              <Contact item={c} />
            </React.Fragment>
          ))}
        </div>
      </header>

      <p className="intro g-intro">
        <NoBreakCompounds text={variant.intro} />
      </p>

      <section className="g-section">
        <GridSecMark>{variant.headings.experience}</GridSecMark>
        {groups.map((g) => (
          <GridEntry key={g[0].job} group={g} />
        ))}
      </section>

      <GridBackground variant={variant} />
    </div>
  );
}

// =========================================================================
// THE SHELL — the whole CV as one terminal session (theme/layout 'terminal').
// One window, one session; commands are the structure (no section markers),
// and the coloring is terminal truth throughout — zsh verb highlighting,
// glow-rendered markdown for the job files, fastfetch-style aligned rows
// for the background block.
// =========================================================================

function TCmd({ verb, args, href, children }) {
  const argText = args ? ' ' + args : null;
  return (
    <div className="t-block">
      <div className="t-cmd">
        <span className="t-prompt">{'›'}</span>{' '}
        <span className="t-verb">{verb}</span>
        {argText && (href ? <a href={href}>{argText}</a> : argText)}
      </div>
      {children}
    </div>
  );
}

// experience/<start-year>-<company>.md — the fiction mirrors the repo
// truth (the jobs really are markdown files with front matter).
function tJobSlug(section) {
  const job = jobs[section.job];
  const yr = String(job.dates).match(/\d{4}/)[0];
  return `${yr}-${job.company.split('.')[0].toLowerCase()}.md`;
}

function TermJob({ section }) {
  const job = jobs[section.job];
  const dur = compactDur(duration(job.dates));
  return (
    <div className="t-frec">
      {/* bat-style file rule: dim hairline + the filename — one glow
          command runs the glob; each file gets a rule, not a prompt
          (clig: group many similar items under one header). */}
      <div className="t-frule">experience/{tJobSlug(section)}</div>
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

function TerminalPage({ variant }) {
  const contacts = contactList();
  const slugify = (x) => String(x).replace(/ /g, '-');
  // background.yml: fastfetch-style aligned key/value rows — plain facts,
  // no syntax cosplay (braces and quotes carry zero information here).
  const yKey = (k) => (k + ':').padEnd(13, '\u00A0');
  return (
    <div className="page t-page">
      <header className="t-header">
        <h1>
          <span className="t-hb">{'{'}</span> <span className="t-hf">eugene</span>{' '}
          <span className="t-hc">:</span> lerman <span className="t-hb">{'}'}</span>
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
                <span className="t-jobmeta">{bgEduYears()}</span>
              </div>
              <div className="t-yrow">
                <span>
                  <span className="t-ykey">{yKey('publication')}</span>
                  <a href={publications[0].url}>{bgPubTitle()}</a>
                  {'  '}
                  {publications[0].journal}
                </span>
                <span className="t-jobmeta">{publications[0].year}</span>
              </div>
              <div>
                <span className="t-ykey">{yKey('languages')}</span>
                {bgLangPairs()
                  .map(([k, v]) => (v === 'native' ? `${k} native` : `${k} (${v})`))
                  .join(', ')}
              </div>
              <div>
                <span className="t-ykey">{yKey('offHours')}</span>
                {(variant.offHours ?? []).map(slugify).join('  ')}
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

export function CVPage({ variant, css }) {
  const body =
    variant.layout === 'terminal' ? (
      <TerminalPage variant={variant} />
    ) : (
      <GridPage variant={variant} />
    );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{`${person.name} — CV`}</title>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body className={variant.theme + (variant.bodyClass ? ` ${variant.bodyClass}` : '')}>
        {body}
      </body>
    </html>
  );
}
