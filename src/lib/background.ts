// The background facts both layouts print, in their shared parsed forms.
import { education, person, publication } from './content.ts';

/** langLevels ("English and Hebrew=natively; …") → [[name, level]]. The
 * pair separator is ';' so a level may contain a comma. */
export const langPairs: [string, string][] = person.langLevels.split(';').map((pair) => {
  const [k = '', v = ''] = pair.split('=').map((s) => s.trim());
  return [k, v];
});

/** "2013 – 2017" → "2013–2017" (the tight range form both layouts print). */
export const eduYears: string = education.dates.replace(/\s*–\s*/, '–');

/** The paper's short title: everything before the subtitle colon. */
export const pubTitle: string = publication.title.split(':')[0] ?? publication.title;
