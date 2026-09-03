# CV Design — decisions in force

This file holds the design rationale that still binds the code: the
principles the layouts are built on, the owner decrees in force, and the
measured traps that must not be relearned. It is deliberately short.

The full trail that produced it — five prototype generations, the
placement studies, the divider loops, every measured rejection — lives in
this file's git history (`git log --follow -p DESIGN.md`) and in the PR
threads. Nothing there binds the present unless it is restated here.

## The build

Four variants build from one content source (`content/`, every fact
exactly once):

- `eugene-lerman` — the default: modernist grid, dense rhythm.
- `eugene-lerman-fullstack` — the screening cut: same grid, backend-first
  bullet selection, `{ TECH }` + `{ BACKGROUND }` bottom zone.
- `eugene-lerman-fullstack-icons` — the screening cut with brand marks on
  the tech chips. Builds and ships in PR artifacts, but is not attached
  to releases: `.releaserc.json` lists three PDFs, pending the owner's
  verdict on the look.
- `eugene-lerman-shell` — the whole CV as one terminal session.

Each must fit one A4 page; the build fails otherwise. The operational
rules (byte-compare proofs, NBSP discipline, text-layer honesty, the
TypeScript constraints) live in CLAUDE.md, which every session loads.

## Principles the grid is built on

Extracted from the literature during the first research round and still
the yardstick for any layout change (`grid.css` points here):

- **Bringhurst** (_The Elements of Typographic Style_): typographic
  colour — mixing faces means matching weight, width and rhythm, so keep
  few voices per line; restraint — "the more valuable the ornament, the
  more sparingly it should be used."
- **Tschichold**: white space is an active compositional element, not
  leftover; organise on a single honest structural axis.
- **Müller-Brockmann** (_Grid Systems_): a grid organises dense
  information "meaningfully, logically, consistently"; a strong
  asymmetric column structure (a data column against a content column)
  beats per-line right-flushing; colour on a grid is functional, a
  signal, never decorative.
- **Hochuli** (_Detail in Typography_): legibility lives in the
  micro-detail — word-spacing, letter-spacing, measure.
- **Gestalt proximity and common region** (NN/g): space, not lines or
  boxes, is the cheapest and strongest grouping device; a shared column
  groups even spaced items, so in dense layouts a column replaces
  decoration.
- **Editorial practice**: hierarchy comes from a few big quiet moments
  against small dense text, not from added elements.

## The thesis

The owner settled the CV's framing: not a client engineer, not a
full-stack engineer — an engineer who takes up whatever role the product
needs. One CV instead of a variant family; the AI story is woven into
intro clause, summaries and bullets rather than sectioned (a how-I-work
section costs ~14mm and positions instead of evidencing).

## The grid's current form

One metadata-label voice for the whole page: letterspaced micro-caps
(caps at small sizes need 5–12% extra tracking, per Butterick). The meta
column reads as two clusters — identity (bold company, italic blurb) and
data (micro-caps location, mono dates) — separated by air, per Gestalt
proximity, not by separators. Durations print in parentheses after the
dates. Interpuncts are on a diet: they survive only where they do real
work (header contact separators, chip separators).

The bottom zone is the Manifest ledger: `{ BACKGROUND }` rows on the
exact grid module EXPERIENCE uses, keys in the meta column where company
and dates live, facts as single content lines. The default variant's
STACK row subdivides in place — three ledger lines with fixed-width muted
sub-labels sharing a left edge, chips in boxless deep-emerald mono, lists
in `content/skills.md`.

The screening cut moves the stack out: a curated identity trio under the
contact line ("typescripter · pythonista · agentic looper", the
`stackCore` key), then `{ TECH }` and `{ BACKGROUND }` as sibling
sections; subtler dividers were tried and rejected by measurement. Chips
print in body ink with muted separators there (`g-skink`), so the zone's
teal lives only in the marks; the publication nests under education (the
swept arrow, a tighter pitch); the languages row is UNDERSTANDS, in the
owner's voice.

Company and university marks are small glyphs before real, visible,
selectable text — never instead of it (the wordmark experiment died
twice: hidden-text scanners flag invisible type, and stream-order
extractors detach absolutely-positioned text; CLAUDE.md carries the ban).

## The Shell doctrine

The whole CV as one terminal window — hairline border, muted traffic
lights, `eugene@tlv:~/cv` — structured as a session: `cat README.md` for
the intro, `ls -t experience/` then `glow` per job, `jq . education.json`
for the background, a bare prompt and resting cursor closing the page.
Fidelity rules: `›` for `❯`, zsh verb highlighting, and glow/jq justify
every color the output wears. The fiction mirrors repo truth — the jobs
really are markdown files with front matter. The window flexes to the
page bottom so the session ends the way a real terminal does, waiting.

## Decisions in force (owner decrees unless noted)

- **Content parity** between the default and the shell: same bullet set,
  same summaries; the shell's look does the calming, not cuts. Structural
  home: the shared `SECTIONS` constant in `src/variants.ts`.
- **Parity exemption** for the full-stack cut alone (owner, 2026-09-01):
  it selects its own bullets, shared by its two files through the
  `FULLSTACK` base so the cut cannot fork.
