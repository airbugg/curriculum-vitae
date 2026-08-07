// Company logos, inlined at build time from assets/logos/<slug>.{svg,png}.
// Two modes:
//   mark     — a small glyph rendered BEFORE the company name (Rylo swirl,
//              Remitly handshake, BGU flame).
//   wordmark — the logo IS the name (Wix, Rewire have no separate mark);
//              it renders IN PLACE of the printed company name, sized to
//              the company line's cap height.
// SVGs are inlined (viewBox only, fill="currentColor" where single-color,
// so they take the surrounding ink). PNGs become data URIs — fine for
// print at these sizes when the source is a few hundred px or more.
// A missing file degrades to the plain text name; dropping the file into
// assets/logos/ lights it up on the next build.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'assets', 'logos');
const load = (slug) => {
  const svg = join(dir, `${slug}.svg`);
  if (existsSync(svg)) return { type: 'svg', data: readFileSync(svg, 'utf8').trim() };
  const png = join(dir, `${slug}.png`);
  if (existsSync(png))
    return { type: 'png', data: `data:image/png;base64,${readFileSync(png).toString('base64')}` };
  return null;
};

// Keyed by the company string as it appears in content frontmatter, plus a
// special slot for the education footer.
export const logos = {
  Rylo: { mark: load('rylo') },
  Remitly: { mark: load('remitly') },
  Rewire: { wordmark: load('rewire') },
  'Wix.com': { wordmark: load('wix') },
  bgu: { mark: load('bgu') },
};
