# circum vitae

Five one-page CV variants built from a single source of facts:
Markdown content → React components → CSS themes → headless Chromium → PDF.

| PDF | Variant | For |
| --- | --- | --- |
| [`eugene-lerman.pdf`](dist/eugene-lerman.pdf) | The Looker | humans, referrals, founders |
| [`eugene-lerman-platform.pdf`](dist/eugene-lerman-platform.pdf) | The Platform Engineer | staff-IC / client-infra / DevEx roles |
| [`eugene-lerman-generalist.pdf`](dist/eugene-lerman-generalist.pdf) | The Startup Generalist | early-stage, many-hats roles |
| [`eugene-lerman-ai-native.pdf`](dist/eugene-lerman-ai-native.pdf) | The AI-Native Engineer | AI-first companies |
| [`eugene-lerman-ats.pdf`](dist/eugene-lerman-ats.pdf) | The Parser | job boards; machines first |

## Build

```sh
npm install
make            # or: node build.mjs
```

Requires Node ≥ 18 and a Chromium binary (looked up under `/opt/pw-browsers`,
adjust `chromium()` in `build.mjs` for your machine). The build fails if any
variant spills past one page.

## Layout

- `content/` — every fact, once, in editable Markdown: frontmatter for the
  header facts, list items with `{#id}` anchors for bullets, backticks for
  tech chips
- `src/variants.mjs` — what each variant selects, emphasizes, and says
- `src/components/CV.jsx` — React components; rendered with
  `react-dom/server`, bundled by esbuild, printed by Chromium
- `src/themes/` — `base.css` skeleton (incl. the `{ EUGENE : LERMAN }`
  braces identity) + one CSS file per variant
- `dist/` — the PDFs

The previous LaTeX (awesome-cv) toolchain lives on in git history and the
`resume/` directory.
