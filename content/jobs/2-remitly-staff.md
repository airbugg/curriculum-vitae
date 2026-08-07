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

- Designed Lokey, the localization service that took the apps from bundled
  translations to dynamic ones, with hotfixes scoped to specific app versions
  in production (previously a translation fix required a full release).
  Changing a translation became editing a string in the source code: the PR
  automation updates `Lokalise`, opens a translation job and notifies the
  translators. {#l10n}

- Migrated tens of thousands of UI strings from English-as-key to semantic
  keys like `header.title.text` with an LLM service and review UI I built:
  point it at a codebase, it gathers context around each string and suggests
  names; a product person approves, and one click opens a PR with the code
  changes and a non-destructive key migration. A tedious, error-prone process
  done in a week. {#semanticKeys}

- Built the shared `Apollo GraphQL` client infrastructure: generated types
  and client links for auth, caching and batching. {#apollo}
