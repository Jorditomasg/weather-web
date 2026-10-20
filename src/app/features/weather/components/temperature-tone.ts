export interface TemperatureTone {
  hue: number;
  chroma: number;
}

const MILD_CELSIUS = 17;
const COLD_HUE = 240;
// [celsius, OKLCH hue] for warm temperatures: amber, then orange, then red
const WARM_STOPS: [number, number][] = [
  [MILD_CELSIUS, 75],
  [28, 55],
  [38, 28],
];

/**
 * Blue below the mild point, amber to red above it. The further from mild, the more saturated,
 * so a pleasant day reads soft and a heatwave or a frost reads loud.
 */
export function temperatureTone(celsius: number): TemperatureTone {
  const chroma = 0.6 + 0.4 * Math.min(1, Math.abs(celsius - MILD_CELSIUS) / 13);
  return { hue: celsius < MILD_CELSIUS ? COLD_HUE : warmHue(celsius), chroma };
}

function warmHue(celsius: number): number {
  for (let i = 1; i < WARM_STOPS.length; i++) {
    const [toCelsius, toHue] = WARM_STOPS[i];
    if (celsius <= toCelsius) {
      const [fromCelsius, fromHue] = WARM_STOPS[i - 1];
      return fromHue + ((toHue - fromHue) * (celsius - fromCelsius)) / (toCelsius - fromCelsius);
    }
  }
  return WARM_STOPS[WARM_STOPS.length - 1][1];
}
