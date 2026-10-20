import { Component, debounced, inject, signal } from '@angular/core';
import { MunicipalitySearch } from './components/municipality-search';
import { MunicipalityApi } from './data-access/municipality-api';
import { Municipality } from './models/municipality';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

@Component({
  selector: 'app-weather-page',
  imports: [MunicipalitySearch],
  template: `
    <main>
      <h1>El tiempo de mañana</h1>
      <app-municipality-search
        [options]="municipalities.value()"
        (queryChange)="query.set($event)"
        [(selected)]="municipality"
      />
    </main>
  `,
})
export class WeatherPage {
  protected readonly municipality = signal<Municipality | null>(null);
  protected readonly query = signal('');

  private readonly term = debounced(() => this.query().trim(), DEBOUNCE_MS);

  protected readonly municipalities = inject(MunicipalityApi).search(() => {
    const term = this.term.value();
    return term && term.length >= MIN_CHARS ? term : undefined;
  });
}
