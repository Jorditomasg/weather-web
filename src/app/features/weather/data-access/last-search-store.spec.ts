import { TestBed } from '@angular/core/testing';
import { LastSearchStore } from './last-search-store';

describe('LastSearchStore', () => {
  let store: LastSearchStore;

  beforeEach(() => {
    localStorage.clear();
    store = TestBed.inject(LastSearchStore);
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns what was saved', () => {
    const search = { municipality: { code: '03002', name: 'Agost' }, unit: 'G_FAH' as const };
    store.save(search);

    expect(store.load()).toEqual(search);
  });

  it('returns nothing when nothing was saved', () => {
    expect(store.load()).toBeNull();
  });

  it.each([
    ['corrupt JSON', '{not json'],
    ['a different shape', '{"municipality":"Agost"}'],
    ['an unknown unit', '{"municipality":{"code":"03002","name":"Agost"},"unit":"G_KEL"}'],
  ])('ignores %s', (_, raw) => {
    localStorage.setItem('weather.last-search', raw);

    expect(store.load()).toBeNull();
  });

  it('keeps working when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });

    expect(() => store.save({ municipality: { code: '03002', name: 'Agost' }, unit: null })).not.toThrow();
    expect(store.load()).toBeNull();
  });
});
