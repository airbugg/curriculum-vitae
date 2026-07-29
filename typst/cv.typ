// One-page A4 CV, five themed variants, driven by --input variant=<file-key>.
// Content comes from ../.build/cv-content.json (produced by
// scripts/export-content.mjs). Every human string arrives pre-split into
// typed segments ("t" text, "c" chip, "g" skills bracket-group) so this
// template never parses markdown.
//
// Spacing follows the research spec at its FLOORS (content is dense):
// 14mm sides / 13mm top / 16mm bottom, 9pt body at ~128% leading, monotonic
// gaps bullet < role→bullets < entry < section, 11pt headings 12pt/5pt.
//
//   typst compile --font-path fonts/ --input variant=eugene-lerman typst/cv.typ out.pdf

#let data = json("../.build/cv-content.json")
#let variantKey = sys.inputs.at("variant", default: "eugene-lerman")
#let cvv = data.variants.find(it => it.file == variantKey)
#if cvv == none { panic("unknown variant: " + variantKey) }
#let person = data.person

// --- theme -------------------------------------------------------------------

#let themes = (
  "looker": (
    accent: rgb("#00A388"), sans: "Source Sans Pro", bodyWeight: 300,
    mono: "Source Code Pro", head: "Roboto Mono", titleFont: "Source Code Pro",
    ink: rgb("#414141"), heavy: rgb("#2b2b2b"), muted: rgb("#7b8288"),
    nameFirst: rgb("#999999"), braceWeight: "regular", rule: rgb("#d8dbdd"),
    chipBg: rgb("#f2f2f2"), chipInk: rgb("#333333"),
    labelInk: rgb("#5d5d5d"), valInk: rgb("#414141"), bgInk: rgb("#333333"),
    centered: true, bar: false, datesMono: false, monoLabels: true,
  ),
  "platform": (
    accent: rgb("#2b6a9b"), sans: "Source Sans Pro", bodyWeight: 400,
    mono: "Source Code Pro", head: "Source Code Pro", titleFont: "Source Code Pro",
    ink: rgb("#232a32"), heavy: rgb("#14181d"), muted: rgb("#5c6672"),
    nameFirst: rgb("#8fa0ae"), braceWeight: "bold", rule: rgb("#c8d2db"),
    chipBg: rgb("#eef2f5"), chipInk: rgb("#33414d"),
    labelInk: rgb("#5c6672"), valInk: rgb("#2c343d"), bgInk: rgb("#333c44"),
    centered: false, bar: false, datesMono: true, monoLabels: false,
  ),
  "generalist": (
    accent: rgb("#b4552d"), sans: "Roboto", bodyWeight: 400,
    mono: "Roboto Mono", head: "Roboto Mono", titleFont: "Roboto Mono",
    ink: rgb("#2a2622"), heavy: rgb("#16130f"), muted: rgb("#6e655c"),
    nameFirst: rgb("#a89a8c"), braceWeight: "bold", rule: rgb("#e0d5cb"),
    chipBg: rgb("#f5efe9"), chipInk: rgb("#4c4238"),
    labelInk: rgb("#6e655c"), valInk: rgb("#3b352f"), bgInk: rgb("#3b352f"),
    centered: false, bar: true, datesMono: false, monoLabels: false,
  ),
  "ai": (
    accent: rgb("#6d28d9"), sans: "Source Sans Pro", bodyWeight: 400,
    mono: "Roboto Mono", head: "Roboto Mono", titleFont: "Roboto Mono",
    ink: rgb("#1e2126"), heavy: rgb("#0e1013"), muted: rgb("#5b616b"),
    nameFirst: rgb("#9d94b5"), braceWeight: "bold", rule: rgb("#ddd6ea"),
    chipBg: rgb("#f3effb"), chipInk: rgb("#43356b"),
    labelInk: rgb("#5b616b"), valInk: rgb("#2a2e35"), bgInk: rgb("#343048"),
    centered: false, bar: false, datesMono: true, monoLabels: false,
  ),
  "parser": (
    accent: rgb("#000000"), sans: "Liberation Sans", bodyWeight: 400,
    mono: "Liberation Sans", head: "Liberation Sans", titleFont: "Liberation Sans",
    ink: rgb("#000000"), heavy: rgb("#000000"), muted: rgb("#333333"),
    nameFirst: rgb("#333333"), braceWeight: "bold", rule: rgb("#999999"),
    chipBg: rgb("#ffffff"), chipInk: rgb("#000000"),
    labelInk: rgb("#000000"), valInk: rgb("#000000"), bgInk: rgb("#000000"),
    centered: false, bar: false, datesMono: false, monoLabels: false,
  ),
)
#let th = themes.at(cvv.theme)
#let plain = cvv.nameStyle == "plain"
#let accent = th.accent

