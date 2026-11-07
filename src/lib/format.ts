/**
 * Date/number formatting helpers.
 *
 * All formatters pin UTC and take explicit ISO dates from our data —
 * nothing here reads the clock, so build output is deterministic and
 * the "honest last-read date" on every page is the date we actually
 * read the sources, never the build time.
 */

const UTC = 'UTC';

const longDateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: UTC,
});

const dayMonthFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  timeZone: UTC,
});

const monthYearFmt = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: UTC,
});

function parseIsoDate(iso: string): Date {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }
  return date;
}

/** "2026-11-06" -> "6 November 2026" */
export function formatDate(iso: string): string {
  return longDateFmt.format(parseIsoDate(iso));
}

/** "2026-11-06" -> "6 November" (year omitted, used inside ranges) */
function formatDayMonth(iso: string): string {
  return dayMonthFmt.format(parseIsoDate(iso));
}

/** "2026-11-06" -> "November 2026" (used for headline months) */
export function formatMonthYear(iso: string): string {
  return monthYearFmt.format(parseIsoDate(iso));
}

/**
 * Human range for a set of ISO dates, e.g. "30 October – 5 November 2026".
 * Single unique date collapses to "30 October 2026".
 */
export function formatDateRange(isos: string[]): string {
  const unique = [...new Set(isos)].sort();
  if (unique.length === 0) return '';
  if (unique.length === 1) return formatDate(unique[0]!);
  return `${formatDayMonth(unique[0]!)} – ${formatDate(unique[unique.length - 1]!)}`;
}

/** "1 reported active code" / "3 reported active codes" */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
