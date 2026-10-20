import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, debounced, inject, linkedSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ForecastCard } from './components/forecast-card';
import { MunicipalitySearch } from './components/municipality-search';
import { temperatureTone } from './components/temperature-tone';
import { UnitSelect } from './components/unit-select';
import { ForecastApi } from './data-access/forecast-api';
import { MunicipalityApi } from './data-access/municipality-api';
import { averageCelsius, Forecast, TemperatureUnit } from './models/forecast';
import { Municipality } from './models/municipality';
import { formatTomorrow } from './models/tomorrow';

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;
const TIME_ZONE = 'Europe/Madrid';

interface ShownForecast {
  municipality: Municipality;
  forecast: Forecast;
}

@Component({
  selector: 'app-weather-page',
  imports: [ForecastCard, MatButtonModule, MatProgressBarModule, MunicipalitySearch, UnitSelect],
  host: {
    '[style.--temp-hue]': 'tone()?.hue ?? 250',
    '[style.--temp-chroma]': 'tone()?.chroma ?? 0',
  },
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.scss',
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

  // While a new unit loads, keep showing the same municipality's forecast instead of blanking it
  protected readonly shown = linkedSignal<
    { municipality: Municipality | null; forecast: Forecast | undefined },
    ShownForecast | undefined
  >({
    source: () => ({
      municipality: this.municipality(),
      forecast: this.forecast.hasValue() ? this.forecast.value() : undefined,
    }),
    computation: ({ municipality, forecast }, previous) => {
      if (!municipality) return undefined;
      if (forecast) return { municipality, forecast };
      return previous?.value?.municipality.code === municipality.code ? previous.value : undefined;
    },
  });

  // A one-item list keyed by municipality: the card is recreated (and its entrance replays)
  // only when the municipality changes, not when the unit does
  protected readonly cards = computed(() => {
    const shown = this.shown();
    return shown ? [shown] : [];
  });

  // Re-evaluated with each new forecast, so the label stays right if the page is left open past midnight
  protected readonly tomorrow = computed(() => {
    this.shown();
    return formatTomorrow(new Date(), TIME_ZONE);
  });

  protected readonly tone = computed(() => {
    const forecast = this.shown()?.forecast;
    return forecast ? temperatureTone(averageCelsius(forecast)) : null;
  });

  protected readonly errorMessage = computed(() => {
    const error = this.forecast.error();
    if (!error) return null;
    return error instanceof HttpErrorResponse && error.status === 404
      ? `AEMET todavía no ha publicado la predicción de mañana para ${this.municipality()?.name}.`
      : 'AEMET no responde ahora mismo. Vuelve a intentarlo en unos segundos.';
  });
}
