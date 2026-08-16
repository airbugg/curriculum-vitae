# curriculum-vitae

<p align="center">
  <a href="https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman.pdf">
    <img src="docs/cv-preview.png" alt="Eugene Lerman — CV preview" width="800">
  </a>
</p>

My CV, built like software: the content lives in Markdown, React components
lay it out, headless Chromium prints it, and CI ships the PDFs. The design
is a web-native reincarnation of the LaTeX (awesome-cv) CV I hand-crafted a
decade ago — same `{ EUGENE : LERMAN }` braces, same emerald, fewer regrets.

## Get the PDFs

**[→ Latest release](https://github.com/airbugg/curriculum-vitae/releases/latest)** — every push to `master` publishes fresh PDFs.

| Variant | For | Download |
| --- | --- | --- |
| Flagship (modernist grid) | humans, referrals — the generalist CV | [eugene-lerman.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman.pdf) |
| Shell | the CV as a terminal session | [eugene-lerman-shell.pdf](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-shell.pdf) |

PDFs are build artifacts, not source — they aren't committed here.

## Edit the CV

Every fact lives in exactly one of these files. Click to edit in GitHub's
browser editor; a commit to `master` rebuilds and re-releases both PDFs.

| File | Holds |
| --- | --- |
| [`person.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/person.md) | name, contact info, languages |
| [`intro.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/intro.md) | the opening paragraph, per variant |
| [`jobs/1-rylo.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/1-rylo.md) | Rylo |
| [`jobs/2-remitly-staff.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/2-remitly-staff.md) | Remitly |
| [`jobs/3-rewire.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/3-rewire.md) | Rewire |
| [`jobs/4-wix.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/4-wix.md) | Wix |
| [`jobs/5-lab.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/5-lab.md) | the Yeger-Lotem lab (unused inventory) |
| [`education.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/education.md) | degree, school, dates |
| [`publications.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/publications.md) | the paper |
| [`skills.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/skills.md) | the flagship's STACK chip groups |

A job's frontmatter needs `id`, `company`, `role`, `location`, `dates`
(`Mon YYYY – Mon YYYY`, en dash, or `Present`); the body is bullets only,
each ending in a `{#id}` anchor. Backticks anywhere become tech chips. The
build fails loudly, naming the file, if an edit breaks a reference.

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

- `content/` — every fact exactly once, in Markdown (see the table above)
- `src/types.ts` — the content and variant schema, typed
- `src/lib/` — loaders and domain logic: `content.ts` parses the Markdown,
  `dates.ts` does tenure arithmetic, `fonts.ts`/`logos.ts` embed assets
- `src/variants.ts` — what each variant selects and emphasizes
- `src/components/` — the React layouts, rendered with `react-dom/server`:
  `grid/` (the Flagship), `terminal/` (the Shell), `shared/` primitives
- `src/themes/` — a shared skeleton plus one CSS file per theme
- `.github/workflows/` — PR pushes get PDFs attached as a comment; `master`
  pushes get a release and a refreshed preview banner above, both gated on
  `tsc --noEmit`
- `DESIGN.md` — the full design history: prototypes, reimaginings, why
  things ended up the way they did
