// Date arithmetic for "Mon YYYY – Mon YYYY|Present" ranges (spaced en dash).

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

interface YearMonth {
  y: number;
  m: number;
}

/** "Dec 2022 – Feb 2026" → ["Dec 2022", "Feb 2026"]. */
export function splitRange(dates: string): [string, string | undefined] {
  const [from, to] = dates.split('–').map((s) => s.trim());
  return [from, to];
}

export function parseMonth(s: string): YearMonth | null {
  const m = s.trim().match(/^([A-Z][a-z]{2})\w*\s+(\d{4})$/);
  if (!m || !(m[1] in MONTHS)) return null;
  return { y: Number(m[2]), m: MONTHS[m[1]] };
}

// "Dec 2022 – Feb 2026" → "3 yr 3 mo", computed at build time so tenure is
// readable at a glance without mental date arithmetic. Inclusive month count
// (the LinkedIn convention); "Present" resolves to the build date.
// Returning null is also the build's date validity check — see build.ts.
export function duration(dates: string): string | null {
  const [from, to] = splitRange(dates);
  const start = parseMonth(from);
  const now = new Date();
  const end = /present/i.test(to || '')
    ? { y: now.getFullYear(), m: now.getMonth() + 1 }
    : parseMonth(to ?? '');
  if (!start || !end) return null;
  const months = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  if (months <= 0) return null;
  const y = Math.floor(months / 12);
  const mo = months % 12;
  return [y ? `${y} yr` : null, mo ? `${mo} mo` : null].filter(Boolean).join(' ');
}

// Compact forms for data columns — "Dec 2022" → "Dec 22", "3 yr 3 mo" →
// "3y 3m" — so a range and its derived tenure share one line.
export const shortRange = (d: string): string => d.replace(/\b20(\d\d)\b/g, '$1');
export const compactDur = (d: string | null): string | null =>
  d && d.replace(/(\d+) yr/, '$1y').replace(/(\d+) mo/, '$1m');
