# Working in this repo

Four things here will bite you, and none of them are visible in a diff.

**The PDF is the product, and it is pixel-tuned.** Each variant must fit one
A4 page; the build fails if it doesn't. Before and after any refactor, run
`npm run build` and compare `dist/html/*.html` byte-for-byte. Same HTML plus
the same browser means the same PDF, so that comparison is the proof — it is
faster and stricter than diffing PDFs. If the HTML changes, the change was
not a refactor, and it needs looking at rather than asserting past.

**Non-breaking spaces are load-bearing.** They hold two-word chips together
and keep the shell's padded key column from wrapping. Always write them as
`'\u00A0'`, never as the raw character: raw, they are indistinguishable from
a space, and a trailing-whitespace trim or a retyped line silently reflows
the page with a green build. `build.ts` rejects raw ones in `src/`.

**The PDF is read by machines as well as people, and the two disagree.** A
glyph carries an outline and a claim about which character it is; renderers
use the first, résumé parsers the second. `scripts/text-layer.ts` rewrites the
second after Chromium prints — ligatures back to their letters, NBSP to a
space — so `Staff Software Engineer` matches a search for itself. It touches
no pixel and throws if it fixes nothing. Never put a fact on the page as
invisible text: white or sub-6pt type is what hidden-text scanners flag, and
absolutely-positioned text is painted last, so stream-order extractors report
it detached from everything around it. If artwork carries a fact, print the
fact as well.

**Node runs the TypeScript directly** (22.18+, native type stripping). So:
relative imports need explicit `.ts`/`.tsx` extensions, and no enums,
namespaces, decorators or parameter properties — anything needing code
generation rather than type erasure. `erasableSyntaxOnly` in `tsconfig.json`
enforces it, so `npm run check` will tell you.

Beyond that: content edits go in `content/`, never in components; the
loaders in `src/lib/content.ts` fail by name rather than dropping a fact
silently, and new content rules belong there or in `src/validate.ts` rather
than in a component. Commits follow Conventional Commits — commitlint runs
in a hook and again on every PR.
