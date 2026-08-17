#!/usr/bin/env node
// Works out the next version and writes the release notes, both from the
// Conventional Commits since the last `v*` tag:
//
//   breaking change  → major        feat → minor        anything else → patch
//
// Tags are the source of truth for the current version; package.json's
// version is only the seed used before the first tag exists. Writes
// release-notes.md and, under Actions, version/tag/name to GITHUB_OUTPUT.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, TYPES, type CommitType, type ParsedCommit } from './commits.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();

// Newest tag by version order, not commit date — a re-run must not pick up
// a tag that sorts lower just because it was pushed later.
const lastTag = git('tag', '--list', 'v*', '--sort=-v:refname').split('\n')[0] || '';

const seed = lastTag
  ? lastTag.slice(1)
  : (JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version as string);
const [major, minor, patch] = seed.split('.').map(Number);

// ASCII record/unit separators: unlike NUL-pairs they cannot collide with
// an empty %b, and git never emits them itself.
const RS = '\x1e';
const US = '\x1f';
const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
const commits: ParsedCommit[] = git('log', range, `--format=%H${US}%s${US}%b${RS}`)
  .split(RS)
  .map((entry) => entry.trim().split(US))
  .filter(([sha, subject]) => sha && subject)
  .map(([sha, subject, body]) => {
    const commit = parse(subject, sha.slice(0, 7));
    // A `!` header or a BREAKING CHANGE footer, per the spec.
    if (commit && /^BREAKING[ -]CHANGE:/m.test(body ?? '')) commit.breaking = true;
    return commit;
  })
  .filter((c): c is ParsedCommit => c !== null)
  // The release job's own preview-refresh commit is bookkeeping, not news.
  .filter((c) => !c.header.includes('[skip ci]'));

const bump = commits.some((c) => c.breaking)
  ? 'major'
  : commits.some((c) => c.type === 'feat')
    ? 'minor'
    : 'patch';

const version =
  bump === 'major'
    ? `${major + 1}.0.0`
    : bump === 'minor'
      ? `${major}.${minor + 1}.0`
      : `${major}.${minor}.${patch + 1}`;

const repo = process.env.GITHUB_REPOSITORY ?? 'airbugg/curriculum-vitae';
const lines: string[] = [];

const breaking = commits.filter((c) => c.breaking);
if (breaking.length) {
  lines.push('### Breaking changes', '');
  for (const c of breaking) lines.push(`- ${c.scope ? `**${c.scope}**: ` : ''}${c.subject} (${c.sha})`);
  lines.push('');
}

for (const [type, heading] of Object.entries(TYPES) as [CommitType, string][]) {
  const group = commits.filter((c) => c.type === type && !c.breaking);
  if (!group.length) continue;
  lines.push(`### ${heading}`, '');
  for (const c of group) lines.push(`- ${c.scope ? `**${c.scope}**: ` : ''}${c.subject} (${c.sha})`);
  lines.push('');
}

if (!lines.length) lines.push('No user-facing changes.', '');

lines.push(
  lastTag
    ? `**Full changelog**: https://github.com/${repo}/compare/${lastTag}...v${version}`
    : `**Full changelog**: https://github.com/${repo}/commits/v${version}`,
);

writeFileSync(join(ROOT, 'release-notes.md'), lines.join('\n') + '\n');

const out = { version, tag: `v${version}`, name: `CV v${version}` };
if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(out).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');

console.log(`${lastTag || '(no tag)'} → ${out.tag}  [${bump}, ${commits.length} commits]`);
console.log(lines.join('\n'));
