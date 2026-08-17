# Eugene Lerman - Curriculum Vitae

<p align="center">
  <a href="https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman.pdf">
    <img src="docs/cv-preview.png" alt="Eugene Lerman, Senior Software Engineer" width="800">
  </a>
</p>

## Download

| Variant | For | |
| --- | --- | --- |
| Default | humans, referrals | [PDF](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman.pdf) |
| Shell | the CV as a terminal session | [PDF](https://github.com/airbugg/curriculum-vitae/releases/latest/download/eugene-lerman-shell.pdf) |

Every push to `master` cuts a [release](https://github.com/airbugg/curriculum-vitae/releases/latest). PDFs are built, not committed.

## Edit

Each fact lives in exactly one file. Click to edit in the browser; a commit to `master` rebuilds and re-releases both PDFs.

| File | Holds |
| --- | --- |
| [`person.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/person.md) | name, contact, languages |
| [`intro.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/intro.md) | opening paragraph, per variant |
| [`jobs/1-rylo.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/1-rylo.md) | Rylo |
| [`jobs/2-remitly-staff.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/2-remitly-staff.md) | Remitly |
| [`jobs/3-rewire.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/3-rewire.md) | Rewire |
| [`jobs/4-wix.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/4-wix.md) | Wix |
| [`jobs/5-lab.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/jobs/5-lab.md) | the lab job, kept but unused |
| [`education.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/education.md) | degree, school, dates |
| [`publications.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/publications.md) | the paper |
| [`skills.md`](https://github.com/airbugg/curriculum-vitae/edit/master/content/skills.md) | the STACK chips |

Job frontmatter wants `id`, `company`, `role`, `location`, `dates`. Bullets end in a `{#id}` anchor, backticks become tech chips, and the build fails by name if an edit breaks a reference.

## Build

```sh
npm install
npm run build   # dist/*.pdf
npm run check   # types
```

Node 22.18+ and Chromium (`CHROME_PATH` if it is somewhere unusual). A variant that runs past one A4 page fails the build.

## Layout

| | |
| --- | --- |
| `content/` | every fact, once |
| `src/variants.ts` | what each variant picks |
| `src/components/` | `grid/` and `terminal/` layouts, `shared/` primitives |
| `src/themes/` | one CSS file per theme |
| `src/lib/` | content loaders, dates, fonts, logos |
| `scripts/` | preview banner, release notes, commit lint |
| `DESIGN.md` | why it looks the way it does |

Commits follow [Conventional Commits](https://www.conventionalcommits.org); a hook and CI both check. Versions and release notes come from them.
