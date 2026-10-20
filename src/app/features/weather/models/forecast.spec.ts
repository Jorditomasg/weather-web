import { estimateSkyState, SkyState } from './forecast';

describe('estimateSkyState', () => {
  it.each<[number, SkyState]>([
    [0, 'sunny'],
    [10, 'sunny'],
    [11, 'partly-cloudy'],
    [40, 'partly-cloudy'],
    [41, 'cloudy'],
    [70, 'cloudy'],
    [71, 'rainy'],
    [100, 'rainy'],
  ])('uses the highest chance of rain of the day: %i%% → %s', (probability, sky) => {
    expect(
      estimateSkyState([
        { period: '00-06', probability: 0 },
        { period: '12-18', probability },
      ]),
    ).toBe(sky);
  });

  it('is sunny when there is no precipitation data', () => {
    expect(estimateSkyState([])).toBe('sunny');
  });
});
