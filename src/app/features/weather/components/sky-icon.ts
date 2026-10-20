import { Component, computed, input } from '@angular/core';
import { SkyState } from '../models/forecast';

const LABELS: Record<SkyState, string> = {
  sunny: 'Soleado',
  'partly-cloudy': 'Parcialmente nuboso',
  cloudy: 'Nuboso',
  rainy: 'Lluvioso',
};

/**
 * One drawing with three layers (sun, cloud, rain); the state only decides which layers show,
 * so switching states animates the cloud in front of the sun instead of swapping images.
 */
@Component({
  selector: 'app-sky-icon',
  host: { '[class]': 'sky()' },
  template: `
    <svg viewBox="12 10 100 100" role="img" [attr.aria-label]="label()">
      <g class="sun">
        @for (angle of rays; track angle) {
          <line x1="50" y1="23" x2="50" y2="15" [attr.transform]="'rotate(' + angle + ' 50 48)'" />
        }
        <circle cx="50" cy="48" r="17" />
      </g>
      <g class="cloud">
        <circle cx="49" cy="76" r="14" />
        <circle cx="68" cy="64" r="20" />
        <circle cx="87" cy="76" r="12" />
        <rect x="35" y="72" width="64" height="18" rx="9" />
      </g>
      <g class="drops">
        <line x1="52" y1="98" x2="49" y2="106" />
        <line x1="68" y1="98" x2="65" y2="106" />
        <line x1="84" y1="98" x2="81" y2="106" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: block;
      aspect-ratio: 1;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    g {
      transition:
        transform 0.7s var(--ease-out),
        opacity 0.5s ease;
    }

    .sun {
      transform-origin: 50px 48px;
      fill: var(--sun);
      stroke: var(--sun);
      stroke-width: 4;
      stroke-linecap: round;
    }

    .cloud {
      transform-origin: 67px 72px;
      fill: var(--cloud);
      transition:
        transform 0.7s var(--ease-out),
        opacity 0.5s ease,
        fill 0.5s ease;
    }

    .drops {
      stroke: var(--rain);
      stroke-width: 4;
      stroke-linecap: round;
      opacity: 0;
    }

    :host(.sunny) .cloud {
      opacity: 0;
      transform: translate(18px, 6px);
    }

    :host(.partly-cloudy) .sun {
      transform: translate(-6px, -6px);
    }

    :host(.cloudy) .sun,
    :host(.rainy) .sun {
      opacity: 0;
      transform: translate(-6px, -6px) scale(0.7);
    }

    :host(.cloudy) .cloud,
    :host(.rainy) .cloud {
      transform: translate(-6px, -6px) scale(1.15);
    }

    :host(.rainy) .cloud {
      fill: var(--cloud-dark);
    }

    :host(.rainy) .drops {
      opacity: 1;
    }

    :host(.rainy) .drops line {
      animation: fall 1.4s linear infinite;
    }

    :host(.rainy) .drops line:nth-child(2) {
      animation-delay: 0.45s;
    }

    :host(.rainy) .drops line:nth-child(3) {
      animation-delay: 0.9s;
    }

    @keyframes fall {
      0% {
        transform: translate(1px, -4px);
        opacity: 0;
      }
      30% {
        opacity: 1;
      }
      100% {
        transform: translate(-2px, 8px);
        opacity: 0;
      }
    }
  `,
})
export class SkyIcon {
  readonly sky = input.required<SkyState>();

  protected readonly label = computed(() => LABELS[this.sky()]);
  protected readonly rays = [0, 45, 90, 135, 180, 225, 270, 315];
}
