import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { estimateSkyState, Forecast, TemperatureUnit } from '../models/forecast';

// Field names fixed by the weather-api contract; translated here so they never leak into the app
interface ForecastDto {
  mediaTemperatura: number;
  unidadTemperatura: TemperatureUnit;
  probPrecipitacion: { probabilidad: number; periodo: string }[];
}

@Service()
export class ForecastApi {
  /** Reactive forecast: re-runs whenever the municipality or the unit change; no request without a municipality. */
  tomorrow(municipalityCode: () => string | undefined, unit: () => TemperatureUnit | null) {
    return httpResource(
      () => {
        const code = municipalityCode();
        if (!code) return undefined;
        const selectedUnit = unit();
        return {
          url: `/api/municipalities/${code}/forecast`,
          params: selectedUnit ? { unit: selectedUnit } : undefined,
        };
      },
      { parse: (raw) => toForecast(raw as ForecastDto) },
    );
  }
}

function toForecast(dto: ForecastDto): Forecast {
  const precipitation = dto.probPrecipitacion.map(({ probabilidad, periodo }) => ({
    period: periodo,
    probability: probabilidad,
  }));
  return {
    averageTemperature: dto.mediaTemperatura,
    unit: dto.unidadTemperatura,
    precipitation,
    sky: estimateSkyState(precipitation),
  };
}
