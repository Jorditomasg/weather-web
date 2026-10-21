import { inject, Service } from '@angular/core';
import { BrowserStorage } from '@core/browser-storage';
import { TemperatureUnit } from '../models/forecast';
import { Municipality } from '../models/municipality';

export interface LastSearch {
  municipality: Municipality;
  unit: TemperatureUnit | null;
}

const KEY = 'weather.last-search';

@Service()
export class LastSearchStore {
  private readonly storage = inject(BrowserStorage);

  /** The stored value may be stale or hand-edited, so anything that is not a valid search is ignored. */
  load(): LastSearch | null {
    const value = this.storage.read(KEY);
    return isLastSearch(value) ? value : null;
  }

  save(search: LastSearch): void {
    this.storage.write(KEY, search);
  }
}

function isLastSearch(value: unknown): value is LastSearch {
  const search = value as Partial<LastSearch> | null;
  return (
    typeof search?.municipality?.code === 'string' &&
    typeof search.municipality.name === 'string' &&
    (search.unit === null || search.unit === 'G_CEL' || search.unit === 'G_FAH')
  );
}
