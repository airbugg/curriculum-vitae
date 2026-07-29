// One-page A4 CV, five themed variants, driven by --input variant=<file-key>.
// Content comes from ../.build/cv-content.json (produced by
// scripts/export-content.mjs). Every human string arrives pre-split into
// backtick segments so this template never parses markdown.
//
//   typst compile --font-path fonts/ --input variant=eugene-lerman typst/cv.typ out.pdf

#let data = json("../.build/cv-content.json")
#let variantKey = sys.inputs.at("variant", default: "eugene-lerman")
#let cvv = data.variants.find(it => it.file == variantKey)
#if cvv == none { panic("unknown variant: " + variantKey) }
#let person = data.person

// --- theme -------------------------------------------------------------------

#let themes = (
  "looker":     (accent: rgb("#00a19a"), sans: "Roboto",          mono: "Roboto Mono",     centered: true),
  "platform":   (accent: rgb("#2b6a9b"), sans: "Source Sans Pro", mono: "Source Code Pro", centered: false),
  "generalist": (accent: rgb("#b4552d"), sans: "Roboto",          mono: "Roboto Mono",     centered: false),
  "ai":         (accent: rgb("#6d28d9"), sans: "Source Sans Pro", mono: "Roboto Mono",     centered: false),
  "parser":     (accent: rgb("#1a1a1a"), sans: "Liberation Sans", mono: "Liberation Mono", centered: false),
)
#let th = themes.at(cvv.theme)
#let plain = cvv.nameStyle == "plain"

#let ink   = if plain { rgb("#000000") } else { rgb("#1f1f1f") }
#let heavy = if plain { rgb("#000000") } else { rgb("#141414") }
#let muted = if plain { rgb("#333333") } else { rgb("#6b6b6b") }
#let faint = if plain { rgb("#555555") } else { rgb("#b0b0b0") }
#let chipbg = rgb("#ececec")
#let accent = th.accent

// --- page + base text --------------------------------------------------------

#set page(paper: "a4", margin: (x: 12mm, top: 11mm, bottom: 9mm))
#set text(font: th.sans, size: 8.7pt, fill: ink, lang: "en")
#set par(leading: 3.6pt, spacing: 3.6pt, justify: false)

// --- inline segment rendering ------------------------------------------------

#let chip(t) = {
  if plain { [#t] }
  else {
    box(
      fill: chipbg, radius: 2pt,
      inset: (x: 2.6pt, y: 0pt), outset: (y: 2pt),
      text(font: th.mono, size: 0.82em, fill: heavy)[#t],
    )
  }
}

#let segs(s) = {
  for seg in s {
    if seg.at(0) == "t" { seg.at(1) } else { chip(seg.at(1)) }
  }
}

// --- header ------------------------------------------------------------------

#let nameParts = person.name.split(" ")
#let firstName = upper(nameParts.first())
#let lastName  = upper(nameParts.last())

#let bracedName = {
  set text(font: th.mono, size: 18pt)
  box[
    #text(fill: heavy, weight: "bold")[\{]
    #h(4pt)
    #text(fill: faint, weight: "light", tracking: 1.2pt)[#firstName]
    #h(4pt)
    #text(fill: heavy, weight: "bold")[:]
    #h(4pt)
    #text(fill: heavy, weight: "black", tracking: 1.2pt)[#lastName]
    #h(4pt)
    #text(fill: heavy, weight: "bold")[\}]
  ]
}

#let plainName = text(font: th.sans, size: 17pt, weight: "bold", fill: heavy)[#person.name]

#let titleLine = if plain {
  text(font: th.sans, size: 10pt, fill: muted)[#person.title]
} else {
  text(font: th.mono, size: 8.6pt, weight: "medium", tracking: 3pt, fill: accent)[#upper(person.title)]
}

#let contactItems = (
  person.location, person.phone, person.email, person.github, person.linkedin,
).filter(x => x != none and x != "")

#let sep = text(fill: faint)[ #sym.dot.c ]
#let contactLine = text(size: 7.4pt, fill: muted, font: th.sans)[
  #contactItems.map(x => [#x]).join(sep)
]

#let header = {
  let body = {
    if plain { plainName } else { bracedName }
    v(2.5pt)
    titleLine
    v(4pt)
    contactLine
  }
  if th.centered { align(center, body) } else { body }
}

// --- section heading ---------------------------------------------------------

