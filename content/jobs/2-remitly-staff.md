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
  migration. Reviewers accepted roughly 80% of suggestions unchanged. A
  tedious, error-prone process done in a week. {#llmPipeline}

- Set client technical direction in writing: the design docs behind Lokey,
  the `GraphQL` client layer and the semantic-keys migration were each built
  on by teams beyond my own. Ran technical interviews regularly, and
  mentored engineers through reviews and onboarding. {#direction}

- Led the Client Infrastructure team behind three products and ~10M monthly
  users: drove cross-team initiatives across roughly five teams, and built
  and ran the shared app infrastructure, the `Apollo GraphQL` layer with
  generated types and an offline-first storage engine on `MMKV`. {#leadStaff}

- Designed and shipped Lokey, the localization service behind the apps:
  dynamic translation delivery with hotfixes scoped to app versions in
  production, and PR automation that updates `Lokalise`, opens translation
  jobs and notifies the translators. A translation fix used to mean a full
  release; it became editing a string. {#l10nService}
