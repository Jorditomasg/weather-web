import { Component, debounced, inject, signal } from '@angular/core';
import { MunicipalitySearch } from './components/municipality-search';
import { UnitSelect } from './components/unit-select';
import { ForecastApi } from './data-access/forecast-api';
import { MunicipalityApi } from './data-access/municipality-api';
import { TemperatureUnit } from './models/forecast';
import { Municipality } from './models/municipality';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

@Component({
  selector: 'app-weather-page',
  imports: [MunicipalitySearch, UnitSelect],
  template: `
    <main>
      <h1>El tiempo de mañana</h1>
      <app-municipality-search
        [options]="municipalities.value()"
        (queryChange)="query.set($event)"
        [(selected)]="municipality"
      />
      <app-unit-select [(unit)]="unit" />

      @if (forecast.value(); as forecast) {
        <p>{{ forecast.averageTemperature }} {{ forecast.unit }} · {{ forecast.sky }}</p>
      }
    </main>
  `,
})
export class WeatherPage {
  protected readonly municipality = signal<Municipality | null>(null);
  protected readonly unit = signal<TemperatureUnit | null>(null);
  protected readonly query = signal('');

  private readonly term = debounced(() => this.query().trim(), DEBOUNCE_MS);

  protected readonly municipalities = inject(MunicipalityApi).search(() => {
    const term = this.term.value();
    return term && term.length >= MIN_CHARS ? term : undefined;
  });

  protected readonly forecast = inject(ForecastApi).tomorrow(
    () => this.municipality()?.code,
    () => this.unit(),
  );
}
