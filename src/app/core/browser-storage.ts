import { Service } from '@angular/core';

/**
 * JSON over localStorage that never throws: private mode, blocked site data or a full quota
 * just mean nothing is remembered, never a broken page.
 */
@Service()
export class BrowserStorage {
  read(key: string): unknown {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Remembering is a convenience: if the browser refuses, the app keeps working without it
    }
  }
}
