// The boundary where a variant's ids become domain objects. Variants name
// jobs and bullets by id, because that is what a human authoring one should
// type; past this point nothing indexes a registry.
//
// build.ts checks every reference before rendering and reports them all
// together, so the throws here never fire — but they fail by name rather
// than as a TypeError if that order ever changes.
import type { Role, Section } from '../types.ts';
import { jobs } from './content.ts';

export function resolve(section: Section): Role {
  const job = jobs[section.job];
  if (!job) throw new Error(`unknown job '${section.job}'`);
  return {
    job,
    bullets: section.bullets.map((id) => {
      const text = job.bullets[id];
      if (text === undefined) throw new Error(`job '${job.id}' has no bullet '${id}'`);
      return { id, text };
    }),
  };
}