- **One flagship**: no meta-column chips, no how-I-work section, the
  STACK row subdivided from `content/skills.md`. The k3s off-hours line
  appears nowhere on the canonical (flagged to the owner, unresolved);
  `offHours` renders only in the shell's background block.
- **Full four-digit years everywhere** — shortened years were invisible
  to parsers.
- **Claim ceilings for the full-stack cut** (owner-confirmed in a
  structured interview; nothing on the page may imply depth beyond
  these): the Rewire XState engine is the client/server workflow engine
  it was — definitions stored server-side, served over an API the owner
  designed; the semantic-keys migration is an LLM pipeline with
  human-in-the-loop review, automated placeholder and collision
  validation, and a roughly 80% unchanged-acceptance rate; second-auth
  stays client-side because the owner wrote only the client half.
- **Claim ceilings for the staff cut** (owner-confirmed, 2026-09-03):
  the headline may say Staff Software Engineer because the owner held
  that exact title at Remitly for over three years; per-role titles stay
  exact. Written design docs with cross-team adoption are claimable for
  Lokey, the GraphQL client layer and the semantic-keys migration.
  Interviewing is claimable as a regular Remitly duty (tens, not
  hundreds). Mentorship was real but informal: coaching through reviews
  and onboarding, never counted promotions. The coding-agent setup is
  the owner's own that others opted into, so it is never framed as
  setting team practice.
- **The public cut** omits phone and email (the direct channels) and
  keeps the profile links, so a name/contact pairing is never posted in
  the open; everything else is the default cut, shared structurally.
- **Marks provenance**: official or campus-vetted sources only, recorded
  in-repo (`src/lib/logos.ts`, `assets/techicons/PROVENANCE.md`); the
  AWS icon is CC-BY-ND and is used verbatim. simple-icons is pinned
  exact because brand geometry moves even in minor releases.
- **The release list is `.releaserc.json`** — not every built variant is
  released, and README's download table must match it.
- **Text-layer machinery applies to every variant** — the PDF must
  extract as the text it shows.

## Release machinery — the load-bearing settings

semantic-release cuts semver from Conventional Commits; config in
`.releaserc.json`. Three settings are non-obvious and each has bitten or
nearly bitten:

1. `releaseRules` must lead with `{breaking: true, release: 'major'}`.
   User rules are evaluated before the built-in defaults, so without it a
   `refactor!` or a `BREAKING CHANGE:` footer on anything but a feat
   lands as a patch.
2. The `releaseRules` exist because the stock preset does not release on
   `docs`/`chore`/`refactor` at all — and on this repo a content edit is
   usually exactly that, so without them a CV change would produce no new
   PDF.
3. `conventional-changelog-conventionalcommits` is pinned `^8` because
   semantic-release bundles `conventional-changelog-writer@8`; the
   preset's v10 line targets writer v9 and, paired with v8, silently
   generates release notes containing nothing but the version header.
   No error message. Do not "fix" this pin.

The release job fails if no `v*` tag points at HEAD when it finishes:
GitHub's web editor defaults to a non-conventional subject, the
commit-msg hook is client-side, and the commitlint job only runs on pull
requests — without the guard, a browser edit goes green while the
download link quietly keeps serving the old PDF.

Hand-rolled by design (do not replace with libraries): `dates.ts` is a
strict validator for one documented format — date-fns would accept
`Dec 22` as the year 22 AD and render a two-thousand-year tenure that
still fits one page; `pageCount` is a two-line assertion about output
this pipeline itself produces, failing to zero on anything unexpected;
`validate()` checks cross-document references no schema library
expresses. commitlint, by contrast, replaced a hand-rolled implementation
of somebody else's specification — drifting from the spec is the failure
mode there, and the package count is the honest price of conformance.

## Measured traps

Every number here was measured, not recalled.

- **Font subsetting is NOT safe.** Subsetting the faces shifts 0.23% of
  subpixels with a maximum channel delta of 227. Anyone reading "unused
  font bytes" and reaching for `subset-font` should stop here.
- **Puppeteer needs `preferCSSPageSize: true`.** Driving the same binary
  over CDP produces byte-identical PDFs to the `--print-to-pdf` CLI, so
  that migration is safe if a reason appears — but puppeteer's default
  ignores `@page { size: A4 }` and silently emits US Letter, and the
  one-page check passes on Letter.
- **The browser build is in the PDF bytes** (`/Producer Skia/PDF mNNN`),
  and the runner's Chrome auto-updates, so an image refresh can shift the
  pixel-tuned output with no commit in this repo. `.chrome-version` pins
  the major; the gate fails hard on pull requests and warns without
  blocking on the release path (rationale and re-baseline recipe in
  `.github/actions/resolve-chromium`).
- **Chromium print quantization**: print output snaps `position:
  relative` offsets and `vertical-align` to whole CSS px; sub-pixel
  nudges ride on `transform`, which does not snap (also in CLAUDE.md).
- **Silent overwrites travel in families.** The duplicate-`{#id}` bug had
  three siblings (repeated `## key`, duplicate job `id`, repeated
  frontmatter key), each producing a wrong PDF and a green build. Fixing
  one member of a family and not hunting the rest is the lesson; the
  loaders now throw on all of them, naming the file.
