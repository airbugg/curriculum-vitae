# circum vitae

Five one-page CV variants built from a single source of facts, rendered
HTML → CSS → headless Chromium → PDF.

| PDF | Variant | For |
| --- | --- | --- |
| [`eugene-lerman.pdf`](dist/eugene-lerman.pdf) | The Looker | humans, referrals, founders |
| [`eugene-lerman-platform.pdf`](dist/eugene-lerman-platform.pdf) | The Platform Engineer | staff-IC / client-infra / DevEx roles |
| [`eugene-lerman-generalist.pdf`](dist/eugene-lerman-generalist.pdf) | The Startup Generalist | early-stage, many-hats roles |
| [`eugene-lerman-ai-native.pdf`](dist/eugene-lerman-ai-native.pdf) | The AI-Native Engineer | AI-first companies |
| [`eugene-lerman-ats.pdf`](dist/eugene-lerman-ats.pdf) | The Parser | job boards; machines first |

## Build

```sh
make            # or: node build.mjs
```

Requires Node ≥ 18 and a Chromium binary (looked up under `/opt/pw-browsers`,
adjust `build.mjs` for your machine). The build fails if any variant spills
past one page.

## Layout

- `src/content.mjs` — every fact, once
- `src/variants.mjs` — what each variant selects, emphasizes, and says
- `src/render.mjs` — HTML assembly, fonts embedded from `fonts/`
- `src/themes/` — `base.css` skeleton + one CSS file per variant
- `dist/` — the PDFs

The previous LaTeX (awesome-cv) toolchain lives on in git history and the
`resume/` directory.
