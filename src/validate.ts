// Every cross-file reference a variant makes, checked before anything renders.
// A bullet id, intro key or skills key that went missing would otherwise
// render as a literal "undefined" (or as silence), and the one-page check
// would happily pass.
//
// Errors are collected rather than thrown so one run reports all of them.
import { jobs, skillKeys, skills, splitChips } from './lib/content.ts';
import { duration } from './lib/dates.ts';
import { hasTechIcon, missingIcon } from './lib/techicons.ts';
import type { Variant } from './types.ts';

export function validate(variants: Variant[]): string[] {
  const errors: string[] = [];
  for (const v of variants) {
    if (!v.intro) errors.push(`${v.file}: intro is empty — check content/intro.md keys`);
    for (const { job: id, bullets } of v.sections) {
      const job = jobs[id];
      if (!job) {
        errors.push(`${v.file}: unknown job '${id}'`);
        continue;
      }
      // Asking the real consumer, not a lookalike regex: a shape this
      // accepts but duration() rejects would silently drop the tenure from
      // the rendered page and still pass the one-page check.
      if (duration(job.dates) === null)
        errors.push(
          `${v.file}: job '${id}' dates '${job.dates}' do not parse ` +
            '(need "Mon YYYY – Mon YYYY|Present" with an en dash)',
        );
      for (const bullet of bullets)
        if (!(bullet in job.bullets))
          errors.push(`${v.file}: job '${id}' has no bullet '${bullet}'`);
    }
    if (v.theme === 'grid') {
      for (const [, key] of v.stackRows) {
        if (!skillKeys.includes(key)) {
          errors.push(`${v.file}: no '${key}' key in content/skills.md`);
          continue;
        }
        // Every chip an icon-bearing variant prints must be mapped, checked
        // here so a missing mark fails by name rather than mid-render.
        if (v.techIcons)
          for (const chip of splitChips(skills(key)))
            if (!hasTechIcon(chip)) errors.push(`${v.file}: ${missingIcon(chip)}`);
      }
      // The combined masthead subline reads this key outside stackRows.
      const coreKey = v.coreKey ?? 'stackCore';
      if (v.stackPlacement === 'combined' && !skillKeys.includes(coreKey))
        errors.push(
          `${v.file}: stackPlacement 'combined' needs a '${coreKey}' key in content/skills.md`,
        );
    }
  }
  return errors;
}