#let sectionHeading(title) = {
  let up = upper(title)
  block(above: 8.5pt, below: 3pt)[
    #if plain {
      text(font: th.sans, size: 10.5pt, weight: "bold", fill: heavy, tracking: 0.5pt)[#up]
    } else {
      set text(font: th.mono, size: 10.5pt, weight: "bold", tracking: 1.2pt)
      text(fill: heavy)[\{]
      h(3pt)
      text(fill: accent)[#up.first()]
      text(fill: heavy)[#up.slice(1)]
      h(3pt)
      text(fill: heavy)[\}]
    }
  ]
  line(length: 100%, stroke: 0.5pt + faint)
  v(2.5pt)
}

// --- job entry ---------------------------------------------------------------

#let jobEntry(sec) = {
  block(breakable: false, above: 5.5pt, below: 0pt)[
    #grid(
      columns: (1fr, auto), column-gutter: 6pt, align: (left + bottom, right + bottom),
      {
        text(weight: "bold", size: 9pt, fill: heavy)[#sec.company]
        if sec.blurb != "" {
          [ ]
          text(size: 7.4pt, fill: muted)[#sec.blurb]
        }
      },
      text(size: 8pt, fill: muted, style: "italic")[#sec.dates],
    )
    #v(0.6pt)
    #grid(
      columns: (1fr, auto), column-gutter: 6pt, align: (left + top, right + top),
      text(size: 8pt, fill: accent)[#smallcaps(sec.role)],
      text(size: 8pt, fill: accent, style: "italic")[#sec.location],
    )
  ]
  for b in sec.bullets {
    block(above: 2.2pt, below: 0pt, breakable: false)[
      #grid(
        columns: (8pt, 1fr), column-gutter: 0pt, align: (left + top, left + top),
        text(fill: if plain { ink } else { accent })[#sym.bullet],
        [#segs(b)],
      )
    ]
  }
}

// --- how-I-work box (ai variant) --------------------------------------------

#let howBox = if cvv.howIWork != none {
  block(
    width: 100%, above: 6pt, below: 2pt,
    fill: accent.lighten(92%), stroke: 0.5pt + accent.lighten(55%),
    radius: 3pt, inset: (x: 8pt, y: 6pt),
  )[
    #text(font: th.mono, size: 8pt, weight: "bold", fill: accent, tracking: 1pt)[\{ #upper(cvv.howIWork.heading) \}]
    #v(2.5pt)
    #text(size: 8.3pt, fill: ink)[#segs(cvv.howIWork.text)]
  ]
}

// --- education / publications / skills ---------------------------------------

#let eduBlock = {
  let e = data.education
  grid(
    columns: (1fr, auto), column-gutter: 6pt, align: (left + bottom, right + bottom),
    {
      text(weight: "bold", fill: heavy)[#e.degree]
      [  ]
      text(size: 8pt, fill: muted)[#e.school]
    },
    text(size: 8pt, fill: muted, style: "italic")[#e.dates],
  )
}

#let pubBlock = {
  let p = data.publications
  grid(
    columns: (1fr, auto), column-gutter: 8pt, align: (left + top, right + top),
    text(weight: "bold", fill: heavy)[#p.title],
    box(width: 5.2cm)[
      #align(right)[
        #text(fill: accent, style: "italic")[#p.journal]
        #h(4pt)
        #text(size: 8pt, fill: muted)[#p.year]
      ]
    ],
  )
  v(1pt)
  text(size: 7.4pt, fill: muted)[#p.authors]
}

#let skillsBlock = {
  for row in cvv.skills {
    block(above: 0pt, below: 2.2pt, breakable: false)[
      #grid(
        columns: (62pt, 1fr), column-gutter: 9pt, align: (right + top, left + top),
        text(fill: if plain { heavy } else { accent }, size: 8pt, weight: "medium")[#row.at(0)],
        [#segs(row.at(1))],
      )
    ]
  }
}

// --- assemble ----------------------------------------------------------------

#header
#v(6pt)

#text(size: 8.7pt, fill: ink)[#segs(cvv.intro)]

#if cvv.howIWork != none { howBox }

#sectionHeading(cvv.headings.experience)
#for sec in cvv.sections { jobEntry(sec) }

#sectionHeading(cvv.headings.education)
#eduBlock

#sectionHeading(cvv.headings.publications)
#pubBlock

#sectionHeading(cvv.headings.skills)
#skillsBlock
