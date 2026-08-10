---
id: rylo
company: Rylo
blurb:  Communication platform for the Deaf and hard-of-hearing
role: Software Engineer
location: Tel Aviv
dates: Feb 2026 – Present
stack: React Native, Expo, Swift, Kotlin, Bun, XState
summary: Building out the client platform, release engineering and complex product flows of a ground-up app rewrite; most of it shipped through coding agents.
---

- One of a four engineer task force on a ground-up rewrite of the company's
  client apps: a `React Native` backbone with native `Swift` and `Kotlin`
  components (via Expo `CNG` and `expo/ui`) where performance was critical.
  Shipped in three months, prototype-first and spec-later, with coding agents
  handling much of the implementation and review. {#rewrite}

- Built the client platform for the rewrite from scratch: the apps monorepo
  (`bun workspaces`), a design system with automated `Figma` sync, the
  internal docs site, and all client CI/CD. {#platform}

- Rebuilt the release process: a pipeline with a web UI for cutting release
  branches and shipping builds, and an in-house replacement for
  `Firebase App Distribution`. {#release}

- Owned the onboarding flow in the rebuilt app, one of its most complex;
  modeled it as an explicit `XState` machine to keep every branch testable,
  plus a throw-away harness that ran the original flow on a simulator,
  chaos-monkey-style, and compared results against the new architecture to
  make sure the baseline was solid. {#onboarding}

- Restructured the team's shared coding-agent setup after measuring ~70k
  tokens of always-loaded context per session; replaced it with a handful of
  small skills that load on demand. {#agentSkills}
