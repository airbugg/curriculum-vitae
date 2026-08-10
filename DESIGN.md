# CV Redesign — Diagnosis, Research, and Three Opposed Prototypes

A ground-up rethink of the one-page A4 CV. The owner found the flagship
(`eugene-lerman`, the "looker" theme) *too busy and crowded* despite several
spacing rounds. The problem is not gap sizes — it is the number of competing
signals per line and the vertical distribution of mass. This document records
the diagnosis with measured evidence, the design principles extracted from the
literature, and three deliberately diametrically-opposed rendered prototypes
that each solve the problem a different way.

All four original variants are untouched and still build to one page. The three
prototypes are added as new entries and build green:

```
✓ eugene-lerman-proto-a.pdf — 1 page  [Prototype A · Radical Reduction]
✓ eugene-lerman-proto-b.pdf — 1 page  [Prototype B · Modernist Grid]
✓ eugene-lerman-proto-c.pdf — 1 page  [Prototype C · Editorial Expressive]
```

---

## 1. Diagnosis — what actually makes the flagship "busy"

Measured on the 150 dpi render of `dist/eugene-lerman.pdf` (1240×1754 px).

### 1a. Too many voices per line (the primary cause)
A single experience-entry header carries **five** distinct type treatments
across two lines:

| Element | Treatment |
|---|---|
| `Rylo` | Source Sans **bold**, near-black |
| `AI communication platform…` | Source Sans light, muted grey |
| `Tel Aviv` | *italic*, emerald |
| `SOFTWARE ENGINEER` | small-caps, emerald-soft |
| `Feb 2026 – Present` | Source Code Pro **mono**, muted |

That is **four typeface voices** (mono caps, sans bold, sans light, accent
italic) and **two accent-coloured elements** before a single bullet is read.
Bringhurst's notion of *typographic colour* explains the fatigue directly: each
voice switch forces the eye to re-tune weight, width, and rhythm.

### 1b. Chip peppering
The tech spans render as filled rounded chips (`.id-braces code`). The first
Rylo bullet alone contains **five** chips (`React Native`, `Swift`, `Kotlin`,
`CNG`, `expo/ui`) inside four lines of prose — a field of little grey-green
boxes that fragments the paragraph into stop-start reading.

### 1c. Competing section-marker systems
Section starts are signalled *three times over*: a `{ E}XPERIENCE` brace pair,
an emerald accent capital, **and** a hairline rule. Three cues doing one job.

### 1d. An axis switch
The header is centred; the body is left-aligned with right-flushed
dates/locations. So the page has a centre axis, a left margin axis, and a right
margin axis — and it *switches* between the first two between header and body.
Gestalt "common region / proximity" reading is disrupted at the very top.

### 1e. Wrong vertical distribution (the owner's scribble)
Ink density by page-third and trailing blank space:

| Region | Flagship | Proto A | Proto B | Proto C |
|---|---|---|---|---|
| Top third ink % | 5.6 | 3.6 | 3.6 | 3.1 |
| Middle third ink % | 6.8 | 6.0 | 5.5 | 6.0 |
| Bottom third ink % | 3.1 | 3.3 | 2.9 | 3.1 |
| **Trailing blank** | **9.9 %** | 5.8 % | 5.1 % | 5.6 % |

The flagship packs a dense slab from 16 mm down to ~87 % of the page height,
then dumps **173 px (≈ 27 mm, 9.9 %)** of dead space in one band at the bottom.
The slack is hoarded at the end instead of distributed as breathing room. Every
prototype reduces both the peak density and the trailing void.

**Summary of the four marked zones**

1. **Contact line** — full-width, nowrap, 7-item run peppered with emerald
   separators, crowding the top-right edge.
2. **`{ EXPERIENCE }` jammed under the intro** — the intro→section gap (8 pt)
   is barely larger than an inter-entry gap, so the section start does not read
   as a fresh movement.
3. **Education + Publications cramped** — small-caps authors, italic journal,
   a `Publications` sub-label, and right-flushed year all stack into a dense
   knot at the bottom.
4. **Distribution** — mass bunched top-and-middle, a hard void at the foot.

---

## 2. Principles extracted from the literature

Each source below yielded 2–3 principles that bear on a dense one-page CV, and
each names something the flagship violates. Web sources were reached via search
excerpts (several book/publisher pages 403 through the proxy); citations are to
the canonical source pages.

