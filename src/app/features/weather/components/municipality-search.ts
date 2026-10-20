import { Component, input, linkedSignal, model, output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Municipality } from '../models/municipality';

@Component({
  selector: 'app-municipality-search',
  imports: [MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Municipio</mat-label>
      <input
        matInput
        [matAutocomplete]="auto"
        [value]="query()"
        (input)="onInput($any($event.target).value)"
      />
      <mat-autocomplete
        #auto
        [displayWith]="nameOf"
        (optionSelected)="selected.set($event.option.value)"
      >
        @for (municipality of options(); track municipality.code) {
          <mat-option [value]="municipality">{{ municipality.name }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class MunicipalitySearch {
  readonly options = input.required<Municipality[]>();
  readonly selected = model<Municipality | null>(null);
  readonly queryChange = output<string>();

  // Follows the selection (e.g. one restored from storage) but stays editable while typing
  protected readonly query = linkedSignal(() => this.selected()?.name ?? '');

  protected onInput(value: string) {
    this.query.set(value);
    this.queryChange.emit(value);
  }

  protected readonly nameOf = (municipality: Municipality | null) => municipality?.name ?? '';
}
