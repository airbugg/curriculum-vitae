// Repairs the PDF text layer after Chromium prints, without touching a pixel.
//
// A PDF says two separate things about every glyph: which outline to paint,
// and which character that outline stands for (the font's ToUnicode CMap).
// Renderers read the first, résumé parsers read the second, and Skia writes
// the second in a form that is faithful to the typography and wrong for a
// reader. Two cases bite here:
//
//   ligatures  'Staff' is set with one ﬀ glyph, and Skia maps that glyph to
//              U+FB00. Extractors that trust ToUnicode — pdfminer.six, pypdf,
//              pdfplumber — yield 'Staﬀ Software Engineer', which does not
//              match a literal search for the job title.
//   NBSP       The rag-control U+00A0 that holds 'GitHub Actions' on one line
//              reaches the text layer verbatim, so the same literal search
//              misses it.
//
// A ToUnicode entry may map one glyph to a multi-character string, so both are
// fixed by rewriting the mapping alone: the painted glyph never changes, and
// the rendered page is byte-identical. Verified by rasterising before and after
// at 150dpi — 0 differing pixels on both variants.
import { readFileSync, writeFileSync } from 'node:fs';
import { PDFDocument, PDFRawStream, type PDFRef, decodePDFRawStream } from 'pdf-lib';

/**
 * Glyph codepoint → the UTF-16BE string it should extract as. Keys are what
 * Skia emits; values are what a reader means. Ligatures decompose to their
 * letters; the non-breaking space becomes an ordinary one.
 */
const REMAP: Record<string, string> = {
  FB00: '00660066', // ﬀ → ff
  FB01: '00660069', // ﬁ → fi
  FB02: '0066006C', // ﬂ → fl
  FB03: '006600660069', // ﬃ → ffi
  FB04: '00660066006C', // ﬄ → ffl
  '00A0': '0020', // no-break space → space
};

const CMAP_PATTERN = new RegExp(`<(${Object.keys(REMAP).join('|')})>`, 'gi');

/** Every ToUnicode CMap in the document, as decoded text keyed by its ref. */
function toUnicodeStreams(doc: PDFDocument): [ref: PDFRef, text: string][] {
  const found: [PDFRef, string][] = [];
  for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    let text: string;
    try {
      text = Buffer.from(decodePDFRawStream(obj).decode()).toString('latin1');
    } catch {
      continue; // not a stream we can decode; not a CMap either
    }
    if (text.includes('beginbfchar') || text.includes('beginbfrange')) found.push([ref, text]);
  }
  return found;
}

/**
 * Rewrites `pdf` in place so its text extracts as a reader would type it, and
 * stamps the document metadata. Returns the codepoints it remapped and the
 * page count, which the caller needs for the one-page invariant.
 *
 * Throws if any mapping survives the pass. Silently repairing nothing is the
 * failure this whole file exists to prevent: the build would stay green while
 * the job title quietly stopped matching a search for it.
 */
export async function repairTextLayer(
  pdf: string,
  meta: { author: string; subject: string },
): Promise<{ remapped: string[]; pages: number }> {
  const doc = await PDFDocument.load(readFileSync(pdf));
  const remapped = new Set<string>();

  for (const [ref, text] of toUnicodeStreams(doc)) {
    const fixed = text.replace(CMAP_PATTERN, (_, cp: string) => {
      const key = cp.toUpperCase() === '00A0' ? '00A0' : cp.toUpperCase();
      remapped.add(key);
      return `<${REMAP[key]}>`;
    });
    if (fixed !== text)
      doc.context.assign(ref, doc.context.flateStream(Buffer.from(fixed, 'latin1')));
  }

  // Neither is read by any ATS I could find documentation for, but they cost
  // nothing and a PDF reader shows them in Properties.
  doc.setAuthor(meta.author);
  doc.setSubject(meta.subject);

  const out = await doc.save();
  writeFileSync(pdf, out);

  const left = toUnicodeStreams(await PDFDocument.load(out)).flatMap(([, t]) => [
    ...t.matchAll(CMAP_PATTERN),
  ]);
  if (left.length)
    throw new Error(
      `${pdf}: ${left.length} unextractable codepoint(s) survived the text-layer pass: ` +
        [...new Set(left.map((m) => m[1]))].join(', '),
    );

  return { remapped: [...remapped].sort(), pages: doc.getPageCount() };
}
