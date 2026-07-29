// Five variants: which bullets, what intro, which theme.
// Each entry: { file, label, theme, layout, intro, sections, skills, headings }

export const variants = [
  {
    file: 'eugene-lerman-platform',
    label: 'The Platform Engineer',
    theme: 'platform',
    layout: 'single',
    intro:
      'I build the pipelines, platforms and release machinery other engineers stop noticing — which is the point. A decade of making migrations boring: AngularJS exoduses, weekend CI cutovers, clients rewritten in months. Voracious reader; still somewhat philosophical about it.',
    headings: { experience: 'Experience', skills: 'Toolbox', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'ci', 'semanticKeys', 'apollo'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
      { job: 'lab', bullets: ['pub'] },
    ],
    skills: [
      ['Languages', 'languages'],
      ['Client', 'client'],
      ['Infra', 'backendInfra'],
      ['AI', 'ai'],
    ],
  },

  {
    file: 'eugene-lerman-generalist',
    label: 'The Startup Generalist',
    theme: 'generalist',
    layout: 'single',
    intro:
      'Curious individual, voracious reader, collector of hats: client infrastructure, native and React Native apps, release engineering, and the occasional genuinely hairy onboarding flow. Happiest with small teams, large ownership, and rewrites measured in months.',
    headings: { experience: 'Experience', skills: 'Skillz, matured', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'onboarding', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys', 'ci'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['modernization', 'forms', 'auth'] },
      { job: 'lab', bullets: ['sole', 'pub'] },
    ],
    skills: [
      ['Languages', 'languages'],
      ['Client', 'client'],
      ['Infra', 'backendInfra'],
      ['AI', 'ai'],
    ],
  },

  {
    file: 'eugene-lerman-ai-native',
    label: 'The AI-Native Engineer',
    theme: 'ai',
    layout: 'single',
    intro:
      'Most of my code now ships through agents — specs in, reviewed and validated software out, three to five loops in parallel. I’ve run every frontier model and every harness worth mentioning, and kept the parts that survived contact with production.',
    howIWork: {
      heading: 'How I work',
      text:
        'Spec- and prototype-driven, multi-agent by default: Ralph loops and software-factory setups, custom skills for the monotonous parts (simulator testing included), agents for implementation, review and validation. Went through the everything-is-a-skill phase, hit context bloat, came out the other side with a lean, progressively disclosed setup — code as the source of truth. Harness rotation: Claude Code, Codex, Cursor, OpenClaw, Hermes, Argent — whichever model fits the task that week.',
    },
    headings: { experience: 'Experience', skills: 'Toolbox', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'agentSkills', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'semanticKeys', 'l10n', 'ci'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
      { job: 'lab', bullets: ['pub'] },
    ],
    skills: [
      ['Languages', 'languages'],
      ['Client', 'client'],
      ['Infra', 'backendInfra'],
    ],
  },

  {
    file: 'eugene-lerman',
    label: 'The Looker',
    theme: 'looker',
    layout: 'sidebar',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to software: build the platform well and the product stops being hard. Ten years of client infrastructure, migrations and rewrites that went quietly.',
    headings: { experience: 'Experience', skills: 'Toolbox', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release', 'onboarding'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys', 'ci'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
      { job: 'lab', bullets: ['pub'] },
    ],
    skills: [
      ['Languages', 'languages'],
      ['Client', 'client'],
      ['Infra', 'backendInfra'],
      ['AI', 'ai'],
    ],
  },

  {
    file: 'eugene-lerman-ats',
    label: 'The Parser',
    theme: 'parser',
    layout: 'single',
    intro:
      'Senior Software Engineer with 10+ years in client infrastructure, frontend architecture and mobile development. Led CI/CD migrations, localization platforms, a React Native migration, and AI-assisted development workflows for products serving ~10M monthly active users.',
    headings: { experience: 'Professional Experience', skills: 'Skills', education: 'Education' },
    sections: [
      {
        job: 'rylo',
        bullets: ['rewrite', 'platform', 'release', 'onboarding'],
        overrides: {
          rewrite:
            'Rewrote the client stack (native iOS/Swift, Android/Kotlin, React Native) with a five-person team in three months, using spec-driven, multi-agent AI development workflows.',
          release:
            'Re-architected mobile release engineering: automated release pipeline with a web-based management UI and an internal app-distribution system replacing Firebase App Distribution.',
          onboarding:
            'Owned the rebuilt application’s onboarding flow, modeled and simplified with XState state machines.',
        },
      },
      {
        job: 'remitlyStaff',
        bullets: ['lead', 'l10n', 'semanticKeys', 'ci', 'apollo'],
        overrides: {
          l10n:
            'Designed and implemented a localization automation platform: dynamic translation delivery with version-scoped production hotfixes and CI-driven string extraction and translator handoff (i18next).',
          semanticKeys:
            'Built an AI-assisted migration service converting tens of thousands of translation strings to semantic keys via model suggestions, a review UI, and auto-generated pull requests.',
          ci:
            'Migrated all client CI/CD pipelines from GitLab to GitHub Actions across 4–6 teams, cutting pipeline runtimes by over 50% with a zero-disruption weekend cutover.',
        },
      },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['modernization', 'forms', 'auth'] },
      { job: 'lab', bullets: ['sole', 'pub'] },
    ],
    skills: [
      ['Languages', 'TypeScript, JavaScript, Python, Swift, Kotlin, Objective-C, SQL, Bash'],
      ['Frontend', 'React, React Native, Expo, EAS, Nitro Modules, XState, Apollo GraphQL, Redux, MobX, Tailwind CSS, Reanimated, Svelte, Angular, i18next'],
      ['Backend & Infrastructure', 'Node.js, Bun, GitHub Actions, GitLab CI, Jenkins, Terraform, Pulumi, AWS, Kubernetes, Helm, Docker'],
      ['AI Tooling', 'Claude Code, Codex, Cursor, multi-agent workflows, MCP, agent skill authoring, spec-driven development'],
    ],
    skillsRaw: true,
  },
];
