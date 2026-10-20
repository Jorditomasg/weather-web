import { Component, model } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TemperatureUnit } from '../models/forecast';

@Component({
  selector: 'app-unit-select',
  imports: [MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field appearance="outline" subscriptSizing="dynamic">
      <mat-label>Unidad</mat-label>
      <mat-select [value]="unit()" (valueChange)="unit.set($event)">
        <mat-option [value]="null">—</mat-option>
        <mat-option value="G_CEL">°C</mat-option>
        <mat-option value="G_FAH">°F</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: `
    :host {
      display: block;
    }

    mat-form-field {
      width: 100%;
    }
  `,
})
export class UnitSelect {
  readonly unit = model<TemperatureUnit | null>(null);
}
