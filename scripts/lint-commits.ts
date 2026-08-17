#!/usr/bin/env node
// Conventional Commit enforcement, in two modes:
//
//   node scripts/lint-commits.ts --file .git/COMMIT_EDITMSG   (commit-msg hook)
//   node scripts/lint-commits.ts --range origin/master..HEAD  (CI, whole PR)
//
// The hook is installed by `npm run prepare` (git config core.hooksPath),
// so a fresh clone gets it on npm install. CI re-checks the range because a
// hook is advisory — anyone can --no-verify past it.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { headerOf, isExempt, validate } from './commits.ts';

const [flag, value] = process.argv.slice(2);
if (!['--file', '--range'].includes(flag) || !value) {
  console.error('usage: lint-commits.ts (--file <path> | --range <rev>..<rev>)');
  process.exit(2);
}

// Headers to check, newest first. A commit message file holds exactly one.
const headers =
  flag === '--file'
    ? [headerOf(readFileSync(value, 'utf8'))]
    : execFileSync('git', ['log', '--format=%s', value], { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);

let failed = false;
for (const header of headers) {
  const errors = validate(header);
  if (errors.length) {
    failed = true;
    console.error(`✗ ${header}`);
    for (const e of errors) console.error(`  ${e}`);
  }
}

const checked = headers.filter((h) => !isExempt(h)).length;
if (failed) {
  console.error('\nCommit messages follow Conventional Commits: https://www.conventionalcommits.org');
  console.error('Example: feat(shell): add a resting cursor to the session');
  process.exit(1);
}
console.log(`✓ ${checked} commit message${checked === 1 ? '' : 's'} ok`);
