import { Component, input } from '@angular/core';
import { PrecipitationProbability } from '../models/forecast';

@Component({
  selector: 'app-precipitation-chart',
  template: `
    <h3 id="rain-title">Probabilidad de lluvia</h3>
    <ol aria-labelledby="rain-title">
      @for (item of precipitation(); track item.period; let i = $index) {
        <li
          [style.--p]="item.probability / 100"
          [style.--i]="i"
          [attr.aria-label]="'De ' + periodLabel(item.period) + ' h: ' + item.probability + ' %'"
        >
          <span class="value" aria-hidden="true">{{ item.probability }} %</span>
          <span class="track" aria-hidden="true"><span class="bar"></span></span>
          <span class="period" aria-hidden="true">{{ periodLabel(item.period) }}</span>
        </li>
      }
    </ol>
  `,
  styles: `
    :host {
      display: block;
    }

    h3 {
      margin: 0 0 1rem;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--muted);
    }

    ol {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: grid;
      grid-template-rows: auto 5rem auto;
      justify-items: center;
      gap: 0.5rem;
    }

    .value {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .track {
      display: block;
      width: 100%;
      max-width: 2.75rem;
      border-radius: 0.6rem;
      overflow: hidden;
      background: var(--rain-soft);
    }

    .bar {
      display: block;
      height: 100%;
      background: var(--rain);
      transform-origin: bottom;
      transform: scaleY(max(var(--p), 0.04));
      transition: transform 0.6s var(--ease-out);
      animation: grow 0.8s var(--ease-out) backwards;
      animation-delay: calc(450ms + var(--i) * 90ms);
    }

    .period {
      font-size: 0.85rem;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }

    @keyframes grow {
      from {
        transform: scaleY(0);
      }
    }
  `,
})
export class PrecipitationChart {
  readonly precipitation = input.required<PrecipitationProbability[]>();

  protected periodLabel(period: string) {
    return period.replace('-', '–');
  }
}
