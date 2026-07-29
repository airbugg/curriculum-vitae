---
id: remitlyStaff
company: Remitly Israel (formerly Rewire)
blurb: cross-border banking & remittances
role: Staff Software Engineer · Client Infrastructure
location: Tel Aviv
dates: Dec 2022 – Feb 2026
---

- Lead engineer of the Client Infrastructure team: technical planning and
  cross-team initiatives across roughly ten teams and three products
  (~10M monthly users). {#lead}

- Designed the localization platform: translations fetched dynamically, with
  hotfixes scoped to specific app versions in production (previously a
  translation fix required a full release), and a CI pipeline that extracts
  changed strings from each PR and files translator tasks automatically.
  Translations stopped blocking merges. {#l10n}

- Migrated tens of thousands of UI strings to semantic keys with an LLM
  service I built: model-suggested names, human approval in a small review
  UI, changes applied as auto-generated PRs. The code changes themselves took
  hours. {#semanticKeys}

- Moved all client CI/CD from `GitLab` to `GitHub Actions`, cutting pipeline
  runtimes roughly in half. The cutover took one weekend; teams started
  Monday on the new system with nothing missing. {#ci}

- Built the shared `Apollo GraphQL` client infrastructure: generated types
  and client links for auth, caching and batching. {#apollo}
