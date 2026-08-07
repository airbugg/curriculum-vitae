---
id: remitlyStaff
company: Remitly
blurb: global remittances (acquired Rewire in 2022)
role: Staff Software Engineer
location: Tel Aviv
dates: Dec 2022 – Feb 2026
summary: Client infrastructure lead for Circle, Rewire and Remitly apps
---

- Lead engineer of the Client Infrastructure team: technical planning and
  cross-team initiatives across roughly five teams and three products
  (~10M monthly users). {#lead}

- Designed the localization platform: translations fetched dynamically, with
  hotfixes scoped to specific app versions in production (previously a
  translation fix required a full release), and a CI pipeline that extracts
  changed strings straight from the source code and files translator tasks automatically. {#l10n}

- Migrated tens of thousands of UI strings to semantic keys with an LLM
  service I built: model-suggested names, human approval in a small review
  UI, changes applied as auto-generated PRs. The code changes themselves took
  hours. {#semanticKeys}

- Built the shared `Apollo GraphQL` client infrastructure: generated types
  and client links for auth, caching and batching. {#apollo}
