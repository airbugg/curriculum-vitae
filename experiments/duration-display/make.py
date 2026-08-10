#!/usr/bin/env python3
"""Build mockup.html: the flagship's Remitly entry in CURRENT vs PROPOSED
duration display, side by side (stacked at full line width, since the
busy-ness lives in full-width lines). Fonts are lifted from the built
flagship HTML so the mockup renders with the real Source Sans / Source Code
Pro. CSS below is copied (not imported) from src/themes/base.css +
looker.css — only the rules the entry actually uses.

CURRENT   role line:    Dec 2022 – Feb 2026 · 3 yr 3 mo
          company line: Tel Aviv · 5 yr 9 mo
PROPOSED  role line:    Dec 2022 – Feb 2026          (bare range)
          company line: Tel Aviv · 5 yr 9 mo         (single duration per company)
Plus the single-role case (Rylo): duration moves from the role line up to the
company line, so the rule stays uniform: company line answers "how long
here", role lines answer "exactly when".
"""
import re, pathlib

root = pathlib.Path(__file__).resolve().parents[2]
src = (root / 'dist/html/eugene-lerman.html').read_text()
fonts = '\n'.join(re.findall(r'@font-face\{[^}]*\}', src))

css = fonts + """
/* ---- copied from src/themes/base.css + looker.css (subset) ---- */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 9.2pt; line-height: 1.33; color: #232a32;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
  background: #fff;
}
.sheet { width: 210mm; padding: 8mm 16mm; }
.panel { margin-bottom: 7mm; }
.panel-label {
  font-family: 'Source Code Pro', monospace; font-size: 7pt;
  letter-spacing: 1pt; text-transform: uppercase; color: #8a94a0;
  border-bottom: 0.35pt solid #cfe0da; padding-bottom: 0.8mm; margin-bottom: 2.6mm;
}
.entry { break-inside: avoid; }
.entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; line-height: 1.15; }
.company { font-weight: 700; font-size: 9.5pt; color: #14181d; }
.blurb { margin-left: 1.8mm; font-size: 8pt; color: #5c6672; }
.dates {
  font-family: 'Source Code Pro', monospace; font-size: 8pt;
  color: #5c6672; white-space: nowrap; letter-spacing: -0.2pt;
}
.entry-sub { display: flex; justify-content: space-between; font-size: 8.5pt; margin-top: 0.4mm; line-height: 1.15; }
.entry-sub .role { font-weight: 600; color: #00806b; font-variant: small-caps; letter-spacing: 0.4pt; }
.entry-head > .loc { color: #00A388; font-style: italic; font-size: 8pt; white-space: nowrap; }
.entry .role-block + .role-block { margin-top: 2.4mm; }
.entry ul { margin: 1.3mm 0 0; padding-left: 3.2mm; }
.entry li { margin-bottom: 0.8mm; }
.entry li:last-child { margin-bottom: 0; }
.entry li::marker { color: #00A388; }
code {
  font-family: 'Source Code Pro', monospace; font-size: 86%;
  background: #eaf6f2; color: #29564b; padding: 0 1.1mm 0.15mm; border-radius: 0.6mm;
}
.dur { color: #5a6470; opacity: 0.85; }
.entry + .entry { margin-top: 3.4mm; }
"""

def dur_span(d):
    return '<span class="dur"> · ' + d + '</span>' if d else ''

def entry(company, blurb, loc, loc_dur, roles):
    head = (
        f'<div class="entry-head"><div class="entry-co">'
        f'<span class="company">{company}</span><span class="blurb">{blurb}</span></div>'
        f'<div class="loc">{loc}{dur_span(loc_dur)}</div></div>'
    )
    blocks = []
    for role, dates, dur, bullets in roles:
        d = f'{dates}{dur_span(dur)}'
        lis = ''.join(f'<li>{b}</li>' for b in bullets)
        blocks.append(
            f'<div class="role-block"><div class="entry-sub role-row">'
            f'<span class="role">{role}</span><span class="dates">{d}</span></div>'
            f'<ul>{lis}</ul></div>'
        )
    return f'<article class="entry group">{head}{"".join(blocks)}</article>'

B_LEAD = ('Lead engineer of the Client Infrastructure team: technical planning and '
          'cross-team initiatives across roughly ten teams and three products (~10M monthly users).')
B_L10N = ('Designed the localization platform: translations fetched dynamically, with hotfixes '
          'scoped to specific app versions in production, and a CI pipeline that extracts changed '
          'strings from each PR and files translator tasks automatically.')
B_RN = ('Led the migration of the core product from an <code>AngularJS</code> / <code>React</code> '
        'web app to <code>React Native</code>, the company’s first mobile-first architecture.')
B_RYLO = ('Was part of a four engineer task force working on a ground-up rewrite of the '
          'company’s client apps: a <code>React Native</code> backbone with native iOS and Android components.')

RM = dict(company='Remitly Israel (formerly Rewire)', blurb='cross-border banking &amp; remittances', loc='Tel Aviv')
RY = dict(company='Rylo', blurb='AI communication platform for the Deaf and hard-of-hearing', loc='Tel Aviv')

current = (
    entry(**RY, loc_dur=None, roles=[
        ('Software Engineer', 'Feb 2026 – Present', '7 mo', [B_RYLO])]) +
    entry(**RM, loc_dur='5 yr 9 mo', roles=[
        ('Staff Software Engineer · Client Infrastructure', 'Dec 2022 – Feb 2026', '3 yr 3 mo', [B_LEAD, B_L10N]),
        ('Senior Software Engineer', 'Jun 2020 – Dec 2022', '2 yr 7 mo', [B_RN])])
)
proposed = (
    entry(**RY, loc_dur='7 mo', roles=[
        ('Software Engineer', 'Feb 2026 – Present', None, [B_RYLO])]) +
    entry(**RM, loc_dur='5 yr 9 mo', roles=[
        ('Staff Software Engineer · Client Infrastructure', 'Dec 2022 – Feb 2026', None, [B_LEAD, B_L10N]),
        ('Senior Software Engineer', 'Jun 2020 – Dec 2022', None, [B_RN])])
)

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Duration display — current vs proposed</title><style>{css}</style></head><body>
<div class="sheet">
  <div class="panel"><div class="panel-label">Current — duration on every role line and company line</div>{current}</div>
  <div class="panel"><div class="panel-label">Proposed — one duration per company (on the company line); role lines keep bare ranges</div>{proposed}</div>
</div></body></html>"""

out = pathlib.Path(__file__).with_name('mockup.html')
out.write_text(html)
print(f'wrote {out} ({len(html)} bytes)')