// Body 9pt at ~128% leading (spec floor). Typst leading is between tight
// line boxes (~0.62em of glyph box at these fonts), so 0.62em leading gives
// the spec's ~11.5pt baseline pitch — measured against the web renders.
// The Looker carries the least content and the most bottom air — spend some of
// the reclaimed space on a slightly larger, calmer body (9.4 vs 9pt).
#let bodySize = if cvv.theme == "looker" { 9.4pt } else { 9pt }
#let bodyLeading = 0.62em

#set page(paper: "a4", margin: (x: 14mm, top: 13mm, bottom: 16mm))
#set text(font: th.sans, weight: th.bodyWeight, size: bodySize, fill: th.ink, lang: "en")
#set par(leading: bodyLeading, spacing: bodyLeading, justify: false)

// --- inline segment rendering ------------------------------------------------

// Tech chips in EXPERIENCE bullets keep the light-gray rounded background
// (the original CV's \mylib boxes). Skills render their own quiet variant.
#let chip(t) = {
  if plain { [#t] }
  else {
    box(
      fill: th.chipBg, radius: 2pt,
      inset: (x: 2.4pt, y: 0pt), outset: (y: 1.8pt),
      text(font: th.mono, size: 0.86em, fill: th.chipInk)[#t],
    )
  }
}

#let segs(s) = {
  for seg in s {
    if seg.at(0) == "t" { seg.at(1) } else { chip(seg.at(1)) }
  }
}

// Skills-only segments: a "g" bracket group is one continuous mono run at the
// FULL value size (the old 90% read too small). Two inks only — value ink for
// the content, muted label ink for the [ ] brackets — with a thin [\, x \,]
// inset instead of a full space.
#let skillSegs(s) = {
  for seg in s {
    if seg.at(0) == "t" { seg.at(1) }
    else if seg.at(0) == "g" {
      text(font: th.mono, size: 1em)[#text(fill: th.labelInk)[\[]#h(0.16em)#text(fill: th.valInk)[#seg.at(1)]#h(0.16em)#text(fill: th.labelInk)[\]]]
    } else {
      if plain { seg.at(1) } else { text(font: th.mono, size: 1em, fill: th.valInk)[#seg.at(1)] }
    }
  }
}

// --- header ------------------------------------------------------------------

#let nameParts = person.name.split(" ")
#let firstName = upper(nameParts.first())
#let lastName  = upper(nameParts.last())

// { EUGENE : LERMAN } — first name Roboto Mono Thin (100) in gray, last name
// bold dark, braces and colon dark, normal tracking, ~24pt.
#let bracedName = {
  set text(font: th.head, size: 24pt)
  // Word gaps matched to the original PDF (measured at 200dpi): generous air
  // around the braces, a tight colon hugging both words — not uniform spacing.
  box[
    #text(fill: th.heavy, weight: th.braceWeight)[\{]
    #h(0.5em)
    #text(fill: th.nameFirst, weight: 100)[#firstName]
    #h(0.26em)
    #text(fill: th.heavy, weight: "regular")[:]
    #h(0.2em)
    #text(fill: th.heavy, weight: "bold")[#lastName]
    #h(0.5em)
    #text(fill: th.heavy, weight: th.braceWeight)[\}]
  ]
}

#let plainName = text(font: th.sans, size: 24pt, weight: "bold", fill: th.heavy)[#person.name]

#let titleLine = if plain {
  text(font: th.sans, size: 10.5pt, fill: th.muted)[#person.title]
} else if cvv.theme == "looker" {
  // Source Code Pro small-caps, 11pt, accent — the original's title line.
  text(font: th.titleFont, size: 11pt, fill: accent, tracking: 0.8pt)[#smallcaps(person.title)]
} else if cvv.theme == "generalist" {
  text(font: th.titleFont, size: 11pt, fill: accent, tracking: 0.4pt)[#person.title]
} else {
  text(font: th.titleFont, size: 10.5pt, fill: accent, tracking: 1.2pt)[#upper(person.title)]
}

#let contactItems = (
  person.location, person.phone, person.email, person.github, person.linkedin,
).filter(x => x != none and x != "")

#let sep = if plain { text(fill: th.muted)[ #sym.dot.c ] } else { text(fill: accent)[ #sym.dot.c ] }
#let contactLine = text(size: 7.8pt, fill: th.muted, font: th.sans)[
  #contactItems.map(x => [#x]).join(sep)
]

#let header = {
  let body = {
    if plain { plainName } else { bracedName }
    v(-6.6pt)   // name→title: pulls against par spacing + name descender; ≈4pt visual (matches web)
    titleLine
    v(-1.1pt) // title→contacts: ≈6.5pt baseline→cap visual (matches web)
    contactLine
  }
  if th.centered { align(center, body) } else { body }
}

// --- section heading ---------------------------------------------------------
// 11pt, 12pt above / ~5pt below; hairline full-width rule beneath — except
// the generalist, whose short accent bar starts under the first LETTER of
// the heading word (measured past the "{ " prefix), not under the brace.

#let headTracking = if cvv.theme == "generalist" { 0.2pt } else { 0.7pt }

// `after` compensates for the following block's own `above` spacing so the
// rule→content gap lands at the web renders' ~5.7pt regardless of what
// follows (jobEntry above:13pt, skills row above:9pt, plain paragraph).
#let sectionHeading(title, after: 0.4pt) = {
  let up = upper(title)
  let headText = {
    set text(font: th.head, size: 11pt, weight: "bold", tracking: headTracking)
    text(fill: th.heavy)[\{]
    h(3pt)
    text(fill: accent)[#up.first()]
    text(fill: th.heavy)[#up.slice(1)]
    h(3pt)
    text(fill: th.heavy)[\}]
  }
  block(above: 15.5pt, below: 2.4pt)[
    #if plain {
      text(font: th.sans, size: 11pt, weight: "bold", fill: th.heavy, tracking: 0pt)[#up]
    } else {
      headText
    }
  ]
  if th.bar {
    // brace prefix width = "{" glyph + 3pt gap, at the heading's own settings
    context {
      let pre = measure({
        set text(font: th.head, size: 11pt, weight: "bold", tracking: headTracking)
        [\{]
        h(3pt)
      })
      pad(left: pre.width, line(length: 12mm, stroke: 1.6pt + accent))
    }
  } else {
    line(length: 100%, stroke: 0.35pt + th.rule)
  }
  v(after)
}

// --- job entry ---------------------------------------------------------------

// Dates cell styling, shared by the company span and the per-role dates.
#let datesText(d) = {
  if th.datesMono { text(font: th.mono, size: 8pt, fill: th.muted)[#d] }
  else if plain { text(size: 8pt, fill: th.muted)[#d] }
  else { text(size: 8pt, fill: th.muted, style: "italic")[#d] }
}

// A role's bullets — hanging indent 3.2mm, bullet-to-bullet ~leading+1.5pt.
#let bulletList(sec) = {
  v(1pt) // role-line→first bullet ≈3pt visual
  for b in sec.bullets {
    block(above: 7.1pt, below: 0pt, breakable: false)[
      #grid(
        columns: (3.2mm, 1fr), column-gutter: 0pt, align: (left + top, left + top),
        text(fill: if plain { th.ink } else { accent })[#sym.bullet],
        [#segs(b)],
      )
    ]
  }
}

// A compact role→right line (right = location for a single role, or that
// role's own dates inside a merged company block).
#let roleLine(role, rightItem, isLoc) = {
  grid(
    columns: (1fr, auto), column-gutter: 6pt, align: (left + top, right + top),
    if plain {
      text(size: 8.5pt, weight: "semibold")[#role]
    } else {
      text(size: 8.5pt, weight: "semibold", fill: accent)[#smallcaps(role)]
    },
    if isLoc {
      if plain { text(size: 8pt, fill: th.muted)[#rightItem] }
      else { text(size: 8pt, fill: accent, style: "italic")[#rightItem] }
    } else {
      datesText(rightItem)
    },
  )
}

// One company block. Consecutive sections sharing a company arrive here as a
// group: the company header, its location and the combined span render ONCE,
// then each role gets its own role→dates line + bullets — a promotion reads as
// two roles in one block. A single-role group keeps the classic role→location.
#let groupEntry(group) = {
  let multi = group.len() > 1
  let first = group.first()
  let combined = if multi {
    let firstEnd = first.dates.split("–").at(1, default: "").trim()
    let lastStart = group.last().dates.split("–").at(0, default: "").trim()
    lastStart + " – " + firstEnd
  } else { first.dates }

  block(breakable: false, above: 13pt, below: 0pt)[
    #grid(
      columns: (1fr, auto), column-gutter: 6pt, align: (left + bottom, right + bottom),
      {
        text(weight: "bold", size: 9.5pt, fill: th.heavy)[#first.company]
        if first.blurb != "" {
          h(5pt)
          text(size: 8pt, weight: 400, fill: th.muted)[#first.blurb]
        }
        if multi and first.location != "" {
          h(5pt)
          if plain { text(size: 8pt, fill: th.muted)[#first.location] }
          else { text(size: 8pt, fill: accent, style: "italic")[#first.location] }
        }
      },
      datesText(combined),
    )
  ]
  if multi {
    for (i, sec) in group.enumerate() {
      block(above: if i == 0 { 1.6pt } else { 5.4pt }, below: 0pt, breakable: false)[
        #roleLine(sec.role, sec.dates, false)
      ]
      bulletList(sec)
    }
  } else {
    block(above: 1.6pt, below: 0pt, breakable: false)[
      #roleLine(first.role, first.location, true)
    ]
    bulletList(first)
  }
}

// --- how-I-work box (ai variant) --------------------------------------------

#let howBox = if cvv.howIWork != none {
  block(
    width: 100%, above: 10pt, below: 2pt,
    fill: rgb("#f5f2fb"), stroke: 0.35pt + rgb("#ddd2f0"),
    radius: 3pt, inset: (x: 8.5pt, top: 16pt, bottom: 8.5pt),
  )[
    #text(font: th.mono, size: 8pt, weight: "bold", fill: accent, tracking: 1pt)[\{ #upper(cvv.howIWork.heading) \}]
    #v(3pt)
    #text(size: 9pt, fill: th.ink)[#segs(cvv.howIWork.text)]
  ]
}

// --- education / publications / skills ---------------------------------------

#let eduBlock = {
  let e = data.education
  grid(
    columns: (1fr, auto), column-gutter: 6pt, align: (left + bottom, right + bottom),
    {
      text(weight: "semibold", fill: th.heavy)[#e.degree]
      h(5pt)
      text(size: 8pt, fill: th.muted)[#e.school]
    },
    {
      if plain or th.datesMono {
        text(size: 8pt, fill: th.muted, font: if th.datesMono { th.mono } else { th.sans })[#e.dates]
      } else {
        text(size: 8pt, fill: th.muted, style: "italic")[#e.dates]
      }
    },
  )
}

#let pubBlock = {
  let p = data.publications
  grid(
    columns: (1fr, auto), column-gutter: 8pt, align: (left + top, right + top),
    text(weight: "semibold", size: 8.7pt, fill: th.heavy)[#p.title],
    {
      align(right)[
        #if plain {
          text(size: 8.5pt, fill: th.ink)[#p.journal]
        } else {
          text(size: 8.5pt, fill: accent, style: "italic")[#p.journal]
        }
        #linebreak()
        #text(size: 8pt, fill: th.muted)[#p.year]
      ]
    },
  )
  v(1pt)
  if plain {
    text(size: 8pt, fill: th.muted)[#p.authors]
  } else {
    text(size: 8pt, fill: th.muted, tracking: 0.2pt)[#smallcaps(p.authors)]
  }
}

// The original's quiet skills ledger: muted regular labels (slightly larger
// than the value) right-aligned in a ~19mm column, values first-baseline
// aligned via inline boxes + hanging indent, rows ~1.6mm apart.
#let skillLabelW = if plain { 34mm } else { 19mm }
#let skillGutter = 3.5mm
#let skillLabel(t) = {
  if plain {
    text(size: 9pt, fill: th.labelInk)[#t]
  } else if th.monoLabels {
    // looker flavor: mono uppercase labels echoing the { SKILLS } heading;
    // nudged down so its baseline meets the value's first baseline
    move(dy: 0.9pt, text(font: th.head, size: 7pt, tracking: 0.6pt, fill: th.labelInk)[#upper(t)])
  } else {
    text(size: 9pt, weight: 400, fill: th.labelInk)[#t]
  }
}

#let skillsBlock = {
  for row in cvv.skills {
    block(above: 9pt, below: 0pt, breakable: false)[
      #grid(
        columns: (skillLabelW, 1fr), column-gutter: skillGutter,
        align: (if plain { left + top } else { right + top }, left + top),
        skillLabel(row.at(0)),
        text(size: if plain { 9pt } else { 8.6pt }, fill: th.valInk)[#skillSegs(row.at(1))],
      )
    ]
  }
}

// --- assemble ----------------------------------------------------------------

#header
#v(10pt) // contacts→intro

// Intro: 9.5pt at ~136% leading, measure capped at 150mm (~90 chars).
#let introBlock = block(width: 150mm)[
  #par(leading: 0.7em)[#text(size: 9.5pt, fill: th.ink)[#segs(cvv.intro)]]
]
#if th.centered { align(center, introBlock) } else { introBlock }

#if cvv.howIWork != none { howBox }

// Group consecutive sections sharing a company (the two Remitly roles) into
// one block before rendering.
#let jobGroups = {
  let groups = ()
  for sec in cvv.sections {
    if groups.len() > 0 and groups.last().first().company == sec.company {
      groups.last().push(sec)
    } else {
      groups.push((sec,))
    }
  }
  groups
}

#sectionHeading(cvv.headings.experience, after: -7.5pt)
#for g in jobGroups { groupEntry(g) }

// Education — with the publication folded in beneath the degree row (one
// heading where there used to be two). Extra top air per the de-busying pass.
#sectionHeading(cvv.headings.education)
#eduBlock
#v(3.5pt)
#pubBlock

#sectionHeading(cvv.headings.skills, after: -2.5pt)
#skillsBlock
