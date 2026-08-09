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
| Platform | infra / DevEx roles | [eugene-lerman-platform.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-platform.pdf) |
| Parser | ATS / job boards | [eugene-lerman-ats.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-ats.pdf) |
| Classic | the previous flagship look | [eugene-lerman-classic.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-classic.pdf) |
| Reimagine 1 · Broadsheet | brutalist poster statement | [eugene-lerman-reimagine-1.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-reimagine-1.pdf) |
| Reimagine 2 · Ledger | career drawn to scale | [eugene-lerman-reimagine-2.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-reimagine-2.pdf) |

The Full Stack, AI-Native and Unified cuts folded back into the Flagship —
one generalist CV instead of three targeted ones. Their exact configurations
live in git history if a targeted variant is ever needed again.

PDFs are build artifacts, not source — they aren't committed here.

## Build it yourself

```sh
npm install
node build.mjs    # → dist/*.pdf
```

Needs Node ≥ 18 and Chromium (`CHROME_PATH`, or a common install location —
see `chromium()` in `build.mjs`). The build fails if any variant spills past
one A4 page.

## How it works

- `content/` — every fact exactly once, in Markdown: frontmatter for header
  facts, bullets tagged with `{#id}` anchors, backticks for tech chips
- `src/variants.mjs` — what each variant selects and emphasizes
- `src/components/CV.jsx` — the layout, rendered with `react-dom/server`
- `src/themes/` — a shared skeleton plus one small CSS file per variant
- `.github/workflows/` — PR pushes get PDFs attached as a comment;
  `master` pushes get a release

Editing a bullet once updates every variant. The original LaTeX toolchain
lives on in git history.
