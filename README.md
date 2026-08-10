# curriculum-vitae

My CV, built like software: the content lives in Markdown, React components
lay it out, headless Chromium prints it, and CI ships the PDFs. The design
is a web-native reincarnation of the LaTeX (awesome-cv) CV I hand-crafted a
decade ago — same `{ EUGENE : LERMAN }` braces, same emerald, fewer regrets.

## Get the PDFs

**[→ Latest release](https://github.com/airbugg/curriculum-vitae/releases/latest)** — every push to `master` publishes fresh PDFs.

Stable direct links:

| Variant | For | Download |
| --- | --- | --- |
| Flagship (modernist grid) | humans, referrals — the generalist CV | [eugene-lerman.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman.pdf) |
| Shell | the CV as a terminal session | [eugene-lerman-shell.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-shell.pdf) |

Every experiment that led here — the design-research prototypes, the two
reimaginings, the targeted Platform/Parser/Classic cuts — lives in git
history and `DESIGN.md` if one is ever needed again.

PDFs are build artifacts, not source — they aren't committed here.

## Build it yourself

```sh
npm install
npm run build     # → dist/*.pdf   (also: node build.ts, or make)
npm run check     # tsc --noEmit
```

Needs Node ≥ 22.18 (the build runs TypeScript directly via native type
stripping) and Chromium (`CHROME_PATH`, or a common install location — see
`chromium()` in `build.ts`). The build validates every cross-file content
reference, then fails if any variant spills past one A4 page.

## How it works

- `content/` — every fact exactly once, in Markdown: frontmatter for header
  facts, bullets tagged with `{#id}` anchors, backticks for tech chips
- `src/types.ts` — the content and variant schema, typed
- `src/lib/` — loaders and domain logic: `content.ts` parses the Markdown,
  `dates.ts` does tenure arithmetic, `fonts.ts`/`logos.ts` embed assets
- `src/variants.ts` — what each variant selects and emphasizes
- `src/components/` — the React layouts, rendered with `react-dom/server`:
  `grid/` (the Flagship), `terminal/` (the Shell), `shared/` primitives
- `src/themes/` — a shared skeleton plus one CSS file per theme
- `.github/workflows/` — PR pushes get PDFs attached as a comment;
  `master` pushes get a release, both gated on `tsc --noEmit`

Editing a bullet once updates every variant. The original LaTeX toolchain
lives on in git history.

## Authoring

The content contract, for future me:

- `content/jobs/*.md` — one file per workplace. Frontmatter needs `id`,
  `company`, `role`, `location`, `dates`; `blurb` and `summary` are
  optional. Dates are `Mon YYYY – Mon YYYY` (or `Present`) with a spaced
  en dash; tenure is derived at build time. The body is bullets only, each
  ending in a `{#id}` anchor. Bullets no variant selects are fine — they
  are inventory, not dead weight (so is `5-lab.md`).
- `content/intro.md` — one `## key` paragraph per variant; variants read
  `intros.<key>`.
- `content/skills.md` — one `## key` line per group; the flagship's STACK
  rows address these via `stackRows` in `src/variants.ts`.
- Backticks in any bullet render as tech chips. The build fails loudly if
  a variant references a bullet, intro or skills key that does not exist,
  or a date that does not parse.

Adding a variant means: an entry in `src/variants.ts`, an `intro.md`
block, and (for a new look) a theme CSS file, a `THEME_FONTS` row in
`src/lib/fonts.ts`, and a layout under `src/components/` dispatched from
`CVPage.tsx`.
Company artwork drops into `assets/logos/<slug>.svg` and lights up via
`src/lib/logos.ts`.
