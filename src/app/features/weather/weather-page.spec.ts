import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherPage } from './weather-page';

describe('WeatherPage', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<WeatherPage>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [WeatherPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  function createPage() {
    fixture = TestBed.createComponent(WeatherPage);
  }

  it.each([
    [404, 'todavía no ha publicado la predicción de mañana para Agost'],
    [503, 'limita las consultas por minuto'],
    [502, 'no responde ahora mismo'],
  ])('explains a %i from the API', async (status, message) => {
    createPage();
    fixture.componentInstance['municipality'].set({ code: '03002', name: 'Agost' });
    // tick, not whenStable: the app only becomes stable once the pending request is answered
    TestBed.tick();

    http
      .expectOne('/api/municipalities/03002/forecast')
      .flush(null, { status, statusText: 'Error' });
    await fixture.whenStable();

    const alert = (fixture.nativeElement as HTMLElement).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain(message);
  });

  it('loads the last search on start and remembers new choices', async () => {
    localStorage.setItem(
      'weather.last-search',
      JSON.stringify({ municipality: { code: '03002', name: 'Agost' }, unit: 'G_FAH' }),
    );
    createPage();
    TestBed.tick();

    http.expectOne('/api/municipalities/03002/forecast?unit=G_FAH').flush({
      mediaTemperatura: 67.1,
      unidadTemperatura: 'G_FAH',
      probPrecipitacion: [],
    });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h2')?.textContent).toContain('Agost');

    fixture.componentInstance['unit'].set('G_CEL');
    TestBed.tick();
    http.expectOne('/api/municipalities/03002/forecast?unit=G_CEL');
    expect(JSON.parse(localStorage.getItem('weather.last-search')!).unit).toBe('G_CEL');
  });
});
