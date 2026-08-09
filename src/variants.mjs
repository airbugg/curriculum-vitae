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
  // The generalist thesis, per the owner: not a client engineer, not a
  // full-stack engineer — an engineer who takes up whatever role the product
  // needs. The old full-stack / ai-native / unified siblings folded back in
  // here (they live in git history): the AI story is woven into the intro
  // and the job summaries rather than sectioned, the full-stack evidence
  // (second-auth, Wix editor auth, Lokey, the release services) carries the
  // breadth claim, and Rewire gets its bullets back.
  {
    file: 'eugene-lerman',
    label: 'The Flagship · Modernist Grid',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-dense',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years at Wix, Remitly and now an early-stage startup, building whatever needed building: apps, services, release systems, the infrastructure underneath. Since early 2026 most of that code has shipped through coding agents.',
    languages: true,
    // Array form: the BACKGROUND section renders these as a code literal.
    offHours: ['k3s home lab', 'home automation', 'other over-engineering'],
    headings: { experience: 'Experience', background: 'Background' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'secondAuth'] },
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

  // THE FULL STACK / AI-NATIVE / UNIFIED grid siblings — folded into the
  // canonical above (the generalist consolidation). Their exact cuts live in
  // git history if a targeted variant is ever needed again.

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
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
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
        bullets: ['rewrite', 'platform'],
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

  // ------------------------------------------------------------------------
  // TWO REIMAGININGS (independent 2026 redesign commission). Same facts,
  // two new philosophies, deliberately unrelated to the house style above.
  // ------------------------------------------------------------------------

  // R1 — THE BROADSHEET. Brutalist Swiss poster: a full-bleed ink slab with
  // the name letterspaced edge to edge (EUGENE solid, LERMAN outline), one
  // hot signal-orange accent, numbered sections under thick rules, slash
  // markers. The braces identity is deliberately discarded; the wall of
  // type is the identity.
  {
    file: 'eugene-lerman-reimagine-1',
    label: 'Reimagine 1 · The Broadsheet (brutalist poster)',
    theme: 'reimagine-1',
    layout: 'poster',
    nameStyle: 'plain',
    intro:
      'Twelve years of building whatever the product needed: apps, services, release systems, the infrastructure underneath. Wix, Remitly, and now an early-stage startup. Since early 2026 most of that code has shipped through coding agents.',
    headings: { experience: 'Experience', background: 'Background' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  // R2 — THE LEDGER. Editorial career cartography: a vertical time axis in
  // the left margin with the twelve years drawn to scale (employment as
  // filled emerald spans, the degree as a hollow one), the reverse-
  // chronological content descending into the past beside it. Tufte
  // marginalia; the emerald identity survives as data ink.
  {
    file: 'eugene-lerman-reimagine-2',
    label: 'Reimagine 2 · The Ledger (career cartography)',
    theme: 'reimagine-2',
    layout: 'ledger',
    nameStyle: 'plain',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years at Wix, Remitly and now an early-stage startup, building whatever needed building; since early 2026 most of that code has shipped through coding agents.',
    axisCaption: 'fig. 1\n2013–2026,\ndrawn to scale',
    headings: { experience: 'Experience', education: 'Education' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'agentSkills'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  // ------------------------------------------------------------------------
  // { BACKGROUND } EXPERIMENTS — three reinterpretations of the canonical
  // variant's final section (design study, 2026-08). Each entry is the
  // flagship verbatim plus a bgStyle discriminator; only the BACKGROUND
  // section differs. Three answers to "do we need the object keys?":
  //   a — keys become the commands of a terminal session (code soul kept);
  //   b — keys dropped entirely, a keyless typographic ledger;
  //   c — keys kept but re-set as the grid's own meta-column labels.
  // ------------------------------------------------------------------------

  {
    file: 'eugene-lerman-bg-a',
    label: 'BG Study A · The Session (terminal transcript)',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-dense',
    bgStyle: 'a',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years at Wix, Remitly and now an early-stage startup, building whatever needed building: apps, services, release systems, the infrastructure underneath. Since early 2026 most of that code has shipped through coding agents.',
    languages: true,
    offHours: ['k3s home lab', 'home automation', 'other over-engineering'],
    headings: { experience: 'Experience', background: 'Background' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'secondAuth'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  {
    file: 'eugene-lerman-bg-b',
    label: 'BG Study B · The Colophon (keyless ledger)',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-dense',
    bgStyle: 'b',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years at Wix, Remitly and now an early-stage startup, building whatever needed building: apps, services, release systems, the infrastructure underneath. Since early 2026 most of that code has shipped through coding agents.',
    languages: true,
    offHours: ['k3s home lab', 'home automation', 'other over-engineering'],
    headings: { experience: 'Experience', background: 'Background' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'secondAuth'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },

  {
    file: 'eugene-lerman-bg-c',
    label: 'BG Study C · The Manifest (keys join the grid)',
    theme: 'proto-b',
    layout: 'grid',
    nameStyle: 'plain',
    bodyClass: 'g-dense',
    bgStyle: 'c',
    intro:
      'A curious individual and a voracious reader with a somewhat philosophical approach to life. Twelve years at Wix, Remitly and now an early-stage startup, building whatever needed building: apps, services, release systems, the infrastructure underneath. Since early 2026 most of that code has shipped through coding agents.',
    languages: true,
    offHours: ['k3s home lab', 'home automation', 'other over-engineering'],
    headings: { experience: 'Experience', background: 'Background' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'secondAuth'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
    skills: null,
  },
];
