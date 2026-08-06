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
| Top third ink % | 5.6 | 3.5 | 2.9 | 3.0 |
| Middle third ink % | 6.8 | 5.7 | 5.5 | 6.0 |
| Bottom third ink % | 3.1 | 2.8 | 3.7 | 2.9 |
| **Trailing blank** | **9.9 %** | 8.6 % | **4.4 %** | 5.3 % |

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
  most even fill of the three; **best trailing-void score, 4.4 %.**
- **Sacrifices:** the braces identity is dropped (plain name); the sparse left
  column is deliberately "empty" (asymmetry as design), which reads as unusual
  for a résumé; most rigid of the three.

### Prototype C — Editorial Expressive  (`eugene-lerman-proto-c`, theme `proto-c`)
**Philosophy:** strong **scale contrast** — a big quiet hero, small dense body —
and the **braces identity amplified into the layout itself**: a 44 pt
`{ EUGENE : LERMAN }` hero and **giant emerald braces as structural section
markers** (with a trailing gradient rule), instead of braces sprinkled as
punctuation. Emerald soul kept vividly alive. New DOM (`EditorialPage`); the
page is a flex column so the education footer is **pinned to the bottom edge** —
the trailing void is designed away, not left to chance.

- **Contact line** → recast as a small, quiet byline beneath a large display
  intro; the scale jump gives it room and takes it off the crowded edge.
- **`Experience` under intro** → the display intro (14 pt light) and the giant
  brace marker create an unmistakable scale break; no ambiguity about a new
  section.
- **Education/Publications** → a deliberate footer band with its own big brace
  marker, two tidy lines, pinned low.
- **Distribution** → `margin-top:auto` on the footer plus the tall hero
  distribute mass top-and-bottom intentionally; trailing void 9.9 %→5.3 %.
- **Chips** → kept as *emphasis* (emerald mono, **no boxes**) — the peppering is
  gone but the tech stack still reads at a glance.
- **Sacrifices:** the most opinionated/expressive — the big hero spends
  vertical budget, forcing the leanest bullet selection; the amplified braces
  are polarising; not an ATS-safe layout.

**How they oppose each other:** A removes the identity to reach silence; B
replaces decoration with pure structure and one signal; C amplifies the
identity into loud editorial scale. Reduction ↔ structure ↔ expression.

---

## 4. Files changed / added

**Added**
- `src/themes/proto-a.css` — Radical Reduction theme.
- `src/themes/proto-b.css` — Modernist Grid theme.
- `src/themes/proto-c.css` — Editorial Expressive theme.

**Changed**
- `src/variants.mjs` — three new variant entries (`layout: reduction | grid |
  editorial`), each with its own bullet selection.
- `src/components/CV.jsx` — new `GridPage` and `EditorialPage` layout branches
  plus small shared helpers (`contactList`, `GridEntry`, `EdBrace`, `EdEntry`);
  the existing single/sidebar path is unchanged (reduction rides the single
  flow, styled by CSS only).
- `src/lib/fonts.mjs` — font-set mappings for the three new themes
  (`proto-a`: Source Sans only; `proto-b`/`proto-c`: Source Sans + Source Code
  Pro).

No content wording was edited. The four original variants are byte-for-byte
unchanged in output.
