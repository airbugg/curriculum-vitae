---
id: remitlyStaff
company: Remitly Israel (formerly Rewire)
blurb: cross-border banking & remittances
role: Staff Software Engineer · Client Infrastructure
location: Tel Aviv
dates: Dec 2022 – Feb 2026
---

- Lead engineer of the Client Infrastructure team: technical planning and
  cross-team initiatives spanning ~10 teams and three products
  (~10M MAUs). {#lead}

- Designed the localization platform: translations delivered dynamically with
  version-scoped production hotfixes (previously: cut a release), plus a
  diff-driven CI pipeline that extracts changed strings, files translator
  tasks, and stops blocking merges. {#l10n}

- Migrated tens of thousands of strings to semantic keys with an AI service I
  built — model-suggested names, human-approved in a purpose-built UI, applied
  as auto-generated PRs. Two weeks of talking to product; hours of actual
  migration. {#semanticKeys}

- Moved all client CI/CD from `GitLab` to `GitHub Actions` across 4–6 teams:
  runtimes down 50%+, cutover done in a weekend. Monday passed without
  comment, which was the goal. {#ci}

- Rolled out `Apollo GraphQL` client infrastructure — generated types plus
  client links for auth, caching and batching. {#apollo}
