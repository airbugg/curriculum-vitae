---
id: rewire
company: Rewire
blurb: cross-border banking for migrant workers
role: Senior Software Engineer
location: Tel Aviv
dates: Jun 2020 – Dec 2022
summary: Core product work through the company's shift from a web app to mobile-first.
---

- Led the migration of the core product from a mess of an `AngularJS`/`React`
  web app to `React Native`, without freezing feature work: a native shell
  hosted the legacy app in a webview, with a two-way `postMessage` bridge so
  each side could drive the other (navigation, modals, the shared `Redux`
  state). Features moved piecemeal, invisible to users; built that layer with
  two other engineers. {#reactNative}

- Designed an `XState` orchestration engine for financial flows (send money,
  deposit, re-auth) with over-the-air business-logic updates: changes reached
  users without a release. {#xstate}

- Built the second-auth layer for sensitive actions: any flow could be wrapped
  in a gate asking for Face ID, a fingerprint or a code, with the backend
  refusing the action if the gate was somehow bypassed. {#secondAuth}

- Moved all client CI/CD from `GitLab` to `GitHub Actions`, cutting pipeline
  runtimes roughly in half. The cutover took one weekend; teams started
  Monday on the new system with nothing missing. {#ci}

- Designed a client/server workflow engine for financial flows (send money,
  deposit, re-auth): `XState` machine definitions stored server-side and
  served over an API I designed, so business-logic changes reached tens of
  thousands of production users without a release. {#workflowEngine}
