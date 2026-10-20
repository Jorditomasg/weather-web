import { temperatureTone } from './temperature-tone';

describe('temperatureTone', () => {
  it('is blue when cold and warm-coloured when hot', () => {
    expect(temperatureTone(5).hue).toBe(240);
    expect(temperatureTone(17).hue).toBe(75);
    expect(temperatureTone(38).hue).toBe(28);
  });

  it('interpolates the hue between warm stops', () => {
    expect(temperatureTone(33).hue).toBe(41.5);
  });

  it('is least saturated at the mild point and saturates towards extremes', () => {
    expect(temperatureTone(17).chroma).toBe(0.6);
    expect(temperatureTone(30).chroma).toBe(1);
    expect(temperatureTone(-10).chroma).toBe(1);
  });

  it('clamps above the scale', () => {
    expect(temperatureTone(50).hue).toBe(28);
  });
});
