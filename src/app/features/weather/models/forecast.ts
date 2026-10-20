export type TemperatureUnit = 'G_CEL' | 'G_FAH';

export type SkyState = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';

export interface PrecipitationProbability {
  period: string;
  probability: number;
}

export interface Forecast {
  averageTemperature: number;
  unit: TemperatureUnit;
  precipitation: PrecipitationProbability[];
  sky: SkyState;
}

export function averageCelsius({ averageTemperature, unit }: Forecast): number {
  return unit === 'G_FAH' ? ((averageTemperature - 32) * 5) / 9 : averageTemperature;
}

// TODO: AEMET publishes the real sky state (`estadoCielo`). Once weather-api exposes it,
// map it in ForecastApi and remove this estimate based on the chance of rain.
export function estimateSkyState(precipitation: PrecipitationProbability[]): SkyState {
  const maxProbability = Math.max(0, ...precipitation.map(({ probability }) => probability));
  if (maxProbability <= 10) return 'sunny';
  if (maxProbability <= 40) return 'partly-cloudy';
  if (maxProbability <= 70) return 'cloudy';
  return 'rainy';
}
