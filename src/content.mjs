// Single source of truth for CV facts.
// Variants pick bullets by id and may override text; facts live here once.

export const person = {
  name: 'Eugene Lerman',
  title: 'Senior Software Engineer',
  location: 'Tel Aviv, Israel',
  phone: '(+972) 52-3535-231',
  email: 'lerman.gene@gmail.com',
  github: 'github.com/airbugg',
  linkedin: 'linkedin.com/in/lerman-gene',
  site: 'eugenelerman.net',
};

export const jobs = {
  rylo: {
    company: 'Rylo',
    blurb: 'AI communication platform for the Deaf and hard-of-hearing · $100M+ raised',
    role: 'Software Engineer',
    location: 'Tel Aviv',
    dates: 'Feb 2026 – Present',
    bullets: {
      rewrite:
        'Part of the five-person crew that rewrote the entire client stack — native iOS (Swift), Android (Kotlin) and React Native — in three months, working spec-first with 3–5 coding agents running implement–review–validate loops in parallel.',
      platform:
        'Built the platform under the rewrite: a monorepo housing the apps, a design system with automated Figma sync, and client CI/CD — all from scratch.',
      release:
        'Re-architected mobile release engineering on my own initiative: an automated release pipeline with a web UI for cutting branches and shipping builds, feeding an internal app-distribution system I built when Firebase’s stopped earning its keep.',
      onboarding:
        'Owned the rebuilt app’s onboarding — its hairiest flow — modeled as an XState machine until it stopped being hairy.',
      agentSkills:
        'Put the team’s shared agent setup on a diet after noticing every fresh session started 70k tokens in debt: lean, focused skills, progressively disclosed, code as the source of truth.',
    },
  },

  remitlyStaff: {
    company: 'Remitly Israel (formerly Rewire)',
    blurb: 'cross-border banking & remittances',
    role: 'Staff Software Engineer · Client Infrastructure',
    location: 'Tel Aviv',
    dates: 'Dec 2022 – Feb 2026',
    bullets: {
      lead:
        'Lead engineer of the Client Infrastructure team: technical planning and cross-team initiatives spanning ~10 teams and three products (~10M MAUs).',
      l10n:
        'Designed the localization platform: translations delivered dynamically with version-scoped production hotfixes (previously: cut a release), plus a diff-driven CI pipeline that extracts changed strings, files translator tasks, and stops blocking merges.',
      semanticKeys:
        'Migrated tens of thousands of strings to semantic keys with an AI service I built — model-suggested names, human-approved in a purpose-built UI, applied as auto-generated PRs. Two weeks of talking to product; hours of actual migration.',
      ci:
        'Moved all client CI/CD from GitLab to GitHub Actions across 4–6 teams: runtimes down 50%+, cutover done in a weekend. Monday passed without comment, which was the goal.',
      apollo:
        'Rolled out Apollo GraphQL client infrastructure — generated types plus client links for auth, caching and batching.',
    },
  },

  remitlySenior: {
    company: 'Remitly Israel (formerly Rewire)',
    blurb: '',
    role: 'Senior Software Engineer',
    location: 'Tel Aviv',
    dates: 'Jun 2020 – Dec 2022',
    bullets: {
      reactNative:
        'Led the migration of the core product from an AngularJS/React web app to React Native, carrying the company into its mobile-first era.',
      xstate:
        'Designed an XState-based orchestration engine modeling financial flows — send money, deposit, re-authentication — with over-the-air business-logic updates: no redeploys, no app-store queue.',
    },
  },

  wix: {
    company: 'Wix.com',
    blurb: '',
    role: 'Software Engineer',
    location: 'Be’er Sheva / Tel Aviv',
    dates: 'Feb 2017 – Nov 2019',
    bullets: {
      modernization:
        'Frontend architecture and modernization across Contacts, Forms, Editor and Bookings, through the company-wide AngularJS → React/MobX migration.',
      forms:
        'Tech lead on Wix Forms: designed the first first-party app on the Editor platform SDK; its patterns became the template for the first-party apps that followed.',
      auth:
        'Extracted and externalized the Editor’s monolithic authentication — foundational code under every editor-built site, and still one of my proudest pieces of surgery.',
    },
  },

  lab: {
    company: 'Yeger-Lotem Lab, Ben-Gurion University',
    blurb: '',
    role: 'Full-stack Developer (part-time)',
    location: 'Be’er Sheva',
    dates: 'Feb 2015 – Feb 2017',
    bullets: {
      sole:
        'Sole engineer for the lab’s software: open-source visualization tools for protein-interaction networks (D3, Cytoscape.js) over Python/Flask/Celery APIs.',
      pub:
        'Co-author: “TissueNet 2: a quantitative view of protein interactions across human tissues”, Nucleic Acids Research, 2016.',
    },
  },
};

export const education = {
  degree: 'BSc, Computer Science & Bioinformatics',
  school: 'Ben-Gurion University of the Negev',
  dates: '2013 – 2017',
};

// Skill groups; variants compose from these (or override entirely).
export const skills = {
  languages:
    'TypeScript & JavaScript (native tongue) · Python · Swift, Kotlin, Objective-C (productive; agents cover the accent)',
  client:
    'React · React Native · Expo / EAS / Nitro Modules · XState · Apollo GraphQL · Tailwind · Reanimated · Svelte · Angular',
  backendInfra:
    'Node · Bun · GitHub Actions · GitLab CI · Terraform · Pulumi · AWS · Kubernetes + Helm',
  ai:
    'Claude Code · Codex · Cursor · multi-agent loops (Ralph, software-factory setups) · MCP & skill authoring · context management that respects the window',
};
