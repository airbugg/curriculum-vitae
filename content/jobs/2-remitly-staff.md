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


- Built an LLM pipeline with human-in-the-loop review that migrated tens of
  thousands of UI strings to semantic keys like `header.title.text`: it
  gathers context around each string, drafts names through the company's
  model gateway, and validates placeholders and key collisions before a
  human sees anything. One approving click opens a PR with a non-destructive
  migration; reviewers accepted roughly 80% of suggestions unchanged. A
  tedious, error-prone process done in a week. {#llmPipeline}

- Designed and shipped Lokey, the localization service behind the apps:
  dynamic translation delivery with hotfixes scoped to app versions in
  production, and PR automation that updates `Lokalise`, opens translation
  jobs and notifies the translators. A translation fix used to mean a full
  release; it became editing a string. {#l10nService}
