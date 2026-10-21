# weather-web

Angular front end to check tomorrow's weather forecast for any municipality in Spain. It consumes [weather-api](https://github.com/Jorditomasg/weather-api), which talks to AEMET.

## Requirements

- Node 26 (the version CI uses) and npm
- [weather-api](https://github.com/Jorditomasg/weather-api) running on `http://localhost:8080`

## Running locally

1. Start the API (see its README):

   ```bash
   cd weather-api
   cp .env.example .env          # then paste your AEMET API key
   ./mvnw spring-boot:run
   ```

2. In another terminal, start the front end:

   ```bash
   cd weather-web
   npm install
   npm start
   ```

3. Open http://localhost:4200

The dev server proxies `/api` to `http://localhost:8080` (`proxy.conf.json`), so there is no CORS setup and no hard-coded API URL.

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm start`     | Dev server with live reload and the API proxy |
| `npm test`      | Unit tests (Vitest + jsdom), in watch mode    |
| `npm run lint`  | ESLint, including the architecture rules      |
| `npm run build` | Production build into `dist/`                 |

Tests never call the API: HTTP is simulated with `HttpTestingController`. Lint, tests and build run on every push and pull request through GitHub Actions.

## Features

- Municipality autocomplete (Angular Material) backed by the API search, debounced.
- Optional temperature unit (°C / °F), empty by default.
- Any change in either field refreshes the forecast; while a new unit loads, the previous forecast stays on screen.
- The last search is remembered (`localStorage`) and its forecast loads on the next visit.
- Clear messages when AEMET is unavailable or its usage limit is reached.

## Architecture

Organised by feature, with container and presentational components:

```
src/app
├── core/                    App-wide singletons (BrowserStorage)
└── features/weather/
    ├── weather-page.ts      Container: state (signals) and data-access calls
    ├── components/          Presentational: data in through inputs, events out
    ├── data-access/         HTTP clients and storage; API field names are translated here
    └── models/              Types and pure functions, no Angular
```

- **The API contract stays at the edge.** The Spanish field names (`mediaTemperatura`, `probPrecipitacion`…) are mapped in `data-access/`, so the rest of the app only sees its own models.
- **Boundaries are enforced by ESLint**, so breaking them fails `npm run lint` in CI:
  - Presentational components cannot import from `data-access/`.
  - Leaving a feature must go through the `@core/`, `@shared/` or `@features/` aliases.
- **Reactivity with signals:** the forecast is an `httpResource` that re-runs when the municipality or the unit change, with no manual subscriptions.
