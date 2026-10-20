import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { Municipality } from '../models/municipality';

// Field names fixed by the weather-api contract; translated here so they never leak into the app
interface MunicipalityDto {
  codigo: string;
  nombre: string;
}

@Service()
export class MunicipalityApi {
  /** Reactive search: re-runs whenever `name` changes; no request while it returns undefined. */
  search(name: () => string | undefined) {
    return httpResource(
      () => {
        const prefix = name();
        return prefix ? { url: '/api/municipalities', params: { name: prefix } } : undefined;
      },
      {
        defaultValue: [],
        parse: (raw) =>
          (raw as MunicipalityDto[]).map(({ codigo, nombre }): Municipality => ({ code: codigo, name: nombre })),
      },
    );
  }
}
