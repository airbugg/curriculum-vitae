// Brand marks for the tech chips of icon-bearing variants, from the
// simple-icons set (CC0; each mark remains its owner's trademark). Keyed by
// the chip text exactly as content/skills.md prints it. A chip mapped to
// null renders text-only on purpose: AWS is absent from simple-icons after
// a trademark takedown, and this repo does not smuggle marks from less
// scrupulous sources. An unmapped chip in an icon variant throws by name.
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

export interface TechIcon {
  path: string;
  hex: string;
}

const pick = ({ path, hex }: { path: string; hex: string }): TechIcon => ({ path, hex });

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
  AWS: null,
  Kubernetes: pick(siKubernetes),
  Terraform: pick(siTerraform),
  'GitHub Actions': pick(siGithubactions),
  'GitLab CI': pick(siGitlab),
  Cloudflare: pick(siCloudflare),
};

/** The mark for a chip, null for a deliberate text-only chip. */
export function techIcon(chip: string): TechIcon | null {
  const icon = icons[chip];
  if (icon === undefined)
    throw new Error(`no tech icon mapped for chip '${chip}' — add it to src/lib/techicons.ts`);
  return icon;
}
