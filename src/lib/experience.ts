// The boundary where a variant's ids become domain objects. Variants name
// jobs by id, because that is what a human authoring one should type; past
// this point nothing indexes a registry.
import type { Role, Section } from '../types.ts';
import { jobs } from './content.ts';

export const resolve = (section: Section): Role => ({
  job: jobs[section.job],
  bullets: section.bullets,
});
