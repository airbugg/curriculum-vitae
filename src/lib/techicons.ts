// Brand marks for the tech chips of icon-bearing variants, from the
// simple-icons set (CC0; each mark remains its owner's trademark), keyed by
// the chip text exactly as content/skills.md prints it. AWS is the one
// exception: absent from simple-icons after a trademark takedown, it ships
// as Amazon's own AWS Cloud logo group icon, used verbatim under CC-BY-ND -
// provenance and license in assets/techicons/. An unmapped chip in an icon
// variant throws by name.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  siAstro,
  siCloudflare,
  siGithubactions,
  siGitlab,
  siGraphql,
  siKubernetes,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siRabbitmq,
  siReact,
  siRuby,
  siTerraform,
  siTypescript,
} from 'simple-icons';

/** A simple-icons path in its brand hex, or a verbatim vendored SVG. */
type TechIcon = { path: string; hex: string } | { svg: string };

const pick = ({ path, hex }: { path: string; hex: string }): TechIcon => ({ path, hex });
const vendored = (file: string): TechIcon => {
  const path = join(process.cwd(), 'assets', 'techicons', file);
  if (!existsSync(path))
    throw new Error(`vendored icon assets/techicons/${file} is missing — see its PROVENANCE.md`);
  return { svg: readFileSync(path, 'utf8').trim() };
};

const icons: Record<string, TechIcon | null> = {
  TypeScript: pick(siTypescript),
  Python: pick(siPython),
  Ruby: pick(siRuby),
  'SQL (PostgreSQL)': pick(siPostgresql),
  'Node.js': pick(siNodedotjs),
  React: pick(siReact),
  GraphQL: pick(siGraphql),
  RabbitMQ: pick(siRabbitmq),
  'Next.js': pick(siNextdotjs),
  'React Native': pick(siReact),
  Astro: pick(siAstro),
  AWS: vendored('aws-cloud.svg'),
  Kubernetes: pick(siKubernetes),
  Terraform: pick(siTerraform),
  'GitHub Actions': pick(siGithubactions),
  'GitLab CI': pick(siGitlab),
  Cloudflare: pick(siCloudflare),
};

/** Whether a chip is mapped at all — validate.ts checks every chip of an
 * icon-bearing variant against this before anything renders. */
export function hasTechIcon(chip: string): boolean {
  return chip in icons;
}

/** The mark for a chip; null marks a deliberate text-only chip (an
 * allowance no current entry uses). The throw is a backstop — validate.ts
 * catches an unmapped chip first, by name, before render. */
export function techIcon(chip: string): TechIcon | null {
  const icon = icons[chip];
  if (icon === undefined)
    throw new Error(`no tech icon mapped for chip '${chip}' — add it to src/lib/techicons.ts`);
  return icon;
}
