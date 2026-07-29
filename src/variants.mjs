// Five variants: which bullets, what intro, which theme.
// Each entry: { file, label, theme, layout, nameStyle?, intro, sections, skills, headings }
// nameStyle 'plain' opts out of the { EUGENE : LERMAN } braces identity (ATS).

export const variants = [
  {
    file: 'eugene-lerman-platform',
    label: 'The Platform Engineer',
    theme: 'platform',
    layout: 'single',
    intro:
      'Software engineer, twelve years, most of them on client platforms and infrastructure: build and release systems, CI, localization, the machinery other engineers work on top of.',
    headings: { experience: 'Experience', skills: 'Skills', education: 'Education', publications: 'Publications' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'ci'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: [
      ['Core', 'core'],
      ['Native', 'native'],
      ['AI practice', 'ai'],
      ['Languages', 'spoken'],
    ],
  },

  {
    file: 'eugene-lerman-generalist',
    label: 'The Startup Generalist',
    theme: 'generalist',
    layout: 'single',
    intro:
      'Software engineer, twelve years. I have owned client infrastructure, native and React Native apps, release engineering and the occasional gnarly product flow. I like small teams and large ownership.',
    headings: { experience: 'Experience', skills: 'Skills', education: 'Education', publications: 'Publications' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'onboarding', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'ci'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: [
      ['Core', 'core'],
      ['Native', 'native'],
      ['AI practice', 'ai'],
      ['Languages', 'spoken'],
    ],
  },

  {
    file: 'eugene-lerman-ai-native',
    label: 'The AI-Native Engineer',
    theme: 'ai',
    layout: 'single',
    intro:
      'Since early 2026 most of my code has shipped through coding agents: spec-first, implementation and review running in parallel. Underneath that, twelve years of TypeScript, React Native and client infrastructure.',
    howIWork: {
      heading: 'How I work',
      text:
        'Spec- and prototype-driven, multi-agent: Ralph-style loops, custom skills for repetitive work (simulator testing included), agents for implementation, review and validation. I went through the everything-is-a-skill phase, hit context bloat, and came back to a lean setup: a few focused skills, progressively disclosed, code as the source of truth. Harnesses in rotation: Claude Code, Codex, Cursor, OpenClaw, Hermes, Argent.',
    },
    headings: { experience: 'Experience', skills: 'Skills', education: 'Education', publications: 'Publications' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'agentSkills', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'ci'] },
      { job: 'wix', bullets: ['forms'] },
    ],
    skills: [
      ['Core', 'core'],
      ['Native', 'native'],
      ['Languages', 'spoken'],
    ],
  },

  {
    file: 'eugene-lerman',
    label: 'The Looker',
    theme: 'looker',
    layout: 'single',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.',
    headings: { experience: 'Experience', skills: 'Skills', education: 'Education', publications: 'Publications' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'ci'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
      { job: 'lab', bullets: ['sole'] },
    ],
    skills: [
      ['Core', 'core'],
      ['Native', 'native'],
      ['AI practice', 'ai'],
      ['Languages', 'spoken'],
    ],
  },

  {
    file: 'eugene-lerman-ats',
    label: 'The Parser',
    theme: 'parser',
    layout: 'single',
    nameStyle: 'plain',
    intro:
      'Senior Software Engineer with 12+ years in client infrastructure, frontend architecture and mobile development. Led CI/CD migrations, a localization platform, a React Native migration and AI-assisted development workflows for products serving millions of users.',
    headings: { experience: 'Professional Experience', skills: 'Skills', education: 'Education', publications: 'Publications' },
    sections: [
      {
        job: 'rylo',
        bullets: ['rewrite', 'platform', 'release'],
        overrides: {
          rewrite:
            'One of five engineers on a ground-up rewrite of the company client apps (native iOS/Swift, Android/Kotlin, React Native), shipped in three months using spec-driven, multi-agent AI development workflows.',
        },
      },
      {
        job: 'remitlyStaff',
        bullets: ['lead', 'l10n', 'semanticKeys'],
        overrides: {
          l10n:
            'Designed and implemented a localization automation platform (i18next): dynamic translation delivery, version-scoped production hotfixes, and CI-driven string extraction and translator handoff.',
        },
      },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'ci'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: [
      ['Languages', 'TypeScript, JavaScript, Python, Swift, Kotlin, Objective-C, SQL, Bash'],
      ['Frontend', 'React, React Native, Expo, EAS, Nitro Modules, XState, Apollo GraphQL, Redux, MobX, Tailwind CSS, Reanimated, Svelte, Angular, i18next'],
      ['Backend & Infrastructure', 'Node.js, Bun, GitHub Actions, GitLab CI, Jenkins, Terraform, Pulumi, AWS, Kubernetes, Helm, Docker'],
      ['AI Tooling', 'Claude Code, Codex, Cursor, multi-agent workflows, MCP, agent skill authoring, spec-driven development'],
      ['Spoken Languages', 'English (fluent), Hebrew (fluent), Russian (conversational)'],
    ],
    skillsRaw: true,
  },
];
