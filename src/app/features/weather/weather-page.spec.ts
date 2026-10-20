import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherPage } from './weather-page';

describe('WeatherPage', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<WeatherPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeatherPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WeatherPage);
  });

  it.each([
    [404, 'todavía no ha publicado la predicción de mañana para Agost'],
    [503, 'limita las consultas por minuto'],
    [502, 'no responde ahora mismo'],
  ])('explains a %i from the API', async (status, message) => {
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
});
