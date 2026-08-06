# circum vitae

Four one-page CV variants built from a single source of facts:
Markdown content → React components → CSS themes → headless Chromium → PDF.

| PDF | Variant | For |
| --- | --- | --- |
| [`eugene-lerman.pdf`](dist/eugene-lerman.pdf) | The Looker | humans, referrals, founders |
| [`eugene-lerman-platform.pdf`](dist/eugene-lerman-platform.pdf) | The Platform Engineer | staff-IC / client-infra / DevEx roles |
| [`eugene-lerman-ai-native.pdf`](dist/eugene-lerman-ai-native.pdf) | The AI-Native Engineer | AI-first companies |
| [`eugene-lerman-ats.pdf`](dist/eugene-lerman-ats.pdf) | The Parser | job boards; machines first |

## Build

```sh
npm install
make            # node build.mjs → dist/*.pdf
```

Requires Node ≥ 18 and a Chromium binary (`CHROME_PATH`, `/opt/pw-browsers`,
or common system locations — see `chromium()` in `build.mjs`). The build
fails if any variant spills past one page. CI rebuilds the PDFs on every PR
push and links them in a PR comment.

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

The previous LaTeX (awesome-cv) toolchain lives on in git history.
