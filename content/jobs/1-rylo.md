---
id: rylo
company: Rylo
blurb:  Communication platform for the Deaf and hard-of-hearing
role: Software Engineer
location: Tel Aviv
dates: Feb 2026 – Present
summary: Building out the client platform, release engineering and complex product flows of a ground-up app rewrite.
---

- Was part of a four engineer task force working on a ground-up rewrite of the company's client apps:
  A `React Native` backbone, with native iOS (`Swift`) and Android (`Kotlin`) components (using Expo's `CNG` and `expo/ui`) where performance was critical. Shipped in
  three months, working in a prototype-first/spec-later approach, with coding agents handling much of the
  implementation and review in parallel. {#rewrite}

- Built the client platform for the rewrite from scratch: the apps monorepo (`bun workspaces`),
  a design system with automated `Figma` sync, and all client
  CI/CD. {#platform}

- Rebuilt the mobile release process: an automated pipeline with a web UI for
  cutting release branches and shipping builds, and an in-house
  app-distribution service that replaced `Firebase App
  Distribution`. {#release}

- Owned the onboarding flow in the rebuilt app, one of its most complex flows; modeled it as
  an explicit `XState` state machine to keep every branch
  testable, as well as a small, throw-away testing harness that ran the original onboarding flow on a simulator, chaos-monkey-style, and compared the results with the new architecture to make sure the baseline is solid. {#onboarding}

- Restructured the team's shared coding-agent setup after measuring ~70k
  tokens of always-loaded context per session. Replaced it with small,
  focused skills that load on demand, are progressively disclosed, with code as the source of
  truth. {#agentSkills}
