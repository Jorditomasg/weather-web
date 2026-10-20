/**
 * Tomorrow's date in `timeZone`, e.g. "lunes, 26 de octubre".
 * Computed from the calendar date, not by adding 24 h, so it stays right on daylight-saving days.
 */
export function formatTomorrow(now: Date, timeZone: string): string {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone })
    .format(now)
    .split('-')
    .map(Number);
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1));
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(tomorrow);
}
