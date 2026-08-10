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
node build.mjs    # → dist/*.pdf   (also: npm run build, or make)
```

Needs Node ≥ 18 and Chromium (`CHROME_PATH`, or a common install location —
see `chromium()` in `build.mjs`). The build fails if any variant spills past
one A4 page.

## How it works

- `content/` — every fact exactly once, in Markdown: frontmatter for header
  facts, bullets tagged with `{#id}` anchors, backticks for tech chips
- `src/variants.mjs` — what each variant selects and emphasizes
- `src/components/CV.jsx` — the layouts, rendered with `react-dom/server`
- `src/themes/` — a shared skeleton plus one CSS file per theme
- `.github/workflows/` — PR pushes get PDFs attached as a comment;
  `master` pushes get a release

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
  rows address these via `stackRows` in `src/variants.mjs`.
- Backticks in any bullet render as tech chips. The build fails loudly if
  a variant references a bullet, intro or skills key that does not exist,
  or a date that does not parse.

Adding a variant means: an entry in `src/variants.mjs`, an `intro.md`
block, and (for a new look) a theme CSS file, a `THEME_FONTS` row in
`src/lib/fonts.mjs`, and a layout branch in `src/components/CV.jsx`.
Company artwork drops into `assets/logos/<slug>.svg` and lights up via
`src/lib/logos.mjs`.
