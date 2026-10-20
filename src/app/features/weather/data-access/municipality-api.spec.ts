import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MunicipalityApi } from './municipality-api';

describe('MunicipalityApi', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps the contract fields to the domain model', async () => {
    const name = signal<string | undefined>('Ag');
    const results = TestBed.runInInjectionContext(() => TestBed.inject(MunicipalityApi).search(name));
    TestBed.tick();

    http
      .expectOne('/api/municipalities?name=Ag')
      .flush([{ codigo: '03002', nombre: 'Agost' }]);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(results.value()).toEqual([{ code: '03002', name: 'Agost' }]);
  });

  it('does not call the API without a prefix', () => {
    const name = signal<string | undefined>(undefined);
    const results = TestBed.runInInjectionContext(() => TestBed.inject(MunicipalityApi).search(name));
    TestBed.tick();

    http.expectNone(() => true);
    expect(results.value()).toEqual([]);
  });
});
