---
id: remitlyStaff
company: Remitly
blurb: global remittances (acquired Rewire in 2022)
role: Staff Software Engineer
location: Tel Aviv
dates: Dec 2022 – Feb 2026
stack: TypeScript, Apollo GraphQL, MMKV, i18next, Lokalise
summary: Client infrastructure lead for Circle, Rewire and Remitly apps; the last two years leaning hard on LLMs
---

- Lead engineer of the Client Infrastructure team: technical planning and
  cross-team initiatives across roughly five teams and three products
  (~10M monthly users), plus creating and maintaining the app infrastructure
  itself, such as the `Apollo GraphQL` layer with generated types and an
  offline-first storage engine on `MMKV`. {#lead}

- Designed Lokey, the localization service that took the apps from bundled
  translations to dynamic ones, with hotfixes scoped to app versions in
  production (a translation fix used to mean a full release). Changing a
  translation became editing a string: the PR automation updates `Lokalise`,
  opens a translation job and notifies the translators. {#l10n}

- Migrated tens of thousands of UI strings from English-as-key to semantic
  keys like `header.title.text` with an LLM service and review UI I built: it
  gathers context around each string, suggests names, a product person
  approves, and one click opens a PR with the changes and a non-destructive
  key migration. A tedious, error-prone process done in a week. {#semanticKeys}

