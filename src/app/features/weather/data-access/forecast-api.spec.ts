import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TemperatureUnit } from '../models/forecast';
import { ForecastApi } from './forecast-api';

describe('ForecastApi', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function tomorrow(code: string | undefined, unit: TemperatureUnit | null) {
    return TestBed.runInInjectionContext(() =>
      TestBed.inject(ForecastApi).tomorrow(signal(code), signal(unit)),
    );
  }

  it('maps the contract fields to the domain model', async () => {
    const forecast = tomorrow('03002', 'G_FAH');
    TestBed.tick();

    http.expectOne('/api/municipalities/03002/forecast?unit=G_FAH').flush({
      mediaTemperatura: 66.7,
      unidadTemperatura: 'G_FAH',
      probPrecipitacion: [{ probabilidad: 5, periodo: '00-06' }],
    });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(forecast.value()).toEqual({
      averageTemperature: 66.7,
      unit: 'G_FAH',
      precipitation: [{ period: '00-06', probability: 5 }],
      sky: 'sunny',
    });
  });

  it('lets the API apply its default unit when none is selected', () => {
    tomorrow('03002', null);
    TestBed.tick();

    http.expectOne('/api/municipalities/03002/forecast');
  });

  it('does not call the API without a municipality', () => {
    tomorrow(undefined, 'G_CEL');
    TestBed.tick();

    http.expectNone(() => true);
  });
});
