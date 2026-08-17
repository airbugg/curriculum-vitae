// Conventional Commits: the shared parser behind the commit-msg hook, the
// CI lint job, and the release versioner. Spec: conventionalcommits.org.
//
//   type(optional scope)!: subject
//
// Hand-rolled rather than pulling in commitlint, which costs ~50 packages
// to enforce one regex. Same rule set as @commitlint/config-conventional
// minus the parts that never fire on a one-author repo.

/** Commit types, in the order their sections appear in release notes. */
export const TYPES = {
  feat: 'Features',
  fix: 'Fixes',
  perf: 'Performance',
  refactor: 'Refactoring',
  docs: 'Documentation',
  build: 'Build',
  ci: 'CI',
  test: 'Tests',
  style: 'Style',
  chore: 'Chores',
  revert: 'Reverts',
} as const;

export type CommitType = keyof typeof TYPES;

export const HEADER_MAX = 100;

const HEADER = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?: (?<subject>.+)$/;

export interface ParsedCommit {
  type: CommitType;
  scope?: string;
  breaking: boolean;
  subject: string;
  header: string;
  sha?: string;
}

/** Messages git generates or that tooling rewrites — not ours to police. */
export function isExempt(header: string): boolean {
  return /^(Merge |Revert |fixup!|squash!)/.test(header);
}

/** Header → errors. Empty array means valid. */
export function validate(header: string): string[] {
  if (isExempt(header)) return [];
  const errors: string[] = [];
  const m = HEADER.exec(header);
  if (!m?.groups) {
    return [
      `not a Conventional Commit: "${header}"`,
      `  expected "type(scope): subject", type one of: ${Object.keys(TYPES).join(', ')}`,
    ];
  }
  const { type, subject } = m.groups;
  if (!(type in TYPES)) errors.push(`unknown type "${type}" — use one of: ${Object.keys(TYPES).join(', ')}`);
  if (header.length > HEADER_MAX) errors.push(`header is ${header.length} chars, max ${HEADER_MAX}`);
  if (subject.endsWith('.')) errors.push('subject must not end with a period');
  // Sentence case only; ACRONYMS and lowercase both pass.
  if (/^[A-Z][a-z]/.test(subject)) errors.push(`subject must not be capitalized: "${subject}"`);
  return errors;
}

/** Header → parsed commit, or null if it does not parse. */
export function parse(header: string, sha?: string): ParsedCommit | null {
  const m = HEADER.exec(header);
  if (!m?.groups) return null;
  const { type, scope, breaking, subject } = m.groups;
  if (!(type in TYPES)) return null;
  return {
    type: type as CommitType,
    scope,
    breaking: breaking === '!',
    subject,
    header,
    sha,
  };
}

/** The first non-empty, non-comment line of a commit message file. */
export function headerOf(message: string): string {
  return (
    message
      .split('\n')
      .map((l) => l.trimEnd())
      .find((l) => l && !l.startsWith('#')) ?? ''
  );
}
