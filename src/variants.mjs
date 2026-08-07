// Five variants: which bullets, what intro, which theme.
// Each entry: { file, label, theme, layout, nameStyle?, intro, sections, skills, headings }
// nameStyle 'plain' opts out of the { EUGENE : LERMAN } braces identity (ATS).

export const variants = [
  // THE FLAGSHIP — the canonical variant, promoted from Prototype B.
  // Strict modernist grid: hard left meta-column (company / blurb / location
  // / dates / tenure as a data column) against a right content column,
  // visible structural asymmetry, one functional accent (emerald).
  // Müller-Brockmann. The braces identity rendered as quiet structure — mono
  // braces in the muted data ink around name and section labels. It took two
  // things from Prototype C on the way up: the centered contact line under
  // the title, and the boxless emerald-mono tech chips in the bullets.
  // (nameStyle 'plain' only opts out of base.css's id-braces styling; the
  // grid layout carries its own brace markup.)
  {
    file: 'eugene-lerman',
    label: 'The Flagship · Modernist Grid',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-mid',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.',
    contactExtra: 'English · Hebrew · Russian',
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  // THE FULL STACK ENGINEER — the canonical grid, retargeted: end-to-end
  // product story (client + services + infrastructure). Same theme and
  // layout as the flagship; only the title, intro and bullet cut differ.
  {
    file: 'eugene-lerman-full-stack',
    label: 'The Full Stack Engineer',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-dense',
    title: 'Senior Full Stack Engineer',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building products end to end: the clients, the services behind them and the infrastructure underneath, at Wix, Remitly and now an early-stage startup.',
    contactExtra: 'English · Hebrew · Russian',
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'onboarding'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'apollo'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'secondAuth'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  {
    file: 'eugene-lerman-platform',
    label: 'The Platform Engineer',
    theme: 'platform',
    layout: 'single',
    intro:
      'Software engineer, twelve years, most of them on client platforms and infrastructure: build and release systems, CI, localization, the machinery other engineers work on top of.',
    headings: { experience: 'Experience', skills: 'Skills', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'ci'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: [
      ['Core', 'core'],
      ['Native', 'native'],
      ['AI tooling', 'ai'],
      ['Languages', 'spoken'],
    ],
  },

  // THE AI-NATIVE ENGINEER — rebuilt on the canonical grid (the old
  // violet flow design lives in git history). The how-I-work section goes
  // grid-native: the prose is content, and the harness roster moves out of
  // the prose into the data column — a stacked mono list, the same voice as
  // the dates everywhere else on the page.
  {
    file: 'eugene-lerman-ai-native',
    label: 'The AI-Native Engineer',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-dense',
    intro:
      'Since early 2026 most of my code has shipped through coding agents: spec-first, implementation and review running in parallel. Underneath that, twelve years of TypeScript, React Native and client infrastructure.',
    contactExtra: 'English · Hebrew · Russian',
    howIWork: {
      heading: 'How I work',
      text:
        'Spec- and prototype-driven, multi-agent: Ralph-style loops, custom skills for repetitive work (simulator testing included), agents for implementation, review and validation. I went through the everything-is-a-skill phase, hit context bloat, and came back to a lean setup: a few focused skills, progressively disclosed, code as the source of truth.',
      metaLabel: 'harnesses in rotation',
      metaItems: ['Claude Code', 'Codex', 'Cursor', 'OpenClaw', 'Hermes', 'Argent'],
    },
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative'] },
      { job: 'wix', bullets: ['forms'] },
    ],
    skills: null,
  },

  {
    file: 'eugene-lerman-classic',
    label: 'The Classic',
    theme: 'looker',
    layout: 'single',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.',
    contactExtra: 'English · Hebrew · Russian',
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys', 'apollo'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'ci'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  {
    file: 'eugene-lerman-ats',
    label: 'The Parser',
    theme: 'parser',
    layout: 'single',
    nameStyle: 'plain',
    intro:
      'Senior Software Engineer with 12+ years in client infrastructure, frontend architecture and mobile development. Led CI/CD migrations, a localization platform, a React Native migration and AI-assisted development workflows for products serving millions of users.',
    headings: { experience: 'Professional Experience', skills: 'Skills', education: 'Education' },
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
      { job: 'remitlySenior', bullets: ['reactNative', 'ci'] },
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

  // ------------------------------------------------------------------------
  // THREE DIAMETRICALLY OPPOSED PROTOTYPES (design-research deliverables).
  // Same facts, three philosophies. See DESIGN.md for the full rationale.
  // ------------------------------------------------------------------------

  // A — RADICAL REDUCTION. One family (Source Sans), two sizes, no chips, no
  // colour, no rules, no braces. Whitespace is the only hierarchy device.
  // Tschichold-austere / Bringhurst restraint. Fewer, stronger bullets so the
  // page breathes and fills evenly instead of bunching at the top.
  {
    file: 'eugene-lerman-proto-a',
    label: 'Prototype A · Radical Reduction',
    theme: 'proto-a',
    layout: 'reduction',
    nameStyle: 'plain',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.',
    contactExtra: 'English · Hebrew · Russian',
    contactSplit: 4, // two balanced contact lines instead of one full-measure run
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n'] },
      { job: 'remitlySenior', bullets: ['reactNative'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  // B — STRICT MODERNIST GRID: promoted to the canonical `eugene-lerman`
  // at the top of this list. No longer built under a prototype name.

  // C — EDITORIAL / EXPRESSIVE. Strong scale contrast — a big quiet hero,
  // small dense text — and the braces identity amplified into the layout: giant
  // emerald braces as structural section markers, not sprinkled punctuation.
  // Keeps the braces soul recognizably alive. Deliberate unequal distribution.
  {
    file: 'eugene-lerman-proto-c',
    label: 'Prototype C · Editorial Expressive',
    theme: 'proto-c',
    layout: 'editorial',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.',
    contactExtra: 'English · Hebrew · Russian',
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  // D — GRID × EDITORIAL. The owner's convergence candidate: C's structure
  // and voice (centered braces header, display intro, emerald, brace section
  // markers) carrying B's vertically stacked per-entry metadata column
  // (company / blurb / location / dates / tenure-under-dates) against a
  // right column of role, summary and bullets.
  {
    file: 'eugene-lerman-proto-d',
    label: 'Prototype D · Grid × Editorial',
    theme: 'proto-d',
    layout: 'hybrid',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years of building clients and the infrastructure underneath them, at Wix, Remitly and now an early-stage startup.',
    contactExtra: 'English · Hebrew · Russian',
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n'] },
      { job: 'remitlySenior', bullets: ['reactNative'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },
];
