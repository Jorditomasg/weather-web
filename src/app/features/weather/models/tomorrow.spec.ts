import { formatTomorrow } from './tomorrow';

describe('formatTomorrow', () => {
  it('returns the next calendar day in the given time zone', () => {
    expect(formatTomorrow(new Date('2026-10-20T10:00:00Z'), 'Europe/Madrid')).toBe(
      'miércoles, 21 de octubre',
    );
  });

  it('uses the local date, not the UTC one, near midnight', () => {
    // 23:30 UTC on the 20th is already the 21st in Madrid
    expect(formatTomorrow(new Date('2026-10-20T23:30:00Z'), 'Europe/Madrid')).toBe(
      'jueves, 22 de octubre',
    );
  });

  it('is not fooled by the 25 hour day when clocks go back', () => {
    // 00:30 in Madrid on Sunday 25 October 2026; adding 24 h would still land on the 25th
    expect(formatTomorrow(new Date('2026-10-24T22:30:00Z'), 'Europe/Madrid')).toBe(
      'lunes, 26 de octubre',
    );
  });
});
