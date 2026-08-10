// The two variants: which bullets, what intro, which theme.
// Each entry: { file, label, theme, layout, intro, sections, headings }
// The design trail that led here — prototypes, reimaginings, background
// studies — lives in git history and DESIGN.md.
import { intros } from './lib/content.mjs';

export const variants = [
  // THE FLAGSHIP — the canonical variant, promoted from Prototype B.
  // Strict modernist grid: hard left meta-column (company / blurb / location
  // / dates / tenure as a data column) against a right content column,
  // visible structural asymmetry, one functional accent (emerald).
  // Müller-Brockmann. The braces identity rendered as quiet structure — mono
  // braces in the muted data ink around name and section labels.
  // The generalist thesis, per the owner: not a client engineer, not a
  // full-stack engineer — an engineer who takes up whatever role the product
  // needs.
  {
    file: 'eugene-lerman',
    label: 'The Flagship · Modernist Grid',
    theme: 'proto-b',
    layout: 'grid',
    bodyClass: 'g-dense',
    // The Manifest background: micro-caps labels in the grid dialect, with
    // the STACK row subdividing into frontend / backend / infra (keys in
    // content/skills.md).
    stackRows: [
      ['frontend', 'stackFrontend'],
      ['backend', 'stackBackend'],
      ['infra', 'stackInfra'],
    ],
    intro: intros.flagship,
    headings: { experience: 'Experience', background: 'Background' },
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'secondAuth'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
  },

  // THE SHELL — the Session aesthetic, whole-page: the entire CV as one
  // terminal window. Commands are the structure; see terminal.css.
  {
    file: 'eugene-lerman-shell',
    label: 'The Shell · full-page terminal session',
    theme: 'terminal',
    layout: 'terminal',
    // Capability-first README (the 7-second-scan finding): range up
    // top; the curious-reader line stays on the flagship.
    intro: intros.shell,
    offHours: ['k3s home lab', 'home automation', 'other over-engineering'],
    headings: { experience: 'Experience', background: 'Background' },
    // Content parity with the flagship (owner decree): same bullet set,
    // same summaries; the terminal look does the calming, not cuts.
    sections: [
      { job: 'rylo', bullets: ['rewrite', 'platform', 'release'] },
      { job: 'remitlyStaff', bullets: ['lead', 'l10n', 'semanticKeys'] },
      { job: 'remitlySenior', bullets: ['reactNative', 'xstate', 'secondAuth'] },
      { job: 'wix', bullets: ['forms', 'auth'] },
    ],
  },
];