**Robert Bringhurst — *The Elements of Typographic Style***
(<https://www.amazon.com/Elements-Typographic-Style-Robert-Bringhurst/dp/0881790338>)
- *Typographic colour*: mixing faces means matching weight, width, and rhythm
  across traditions — hard, and usually best avoided. → The flagship runs four
  voices per entry.
- Seek rhythm and proportion; set a comfortable measure and even leading.
- Restraint: "the more valuable the ornament, the more sparingly it should be
  used." → Chips + braces + rules + colour are all deployed at once.

**Jan Tschichold — *Asymmetric Typography* / *Die neue Typographie***
(<https://www.oakknoll.com/pages/books/5228/jan-tschichold/asymmetric-typography>)
- White space is an active compositional element, not leftover — plan it.
- Organise on a single, honest structural axis; asymmetry gives energy without
  clutter. → The flagship's centred-header / left-body axis switch.

**Josef Müller-Brockmann — *Grid Systems in Graphic Design***
(<https://monoskop.org/images/a/a4/Mueller-Brockmann_Josef_Grid_Systems_in_Graphic_Design_Raster_Systeme_fuer_die_Visuele_Gestaltung_English_German_no_OCR.pdf>)
- A grid organises dense information "meaningfully, logically, consistently";
  repetition of one module is what reads as calm.
- Strong asymmetric column structure (a data column vs a content column) beats
  per-line right-flushing. → The flagship right-flushes dates/locations
  entry-by-entry with no shared vertical rule.
- Colour on a grid should be functional (a signal), not decorative.

**Jost Hochuli — *Detail in Typography***
(<https://www.typotheque.com/books/detail-in-typography>)
- Legibility lives in the micro-detail: word-spacing, letter-spacing, line
  length. Loosened tracking + boxed chips damage word shape and even spacing.

**Gestalt grouping — proximity & common region** (NN/g)
(<https://www.nngroup.com/articles/gestalt-proximity/>,
<https://www.nngroup.com/articles/common-region/>)
- Proximity: space, not lines or boxes, is the cheapest and strongest grouping
  device — vary it to unite or separate.
- Common region: a shared boundary/column groups even spaced items, so in dense
  layouts a *column* can replace decoration entirely.

**Editorial practice (annual-report / magazine data pages)**
- Strong scale contrast — a few big quiet moments against small dense text —
  creates hierarchy without adding elements. The flagship is nearly monotone in
  scale (24 pt name, then everything at 8–10 pt).

---

## 3. The three prototypes

Same facts, three philosophies. Bullets are re-selected per design (as the
existing variants already do) — no wording in `content/*.md` was changed.

### Prototype A — Radical Reduction  (`eugene-lerman-proto-a`, theme `proto-a`)
**Philosophy:** Tschichold/Bringhurst restraint taken to the limit. **One
typeface family** (Source Sans Pro), essentially **two sizes**, **no chips, no
colour, no rules, no braces, no small-caps.** Whitespace is the *only* hierarchy
device; distinction comes from weight (regular vs semibold) and space alone.

- **Contact line** → one quiet grey line, a single ink, no emerald separators
  competing; it recedes instead of shouting.
- **`Experience` under intro** → a large, even air gap (≈ 7 mm, ~2× an entry
  gap) plus a bare semibold word — space is the divider, no rule/brace stack.
- **Education/Publications** → stripped to plain text: no small-caps, no italic
  journal, quiet `Publications` label; the knot dissolves.
- **Distribution** → fewer, stronger bullets and generous, even leading spread
  the content down the page; trailing void 9.9 %→8.6 % and peak density cut
  from 6.8 %→5.7 %.
- **Sacrifices:** the emerald identity and the braces soul are gone entirely;
  the tech stack loses its at-a-glance highlighting; least "designed" of the
  three, and the least brand-specific.

### Prototype B — Modernist Grid  (`eugene-lerman-proto-b`, theme `proto-b`)
**Philosophy:** Müller-Brockmann. A hard **left meta-column** (company /
location / dates as a mono data column) against a **right content column**,
with visible structural asymmetry and **one functional accent** (emerald) used
only for section labels and bullet markers — never decoration. New DOM
(`GridPage`): every block — header, intro, each role, education, publications —
is the *same two-column module* repeated.

- **Contact line** → moved into the data column as a stacked block; the
  full-width top-right crowding is structurally impossible.
- **`Experience` under intro** → the section label is its own gridded row with
  a hairline spanning the measure; the column structure separates it cleanly.
- **Education/Publications** → the same module: school/dates left, degree/paper
  right — reads as ordered rows, not a knot.
- **Distribution** → the repeated module and the sparse left column give the
  most even fill of the three; **best trailing-void score, 5.1 %.**
- **Sacrifices:** the sparse left column is deliberately "empty" (asymmetry as
  design), which reads as unusual for a résumé; most rigid of the three.
  (A later owner request brought the braces identity into the grid — see §5:
  mono braces in the muted data-column ink, never the accent, so they join the
  system as structure rather than decoration.)

### Prototype C — Editorial Expressive  (`eugene-lerman-proto-c`, theme `proto-c`)
**Philosophy:** strong **scale contrast** — a big quiet hero, small dense body —
and the **braces identity amplified into the layout itself**: a 36 pt
`{ EUGENE : LERMAN }` hero (44 pt in the first pass, reduced on owner
feedback — see §6) and **giant emerald braces as structural section
markers** (with a trailing gradient rule), instead of braces sprinkled as
punctuation. Emerald soul kept vividly alive. New DOM (`EditorialPage`); the
page's surplus is **spread as proportional inter-section and inter-entry air**,
so mass fills the page evenly — no stranded block, no hoarded void.

- **Contact line** → recast as a small, quiet byline beneath a large display
  intro; the scale jump gives it room and takes it off the crowded edge.
- **`Experience` under intro** → the display intro (14 pt light) and the giant
  brace marker create an unmistakable scale break; no ambiguity about a new
  section.
- **Education/Publications** → a deliberate footer band with its own big brace
  marker: degree line, publication line, small authors line.
- **Distribution** → the tall hero and proportionally enlarged section/entry
  gaps spread the mass down the page; trailing void 9.9 %→5.6 %, with no hole
  between the last entry and Education.
- **Chips** → kept as *emphasis* (emerald mono, **no boxes**) — the peppering is
  gone but the tech stack still reads at a glance.
- **Sacrifices:** the most opinionated/expressive — the big hero spends
  vertical budget, forcing the leanest bullet selection; the amplified braces
  are polarising; not an ATS-safe layout.

**How they oppose each other:** A removes the identity to reach silence; B
replaces decoration with pure structure and one signal; C amplifies the
identity into loud editorial scale. Reduction ↔ structure ↔ expression.

---

## 4. Refinement round (owner review fixes)

A second pass fixed visual artifacts found in owner review, each verified with
200 dpi crops of the exact region:

**Prototype C**
- The bottom-pinned footer had created a dead void between Wix and
  `{ EDUCATION }` — the very stranded-block problem the design claimed to
  solve. The pin was removed and the surplus redistributed as proportional
  inter-section/inter-entry air.
- The hero colon rendered small and low (mono colons centre on the x-height).
  It is now weighted up and lifted to the caps' optical centre.
- The contact run wrapped with a dangling "Hebrew · Russian"; it is now two
  intentionally balanced lines.
- The publication's authors line had been dropped; restored (small, muted) for
  content parity.
- The heading brace gaps were optically unequal (trailing letter-spacing after
  the last cap widened the closing gap); the tracking is now cancelled on the
  word's right edge so both gaps match.
- The trailing heading rule could vanish: a 0.5 pt semi-transparent box can
  round to nothing in the PDF rasteriser depending on its fractional
  y-position. Now 0.8 pt, solid colours.

**Prototype B**
- `linkedin.com/in/lerman-gene` broke mid-URL in the 40 mm data column; the
  contacts are now sized so the longest line fits, each line `nowrap`.
- "English · Hebrew · Russian" no longer dangles (same sizing).
- "Remitly Israel (formerly Rewire)" and "Ben-Gurion University of the Negev"
  now break at sensible points via `tidyLabel()` (parentheticals unbreakable,
  no single-word orphans).
- Company blurbs moved from under the ROLE (right column) to under the COMPANY
  in the data column — a Gestalt-proximity fix.
- The promotion row's lone dates block is pulled tighter to its parent row so
  it reads bound to the employer, not floating.
- The publication is no longer one crammed full-width line: journal + year are
  data (meta column); title and authors stack in the content column.

**Prototype A**
- The contact line no longer runs the full measure: two balanced lines via an
  explicit `contactSplit`, ending well short of the right edge.
- "early-stage" can no longer split across lines (`NoBreakCompounds` wraps
  hyphenated compounds in the prototypes' intros).
- The publication title now owns a clean full measure; journal + year follow
  on their own quiet line, clear of the title.
- Bullet markers raised from muted grey to full text ink — scannable at arm's
  length without adding a voice.

Post-fix distribution (measured, 150 dpi): trailing void A 5.8 %, B 5.1 %,
C 5.6 % (flagship: 9.9 %), with near-even ink across the thirds of each page.

---

## 5. Braces for the grid, and the pixel-perfect alignment pass

Two follow-up requests from the owner: give Prototype B the braces identity in
a way consistent with its philosophy, and make the braces "and everything
around them" pixel-perfect everywhere they appear. (In parallel, a build-time
tenure feature landed — `.dur` spans render "· 3 yr 3 mo" after date ranges —
and had to be absorbed without new wraps.)

### 5a. The braces join B's grid

In B, colour is a signal and the data column is the organising voice — so the
braces speak *data*, not *brand*: `{ EUGENE : LERMAN }` with mono braces and
colon in the muted data-column ink (words stay sans: light EUGENE, bold
LERMAN), and section labels become `{ EXPERIENCE }` with muted mono braces
around the accent word. The accent is used exactly where it was before —
nowhere new. The grid geometry is untouched: the marks live in the rows they
always occupied.

The tenure text did overflow B's 40 mm data column ("Dec 2022 – Feb 2026 ·
3 yr 3 mo" wrapped mid-token as "…3 yr / 3 mo"). Rather than shrink it, the
break is now deliberate: the range on one line, "· 3 yr 3 mo" on its own line
beneath, styled as data (`.g-dates .dur { display: block }`). Every entry uses
the same two-line data format, so the column stays rhythmic.

### 5b. Measured brace alignment (before → after, px @300 dpi)

Method: `pdftoppm -png -r 300` crops, a pixel-cluster analyser that reports
each glyph's bounding box, then CSS nudges, re-render, re-measure — repeated
until every context is inside tolerance (±2 px @300 dpi). Two systemic causes
surfaced and were fixed at the root:

1. **`position: relative` offsets quantise to whole CSS pixels in Chromium's
   print output** (1 css px = 3.125 px @300 dpi) — the same heading could land
   snapped up or down per instance (B's two section marks measured **opposite**
   ±1.5 px errors from identical CSS). All brace nudges are now
   `inline-block + transform: translateY(...)`, which paints continuously.
   Because inline-block drops edge whitespace, the headings' literal
   `"{ "` / `" }"` spaces became explicit margins (equal on both sides; the
   heading's letter-spacing trails the opening brace and the last letter
   equally, so gap symmetry is preserved by construction).
2. **Box-centering ≠ optical centering.** C's giant section braces were
   flex-centred as boxes and sat 15 px low (and ±2 px inconsistent between
   rows). The rows now align on the shared **baseline** and the brace is
   offset typographically (`translateY(0.136em)`, `line-height: 0` so the
   glyph overflows without inflating the row) — both rows now measure
   identically.

Final numbers (overshoot = brace beyond cap-top / beyond baseline; gaps =
open-brace→first letter vs last letter→close-brace):

| Context | Overshoot before | Overshoot after | Gaps before | Gaps after |
|---|---|---|---|---|
| Flagship h1 name | 11.5 / 9 | 10.5 / 10 | 74 vs 67 | 74 vs 74 |
| Flagship h2 ×2 | 6 / 3 · 5 / 3.5 | 4 / 5 · 4 / 5 | 41 vs 39 | 38 vs 36 · 38 vs 37 |
| B name | 3.5 / 7 | 5 / 5 | 38 vs 36 | 37 vs 36 |
| B section marks ×2 | 2 / 5 · 5 / 2 | 4 / 3 · 3 / 4 | 21 vs 19 | 21 vs 19 · 21 vs 20 |
| C hero | 22.5 / 15 | 18.5 / 19 | 61 vs 53 | 61 vs 62 |
| C section rows ×2 | 21 / 51 (!) | **36 / 36 · 36 / 36** | 48 vs 46 | 48 vs 46 · 48 vs 47 |
| Platform h1 / h2 | (inherited) | 10 / 11 · 4 / 5 | — | 75 vs 74 · 39 vs 37 |
| AI h1 / h2 | 12 / 13 | 12 / 13 | 73 vs **79** | 73 vs 73 · 34 vs 35 |

Colons (the pivot of `{ EUGENE : LERMAN }`) are lifted to the caps' **optical
middle** (mono colons natively straddle the x-height): flagship centre error
7.25 px → **0.25 px**; B 4.25 px → **0 px**; C hero 7.75 px high → **0.25 px**.
C's hero colon gaps are deliberately asymmetric — **tight to LERMAN** (the
value in the key : value pair) at a measured **1.35 : 1** (84 px EUGENE-side vs
62 px LERMAN-side); before, the asymmetry pointed the wrong way (77 vs 85).
Horizontal gap fixes account for sidebearings, not just margins: bold N's
right sidebearing is tighter than light E's left one, so the closing margin is
`+0.07em` (Source Code Pro) — and per-face tunable (`--nb-close-gap`, Roboto
Mono needs `0.51em`) because sidebearings are a property of the typeface.

All seven variants rebuilt green at one page each; final visual pass done at
100 % and 40 % scale.

---

## 6. Prototype C revision: smaller display scale, centred rules

Owner feedback on C: the hero and the giant section markers were **too large**,
and the trailing rules after `{ EXPERIENCE }` / `{ EDUCATION }` sat **off the
braces' optical centre**.

**Scale.** Hero `44 pt → 36 pt` (−18 %, tracking −0.5 → −0.4 pt); section
braces `30 pt → 25 pt`, heading caps `13 pt → 11 pt` (tracking 4 → 3.4 pt, with
the same trailing-tracking cancellation), row gap 2.6 → 2.3 mm. The hero still
reads as the page's display moment (4.2 : 1 against the 8.6 pt body) without
the poster effect. The ~4.5 mm freed was redistributed — hero gaps +1.7 mm
(title +0.2, intro +0.6, contacts +0.5, and the two markers' margin-bottom
+0.4 each), section tops 7.5 → 8.4 mm, entry gap 5 → 5.2 mm — so the page
stays evenly filled: last ink row moved only 123 px → 131 px from the page
bottom @150 dpi (≈ +1.3 mm of trailing margin, no new void, no crowding).

**Rule centring.** Cause found by measurement: the rule is a baseline-aligned
flex item with no text, so its **bottom edge sits on the shared baseline** —
its centreline measured 16–16.5 px *below* the caps' optical centre @300 dpi.
Chosen reference: the **caps' optical centre** (cap-top + baseline)/2 — which,
after the §5 baseline alignment, coincides with the braces' centre (≤1 px
apart in both rows), so one correction serves both. Fix:
`transform: translateY(-3.15pt)` = half cap-height above the baseline plus
half the rule's 0.8 pt height.

Rule centreline vs caps optical centre, px @300 dpi (target ±1 px):

| Row | Before | After |
|---|---|---|
| `{ EXPERIENCE }` | +16.5 (low) | **−0.5** |
| `{ EDUCATION }` | +16.0 (low) | **+1.0** |

(The residual ±0.5–1 px is pixel-grid quantisation of each row's fractional
y-position; both rows share identical CSS.)

All §5 hero alignments re-measured at 36 pt and still hold: brace overshoot
15 / 16 px above cap-top / below baseline; colon centre error **0 px** against
the caps' optical middle; name gaps 49–50 vs 50 px; colon gaps 68 vs 50 px =
**1.36 : 1** tight-to-LERMAN. Section-row brace overshoot 30 / 30 px in both
rows; brace-to-word gaps 42 vs 41 px (Experience) and 42 vs 40 px (Education).
All seven variants rebuilt green at one page; visual pass at 100 % and 40 %
confirms the hierarchy still carries at arm's length.

---

## 7. Files changed / added

**Added**
- `src/themes/proto-a.css` — Radical Reduction theme.
- `src/themes/proto-b.css` — Modernist Grid theme.
- `src/themes/proto-c.css` — Editorial Expressive theme.

**Changed**
- `src/variants.mjs` — three new variant entries (`layout: reduction | grid |
  editorial`), each with its own bullet selection.
- `src/components/CV.jsx` — new `GridPage` and `EditorialPage` layout branches
  plus small shared helpers (`contactList`, `tidyLabel`, `NoBreakCompounds`,
  `GridEntry`, `EdBrace`, `EdEntry`); `Header` gains an opt-in `contactSplit`
  for balanced multi-line contacts (no-op for the originals); the existing
  single/sidebar path is otherwise unchanged (reduction rides the single flow,
  styled by CSS only).
- `src/lib/fonts.mjs` — font-set mappings for the three new themes
  (`proto-a`: Source Sans only; `proto-b`/`proto-c`: Source Sans + Source Code
  Pro).

No content wording was edited. The four original variants are byte-for-byte
unchanged in output.

---

## 8. Owner feedback round 2 — split employers, summaries, header convergence, and Prototype D

Content changed upstream of this round (not part of the design work, but the
design had to absorb it): Remitly's two roles became two independent
employers — **Remitly** (Staff, Dec 2022 – Feb 2026) and **Rewire** (Senior,
Jun 2020 – Dec 2022, acquired by Remitly in 2022) — and every job gained a
one-line `summary:` in the owner's voice.

### 8a. Where the tenure duration lives (per layout, one rule each)

- **B (grid):** in the meta column, on its own line **directly beneath the
  date range** it summarises — company / blurb / location / dates /
  duration, one pair per employer. No leading interpunct: a line-initial
  "·" reads as an orphaned bullet. Styled as data (mono, muted, 85 %).
- **C (editorial):** **inline after the range on the role line**
  ("Dec 2022 – Feb 2026 · 3 yr 3 mo", muted) — nothing duplicated on the
  company line.
- **D (hybrid):** B's treatment (its meta column is B's).
- **Flow variants (flagship, platform, ai, parser, A):** unchanged — one
  duration per company on the company line ("Tel Aviv · 3 yr 3 mo").

### 8b. The summary line (all eight variants)

`job.summary` renders between the role line and the bullets: subordinate to
the role (muted ink, italic in most themes), clearly not a bullet (no
marker, full measure, bound tighter to the role than to the list — Gestalt
proximity). Prototype A keeps it roman in its second ink (no new voice);
the ATS variant keeps it plain text.

**Cost and consequence.** The split (+1 employer block) plus four to five
summary lines cost 10–19 mm per variant. Absorbed by tightening to the
research-spec floors — 9 pt body, 128 % leading, 14 mm side margins, tight
gap ends — rather than cutting content. The flagship keeps its 9.2 pt body
(130 % leading); platform / ai / parser now sit **at** the floors, and
Prototype A had to give back roughly half of its extra air (leading 138 %
→ 130 %, section gaps 6.6 → 4.4 mm). Flag for the owner: these pages are
now denser than the calm the redesign was bought for; if the air matters
more than the summaries, dropping one bullet per page buys it back.

### 8c. Header convergence (B and C)

- **C** replaced its left-aligned display hero with the flagship's centered
  header — { EUGENE : LERMAN } at 24 pt in Source Code Pro with the
  measured base.css brace metrics, small tracked title beneath, one
  centered contacts line — "more like the original latex version" — wearing
  C's emerald (braces + colon accent, title deep emerald). The display
  intro survives as a centered 13 pt paragraph; the brace section markers
  and their vertically-centred rules are untouched.
- **B** dropped the "CURRICULUM VITAE" label; its header is now the name +
  title centered above the grid. The braces keep B's grammar — quiet mono
  glyphs in the muted data ink (never the accent) — and the title line
  carries C's deep emerald. Centered tracked lines get a `padding-left`
  equal to their letter-spacing so the trailing track doesn't shift them
  half a step left.

### 8d. Prototype D — Grid × Editorial (`eugene-lerman-proto-d`, theme `proto-d`, layout `hybrid`)

The owner's requested convergence: **C's structure and voice** (centered
braces header, display intro, emerald as the one accent family, amplified
brace section markers with the trailing rule) carrying **B's per-entry
metadata treatment** (a 38 mm left data column stacking company / blurb /
location / dates / tenure-under-dates against a right column of role,
summary, bullets). Education and the publication ride the same grid
module. Distribution tuned so the page fills to a ~14 mm trailing margin
against 18 mm sides (no stranded bottom void); rag in the narrow column is
controlled (`tidyLabel` binds the last two words of company names and
blurbs — "migrant workers" never orphans "workers").

### 8e. Measured brace alignment, this round (px @300 dpi, tolerance ±2)

| Context | brace overshoot above/below caps | gap open / close | colon |
|---|---|---|---|
| Flagship h1 | 10 / 10 | 74 / 74 | centre Δ0.25 px; gaps 56 / 54 |
| Flagship h2 (Exp / Edu) | 4 / 5 · 4 / 5 | 38 / 36 · 38 / 37 | — |
| B header (centered, new) | 5 / 5 | 38 / 37 | centre Δ0.5 px; gaps 38 / 38 |
| B secmark (Exp / Edu) | 3 / 4 · 3 / 4 | 21 / 19 · 21 / 20 | — |
| C header (24 pt, new) | 10 / 10 | 74 / 74 | centre Δ0.25 px; gaps 56 / 54 |
| C secrow (Exp / Edu) | 30 / 30 · 30 / 30 | 41 / 40 · 41 / 40 | rule centreline Δ1 px |
| D header | 10 / 10 (after −0.051 em nudge; was 9 / 11) | 74 / 74 | centre Δ0.5 px |
| D secrow (Exp / Edu) | 30 / 30 · 31 / 29 (after 0.127 em; was 29 / 31) | 42 / 41 · 42 / 43 (after −2.9 pt cancel; was 42 / 39) | rule Δ0.5–1 px |

D needed its own sub-pixel nudges because its elements sit at different
x/y raster phases than C's: the same CSS rounded 1–2 px differently, so
the brace lift (0.136 em → 0.127 em), the name-brace lift (−0.048 em →
−0.051 em) and the heading's tracking cancellation (−3.4 pt → −2.9 pt)
were re-tuned against D's own measurements.

### 8f. Files changed in this round

- `src/components/CV.jsx` — summary line in all four layout families;
  `Dates` gains `withDur` (C's inline tenure); grid meta reordered
  (dates → duration-below); B header rebuilt (centered, no CV label);
  C header replaced by the shared flagship `Header`; new `HybridPage`
  (layout `hybrid`) and shared `GridEduRows`; blurbs run through
  `tidyLabel` in grid meta columns.
- `src/themes/proto-d.css` — new theme (grid × editorial).
- `src/themes/proto-b.css` — centered header, emerald title, duration/
  summary styles, fit trims.
- `src/themes/proto-c.css` — centered flagship-style header vars, inline
  duration, summary style, fit adjustments.
- `src/themes/base.css` — `.summary` primitive.
- `src/themes/looker.css`, `platform.css`, `ai.css`, `parser.css`,
  `proto-a.css` — summary styling + spec-floor fit packages for the
  split + summaries.
- `src/variants.mjs` — Prototype D entry; `src/lib/fonts.mjs` — proto-d
  font set.

All **eight** variants build green at one page; brace contexts measured at
300 dpi as above; full-page and 40 % passes on B, C, D confirm hierarchy at
arm's length.

## §9 · Prototype B promoted to canonical (owner decision)

The owner settled on Prototype B as the default, canonical variant, with two
modifications imported from C. B now builds as **`eugene-lerman.pdf`** (the
stable release URL unchanged); the old looker-theme flagship moved to
`eugene-lerman-classic.pdf`. The `eugene-lerman-proto-b` name is retired.

### 9a. The two imports from C

- **Tech chips restored** — B's original "no chips" stance is reversed: tech
  terms in bullets get C's boxless treatment (data mono, 92 %, deep emerald
  `#00735f`). Subtle enough not to fight the grid, distinct enough to read
  as terms of art.
- **Contact organization** — the stacked contact block leaves the data
  column for C's arrangement: one centered sans line under the title, six
  items with accent interpuncts, above the header rule. The intro then runs
  as a single full-measure lead (no more grid row with an empty meta cell).

### 9b. A latent overflow, found and fixed in three themes

Measuring the new line at 300 dpi exposed a pre-existing defect: the
six-item run at 7.8 pt with 1.6 mm sep margins is **175.7 mm** wide —
wider than C's 170 mm and B/D's 174 mm measures — so the centered
`nowrap` line silently overflowed the right margin (C by 6 mm, D by both
margins). Fixed at 7.5 pt / 1.2 mm seps in `proto-b` (`.g-contactline`),
`proto-c` and `proto-d`; the run now measures ~166 mm.

| Page | contact-line slack L / R @300 dpi | before |
|---|---|---|
| B (canonical) | 48 / 47 px | −1 / −24 px (overflow) |
| C | 25 / 24 px | 3 / −71 px (overflow) |
| D | 48 / 47 px | −21 / −48 px (overflow) |

### 9c. Fill redistribution

The header reorg freed ~7.5 mm of page (contact stack taller than the
intro it shared a row with), growing the trailing void to 9.5 mm past the
bottom pad. Redistributed into the rhythm: header pad 2.4→3 mm, intro gap
3.8→4.4 mm, section gaps 4.4→5.2 mm, secmark gap 3.2→3.6 mm, entry rows
3.4→4.1 mm. Content now ends 3.2 mm past the pad; name/title/contacts
measure centered to ≤1 px.

## §10 · Variants cut from the canonical grid

Two targeted variants now derive from the canonical design instead of the
retired flow themes; the grid theme gained the small machinery to support
them.

- **Full Stack** (`eugene-lerman-full-stack`) — same theme and layout as the
  flagship; the differences are a `title` override ("Senior Full Stack
  Engineer" — the first variant-level title override, `variant.title ??
  person.title`), an end-to-end intro, and a bullet cut that trades
  release-engineering ink for product depth (onboarding, Apollo GraphQL,
  XState flows, the Wix auth extraction).
- **AI-Native** (`eugene-lerman-ai-native`) — rebuilt on the grid; the old
  violet flow design lives in git history and `ai.css` is unused. The
  how-I-work section went grid-native: the prose is content, and the harness
  roster moved OUT of the prose into the data column as a stacked mono list
  (`.g-harness`) — the same voice as the dates everywhere else on the page,
  labeled `harnesses in rotation`.

**Density tiers.** Both cuts carry ~11 mm more than the canonical
page-filling rhythm holds, so the grid's vertical rhythm became CSS
variables (`--gp-*`, defaults = the canonical values) with two body-class
packages: `g-dense` (AI: how-I-work section) and `g-mid` (full stack),
tuned by measurement to land each page's trailing float in the canonical's
range — flagship 3.2 mm, full stack 3.4 mm, AI 1.9 mm past the bottom pad.
Title lines re-measured centered to ≤1 px under both overrides.

## §11 · The migration stories, told properly (owner context round)

The owner supplied the real stories behind three bullets; the rewrites are
longer because the mechanisms are the point:

- **`reactNative` (Rewire)** — not a regular migration: a React Native shell
  hosted the legacy app in a webview with a two-way `postMessage` bridge
  (navigation, modals, shared Redux state), features moved piecemeal,
  invisible to users. New **`secondAuth`** bullet: the step-up gate (Face
  ID / fingerprint / code) with backend enforcement — used by the
  full-stack variant in place of `xstate`.
- **`l10n` (Remitly)** — named (Lokey), bundled→dynamic framing, and the
  editing-a-string-is-the-whole-workflow automation (Lokalise, translation
  jobs, translator notification).
- **`semanticKeys`** — English-as-key → `header.title.text`, the
  context-gathering LLM service + review UI, one-click PR with a
  non-destructive migration, "done in a week."

The three bullets grew ~5 lines net, overflowing every variant. Absorbed
by story, not compression: each variant drops the bullets its angle needs
least (canonical: `release`+`ci`, which the platform variant keeps;
full-stack and AI: `platform`; platform/ATS: `xstate`, still covered in
skills keywords; classic: `onboarding`; proto-A/D: their thinnest cuts),
plus one density step where a tier existed (canonical → `g-mid`) and
small measured air trims on the flow themes and prototypes. All nine
variants back to one page.


## §12 · Links, languages, logos, and the unified experiment (owner round)

Nine asks in one round; the notable mechanics:

- **Live contact links** — `tel:` / `mailto:` / `https://` anchors carried
  into the PDF (Chromium preserves link annotations in print); dressed as
  plain text via `a { color: inherit; text-decoration: none }`. Verified in
  the binary: all four URI annotations present.
- **Languages, spelled out** — off the contact line, into a `Languages`
  footer row: "English and Hebrew (native) · Russian (reads and speaks
  well)" (from `person.md`). New `Off hours` row on canonical + unified:
  "A k3s home lab, home automation, and other over-engineering."
- **Compact inline tenure** — grid meta dates are now "Dec 22 – Feb 26 ·
  3y 3m": two-digit years + y/m units fit the 40mm column on one line, so
  the below-the-dates stack is gone.
- **Company marks** — inline SVGs before company names, sized 2.9mm,
  `fill=currentColor` so they take the surrounding ink. Sourced 3 of 6:
  Rylo (official mark, their repo), Remitly (potrace of the official
  raster from their npm SDK — a faithful trace, not official vector art),
  Wix (wordmark — deliberately unmapped: it would duplicate the name).
  Rewire (Wikimedia `File:Rewire_Logo.svg`) and BGU (Wikimedia or
  `in.bgu.ac.il/marketing/graphics/`) exist but those hosts are blocked
  from this sandbox — drop the files into `assets/logos/` as `rewire.svg`
  / `bgu.svg` and they light up on the next build. Nucleic Acids Research
  has no mark (typographic identity); none used.
- **Content merges (owner-directed)** — the Apollo GraphQL bullet folded
  into `lead` (with the dev-tooling clause); the LLM-heavy framing went
  into the Rylo and Remitly summary lines; `platform` gained the internal
  docs site; `agentSkills` lost the lean-skills credo (it duplicated the
  how-I-work prose nearly verbatim on pages showing both).
- **The Unified** (`eugene-lerman-unified`) — canonical grid + how-I-work
  + languages + off-hours; Wix rides on its summary line alone (an entry
  can now carry zero bullets). It holds one page at `g-dense` with an
  11mm bottom pad — the experiment stands, but it is the densest page in
  the family.
- **Fit accounting** — the restored `release` bullet (owner priority) was
  paid for on the canonical by `ci` and `auth`; dense pages moved to an
  11mm bottom pad; `g-dense` tightened one step further. All ten variants
  one page.

### §12 addendum — logo round two (owner-supplied assets)

The owner supplied the real logos. What landed: the official Rylo mark
(pasted as SVG text — replaces the favicon-derived swirl), and a
**wordmark mode**: Wix and Rewire have no separate mark, so their wordmark
renders IN PLACE of the printed company name (sized to the company line),
with the employer name kept in the PDF text layer as near-invisible 4pt
text for search/parsers. The loader now accepts `assets/logos/<slug>.png`
(embedded as a data URI) as well as SVG, so the remaining attachments —
which reached the conversation as images only, not files — just need to be
committed: `rewire.svg|png`, `bgu.svg|png`, and optionally an official
`remitly.svg` to replace the trace.

### §12 addendum 2 — the { ETC } section

Languages and Off-hours read as personal facts, not education, so they
moved out from under { EDUCATION } into their own quiet { ETC } section:
a full marked section (hairline and all) but tuned as a footer whisper —
tighter marker air, one grid row with the labels stacked 1:1 against the
content lines. Paid for by 17mm sides (from 18 — the wider measure
re-wraps the long bullets shorter), a 12/9.5mm vertical pad on dense
pages, and one more dense-tier notch. Found and fixed in the process: a
later `.g-dense` block was silently overriding the tier's variables —
several earlier "tightenings" had never actually applied.

### §12 addendum 3 — official artwork everywhere, sized by metrics

The owner pasted all three remaining SVG sources as text (the URLs were
egress-blocked): the full Rylo lockup, the official Rewire wordmark
(#321879 — replacing the geometric reconstruction), and BGU's circular
emblem. Consistency pass: wordmark sizes are derived from each file's
internal geometry so all three letter heights land at the 9pt bold company
names' cap height (~2.3mm) with baselines on the text baseline — Rylo
3.7mm (caps are 96/152 of its box), rewire 3.5mm (x-height 27/41), WIX
2.4mm (glyph-cropped box). Marks share 3.2mm with a 1.2mm gap; the BGU
disc gets +6% circular-optical compensation (3.4mm). Verified on a
stacked 300dpi strip of all five company slots.

## §13 · The generalist consolidation (owner round)

The owner settled the CV's thesis: not a client engineer, not a full-stack
engineer — an engineer who takes up whatever role the product needs. Six
directives landed together, and the variant family paid for them.

**One CV instead of four.** The Full Stack, AI-Native and Unified grid
siblings folded back into the canonical (their cuts live in git history).
The AI story is woven, not sectioned: an intro clause ("Since early 2026
most of that code has shipped through coding agents"), the Rylo and Remitly
summaries, and the semantic-keys bullet carry it without spending the
~14mm a how-I-work section costs. The intro was rebuilt around the thesis:
"building whatever needed building: apps, services, release systems, the
infrastructure underneath."

**The page absorbed three bullets.** Rewire got `xstate` and `secondAuth`
back (the owner: "did we shorten it because of lack of space? we should
reconsider") and Wix got the Editor-auth bullet back ("something i am proud
of and want to keep"). Rewire's `ci` bullet stays out of the canonical —
its story is half-covered by Rylo's platform bullet — but lives on in the
Platform/Parser/Classic cuts.

**{ BACKGROUND } — the merged ledger.** Education + Misc collapsed into one
section: four label/content pairs (Education / Publication / Languages /
Off hours), each pair its own grid row at 8.4pt so a wrapped line (the
paper title) can't shear the label alignment. One marker instead of two,
one line per fact; the BGU mark rides inline at 2.9mm. The publication's
separator binds to the journal name with an nbsp so a wrap carries "·"
to the next line instead of dangling it after the title. Saved ~14mm
against the old Education section + Misc footer.

**Durations in parentheses.** "Feb 26 – Present (7m)" replaced the
interpunct form, in the grid meta column and the single/editorial layouts
alike (owner directive).

**The lead bullet grew an example clause.** Per the owner's framing:
"creating and maintaining the app infrastructure itself, such as the
Apollo GraphQL layer with generated types and an offline-first storage
engine on MMKV" — the MMKV engine is a new fact from this round.

**Fit ledger.** Three added bullets ≈ +12mm; paid by the merged ledger
(~14mm at the old spacing), three orphan-line kills (release
"Distribution.", xstate "app release.", semanticKeys "week."), row-mb
2.3 → 2.15mm, and bottom padding 9.5 → 8.5mm. The g-mid density tier is
now unused but stays documented; `.g-etc` CSS was replaced by `.g-bg`.

## §14 · Meta-column voices and the ledger un-crowded (owner round)

Three complaints: the BACKGROUND section read crowded and off-system, the
location looked like blurb continuation (dates almost as bad), and the
page leaned on "·" too hard.

**Two clusters in the meta column.** The fix follows Gestalt proximity and
channel differentiation, not more separators: the column now reads as an
identity cluster (bold company + blurb set ITALIC — the same prose voice
as the summaries) and a data cluster (location + dates) with 1.2mm of air
between them. The location moved to a letterspaced micro-caps voice
(6.8pt, 0.7pt tracking — caps at small sizes need the extra 5–12%,
per Butterick), so geography stops masquerading as prose.

**One label style for the whole page.** The ledger's bold pseudo-company
labels were the "doesn't match the flow" culprit — almost-but-not-quite
the company treatment. They now wear exactly the location's micro-caps
style, so the page has ONE metadata-label voice. Ledger rows went from
0.6mm gaps (table-crammed) to 1.2mm, the marker gained air, content
leading eased to 1.35, and the label line-height (11.3pt) sits the smaller
caps on the 8.4pt content baseline.

**Interpunct diet.** The ledger's four middots became commas; years moved
into parenthesized mono spans (`.g-fdata`), rhyming with the durations'
new parentheses. Languages in person.md switched to a comma. The only
remaining middots are the header contact separators, where they do real
work. The ledger's education line uses `schoolShort` ("Ben-Gurion
University") to hold one line; the full name stays in education.md for
the other layouts.

**Fit.** The added air (~3.5mm) was paid by row-mb 2 → 2mm(from 2.15),
li-mb 0.25mm, ul margin-top 1.15mm, top padding 11.6mm and bottom
padding 7.8mm — type sizes untouched.

## §15 · { BACKGROUND } as code (owner idea + research round)

The ledger still read as "meh — everything bleeds together" and the owner
supplied the fix himself: set the section like code, the way his old LaTeX
CV's skills section read. It closes a loop the design already had open —
the page opens on { EUGENE : LERMAN } (a key:value pair in braces) and now
closes on an object literal:

    education:    { degree: "BSc, Computer Science & Bioinformatics",
                      school: "◉ Ben-Gurion University", years: 2013 – 2017 }
    publication:  { title: "TissueNet2", journal: "Nucleic Acids Research", year: 2016 }
    languages:    { english: "native", hebrew: "native", russian: "reads and speaks well" }
    offHours:     [ "k3s home lab", "home automation", "other over-engineering" ]

A parallel research pass over the acclaimed LaTeX CV classes (awesome-cv,
moderncv, friggeri, Deedy, AltaCV — sources in git history / PR thread)
found the same underlying mechanism everywhere: one dark anchor per line
against a muted tail, differentiation by intra-line contrast rather than
rules. Syntax coloring delivers exactly that for free, from the page's
existing palette only: top-level keys in the deep emerald (the chips'
voice), punctuation and nested keys in the muted gray, facts in ink. The
rows also stop being metrically identical — object vs array, one line vs
two, different raggedness — which kills the metronome effect.

Mechanics: everything in the data mono at the dates' 7.6pt, lh 1.5; keys
in the 40mm data column so the grid holds; the education object wraps with
a hanging indent (3.2mm = two mono chars, aligning "school:" under
"degree:"); the BGU disc rides INSIDE the quoted school string at 2.6mm.
Structured sources: person.md gained `langLevels` (english=native, …) and
the canonical's offHours became an array; the prose `languages` line stays
for the other layouts. The publication drops to its short title
("TissueNet2") in this form — full title still in publications.md.

### §15 addendum · The formatter pass

The first code rendering wrapped the education object mid-property-list
with a hanging indent — a shape no formatter emits ("the formatting is
shit - it needs to be beautiful. think of running the formatting through
a formatter and linter"). The section is now formatter-clean under
prettier's own conventions:

    school:       "◉ Ben-Gurion University"  // 2013–2017
    degree:       "BSc, Computer Science & Bioinformatics"
    publication:  { title: "TissueNet2", journal: "Nucleic Acids Research" }  // 2016, co-author
    languages:    { english: "native", hebrew: "native", russian: "reads and speaks well" }
    offHours:     ["k3s home lab", "home automation", "other over-engineering"]

Rules applied: every row is exactly ONE line (the overlong education
object flattened into school + degree keys, mirroring the jobs' company →
role order); years and the co-author credit ride as trailing // comments
(muted at 85% — an aside, not a member), which also brought the co-author
credit back; arrays hug their brackets, objects keep inner padding —
both prettier conventions. Line-fit math: at 7.6pt mono with -0.2pt
tracking the content column holds ~82 chars; the longest line
(publication, 79) clears it with slack. The .g-cind hanging-indent rule
is gone.

### §15 addendum 2 · The nested object (owner round)

Owner directives: all objects inline, abbreviations (CS), years inside
the object, publications as an array of objects nested INSIDE education,
two-column structure optional. Result — the section is now a full-measure
code block, no data column:

    education: { school: "◉ Ben-Gurion University", degree: "BSc, CS & Bioinformatics", years: "2013–2017",
                 publications: [{ title: "TissueNet2", journal: "Nucleic Acids Research", year: 2016 }] }  // co-author
    languages: { english: "native", hebrew: "native", russian: "reads and speaks well" }
    offHours:  ["k3s home lab", "home automation", "other over-engineering"]

Mechanics: white-space:pre-wrap + all-mono makes literal-space padding
exact — the three value columns align (offHours takes one extra pad
space), and education's single wrap lands on the property boundary before
`publications:`, continuation aligned under `school:` (clang-format's
AlignAfterOpenBracket convention, a deliberate break rather than an
accidental one). Tracking -0.3pt buys the 115-char publications line +
// co-author comment their fit (≈173mm in the 176mm measure).
education.md gained degreeShort. The section dropped from ~24mm to
~18mm; the slack went back into the page's rhythm (padding-bottom
9.5mm again, row/li gaps restored to their pre-squeeze values).

## §16 · Two bold reimaginings (independent designer round)

The owner commissioned an independent designer pass: "radically re-think...
two bold, beautiful, original reimaginings", canonical untouched. Both
live as appended variants; concepts and verification cycles are in the
PR thread.

**Reimagine 1 · The Broadsheet** (`reimagine-1.css`, layout `poster`) —
brutalist Swiss poster: full-bleed black slab, EUGENE solid / LERMAN
outline distributed edge to edge per glyph, one hot orange (#FF3B00)
strictly for wayfinding (section numerals, slash markers, durations),
Roboto families. The braces identity deliberately discarded; the wall of
type IS the identity. The display name is per-glyph, so an intact
"Eugene Lerman" is kept in the PDF text layer in slab-colored ink.

**Reimagine 2 · The Ledger** (`reimagine-2.css`, layout `ledger`) —
career cartography: a to-scale vertical time axis (2013 to now,
~1.4mm/month, computed from the job dates at build time) with employment
as filled emerald spans, the BSc hollow, year ticks, and a Tufte-style
caption ("fig. 1 / drawn to scale"). Time is read twice: as data in the
margin, as prose in the content. Transition months belong to the newer
span; 0.35mm end insets keep adjacent bars separate.

Both hold one A4 page (build-enforced alongside all existing variants),
carry live link annotations, and pull from the same content atoms.

### §15 addendum 3 · The prettier explosion, paid horizontally

The aligned-wrap compromise read as messy to the owner ("i want the
objects to be formatted correctly"). The section now renders the honest
prettier form — every object fully exploded, one property per line,
two-space indents, trailing commas — and pays the ~10-line vertical cost
with the owner's own suggestion: two side-by-side columns.

    education: {                          languages: {
      school: "◉ Ben-Gurion University",    english: "native",
      degree: "BSc, CS & Bioinformatics",   hebrew: "native",
      years: "2013–2017",                   russian: "reads and speaks well",
      publications: [{                    }
        title: "TissueNet2",
        journal: "Nucleic Acids Research",offHours: [
        year: 2016,  // co-author           "k3s home lab",
      }],                                   "home automation",
    }                                       "other over-engineering",
                                          ]

Columns balance at 10/11 lines. The block dropped to 6.8pt/1.28 (a
colophon, not body matter) and the page absorbed the remaining ~9mm via
a shave package: body leading 1.26 → 1.24, section/marker/intro/header
micro-gaps, and padding 10.8/7.2mm. Bottom ink now ends at 286.8mm.

## §17 · Three BACKGROUND studies (alongside the canonical)

Owner brief: reimagine the BACKGROUND section three ways, wild but
verified, as variants ALONGSIDE the canonical (`bg-a/b/c` — identical
page, only the section differs), probing his open question: do the
object keys earn their place?

- **A · The Session** — a two-column terminal transcript: keys become
  commands ($ cat education, $ open <doi>, $ locale, $ ls off-hours/),
  facts arrive as clean unquoted output. All the code soul, none of the
  brace/quote/comma scaffolding.
- **B · The Colophon** — the keyless answer: dated facts as ledger lines
  with hairline dot leaders to right-aligned mono years; undated facts
  in a quieter register, left to explain themselves.
- **C · The Manifest** — keys survive as the page's own micro-caps
  meta-column labels with years beneath in the dates voice; facts as
  single content lines. BACKGROUND finally speaks the same 40mm-grid
  dialect as EXPERIENCE.

All three keep the live DOI link and full text-layer extraction;
canonical output verified unchanged (pixel diff empty).

### §17 addendum · The Session, printed properly (owner pick)

The owner picked bg-a and asked for terminal fidelity "in terms of
prompt, font, etc". Changes: the generic $ became a starship-style
prompt (› at 115%/bold, the closest glyph Source Code Pro carries to ❯);
colors now follow zsh-syntax-highlighting truth — prompt emerald, the
command VERB deep-emerald (valid commands light up green), arguments
and ALL output in the default-foreground ink; outputs print as plain
text (no interpunct separators — "Ben-Gurion University, 2013–2017");
terminal grid discipline: letter-spacing 0, one size for command and
output (7.2pt/1.4).

### §17 addendum 2 · locale and education print JSON (owner round)

The Session's education and locale outputs became real JSON, and the
commands changed so the color is diegetic: `jq . education.json` and
`locale | jq` — jq genuinely colors what it prints, so the key/string/
punctuation registers (deep emerald / ink / muted) are now terminal
truth rather than typography. Colors belong to whole tokens (quotes
travel with their key or string, as jq renders them). Both columns
balance at eight lines; the pipe's second verb highlights like zsh
would.

## §18 · The Shell — the Session aesthetic, whole-page

The owner liked the Session's command outputs and asked for a variant
that "leans into this aesthetic in all sections". The Shell
(`eugene-lerman-shell`, theme terminal.css, layout terminal): a
lowercase all-mono braces identity ({ eugene : lerman }), then ONE
terminal window — hairline border, muted traffic lights, titlebar
eugene@tlv:~/cv — containing the whole CV as a session:

    › cat README.md              the intro
    › ls -t experience/          2026-rylo.md 2022-remitly.md ... (-t = newest first)
    › glow experience/<f>.md     each job as glow-rendered markdown
    › jq . education.json        the background block, two-up
    › _                          a bare prompt + resting cursor closes the page

Fidelity rules carried over: › for ❯, zsh verb highlighting, glow/jq
justify every color the output wears (bold roles, emerald bullets and
chips, jq JSON registers). The fiction mirrors repo truth — the jobs
really are markdown files. Blurbs fold into the summary lines (no meta
column to hold them). 7.3pt/1.43 mono fits the full canonical bullet
set on one page; the window flexes to the page bottom so the session
ends the way a real terminal does, waiting.

### §18 addendum · The clinical pass

Owner verdict on v1: "busy, crowded. Terminal should feel clean and
clinical." Diagnosis: full-width 113-char lines of full bullet prose
with 2.3mm gaps read as a gray brick, and color was sprinkled through
the output (emerald chips, emerald bullets, jq keys). The fixes, all in
the direction of a real terminal's calm:
- Output measure capped at 156mm (~100 chars) — ragged-right air.
- Block gaps 2.3 → 3.8mm, bullet gaps 0.4 → 1mm, lh 1.5.
- Monochrome output doctrine: color belongs to the SHELL (prompt,
  verbs) and the identity header only. Chips inherit ink, bullet dots
  muted, JSON keys muted.
- Clinical cut: 7 bullets (rylo rewrite+platform, remitly
  lead+semanticKeys, rewire reactNative, wix forms+auth) instead of the
  canonical 11 — terminals print terse output. Blurb merge reverted.

### §18 addendum 2 · Structured by the research

Second density verdict led to a structural pass driven by the two
research rounds on file:
- Job headers now follow the anchor-plus-right-axis pattern (the
  CV-typography research's top two mechanisms, and ls -l discipline in
  terminal terms): bold role flush left, mono dates + location flush
  right on one shared axis down the session.
- Summary lines removed — 8 lines of muted prose mass between anchors
  that the 7.4-second scan never reads; bullets carry the evidence.
- The Shell's README is capability-first (2026 scan research): twelve
  years + range + the agents clause, three lines; the curious-reader
  line remains the flagship's opener.
- Air: 7.6pt/1.55, 4.6mm block gaps.
