import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Forecast } from '../models/forecast';
import { PrecipitationChart } from './precipitation-chart';
import { SkyIcon } from './sky-icon';

@Component({
  selector: 'app-forecast-card',
  imports: [DecimalPipe, PrecipitationChart, SkyIcon],
  template: `
    <h2>{{ municipality() }}</h2>
    <p class="date">{{ date() }}</p>

    <div class="today">
      <div>
        <p class="temperature">
          {{ forecast().averageTemperature | number: '1.0-1' }}<span class="unit">{{ unitSymbol() }}</span>
        </p>
        <p class="caption">Temperatura media</p>
      </div>
      <app-sky-icon [sky]="forecast().sky" />
    </div>

    <app-precipitation-chart [precipitation]="forecast().precipitation" />
  `,
  styles: `
    :host {
      display: block;
    }

    h2,
    .date,
    .today,
    app-precipitation-chart {
      animation: rise 0.6s var(--ease-out) backwards;
    }

    h2 {
      margin: 0;
      font-size: clamp(1.75rem, 5vw, 2.25rem);
      font-weight: 650;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .date {
      margin: 0.35rem 0 0;
      color: var(--muted);
      animation-delay: 80ms;
    }

    .date::first-letter {
      text-transform: uppercase;
    }

    .today {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-block: 1.75rem 2.25rem;
      animation-delay: 160ms;
    }

    .temperature {
      margin: 0;
      font-size: clamp(4.5rem, 17vw, 7.5rem);
      font-weight: 300;
      line-height: 0.9;
      letter-spacing: -0.05em;
      font-variant-numeric: tabular-nums;
      color: var(--accent);
      transition: color 1.2s ease;
    }

    .unit {
      margin-inline-start: 0.08em;
      font-size: 0.35em;
      font-weight: 400;
      letter-spacing: 0;
      vertical-align: 1.6em;
    }

    .caption {
      margin: 0.75rem 0 0;
      font-size: 0.9rem;
      color: var(--muted);
    }

    app-sky-icon {
      flex: none;
      width: clamp(6rem, 24vw, 8.5rem);
    }

    app-precipitation-chart {
      animation-delay: 240ms;
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(0.75rem);
      }
    }
  `,
})
export class ForecastCard {
  readonly municipality = input.required<string>();
  readonly date = input.required<string>();
  readonly forecast = input.required<Forecast>();

  protected readonly unitSymbol = computed(() => (this.forecast().unit === 'G_FAH' ? '°F' : '°C'));
}
