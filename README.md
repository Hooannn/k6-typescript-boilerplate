# k6 TypeScript Boilerplate

Reusable k6 starter with:

- TypeScript-first authoring
- Bundled test artifacts for plain `k6 run`
- Shared helpers for config, HTTP requests, checks, and scenarios
- Example HTTP, API, and browser tests
- Clear structure for extension in larger performance test suites

## Requirements

- Node.js 20+
- pnpm or yarn
- `k6` installed locally for execution, or Docker as an alternative runner

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm bundle
```

Run a bundled test:

```bash
k6 run dist/tests/smoke.js
```

Or use the helper scripts:

```bash
pnpm test:smoke
pnpm test:api
pnpm test:browser
```

## Project structure

```text
.
|-- src
|   |-- config
|   |   |-- env.ts
|   |   `-- options.ts
|   |-- fixtures
|   |   `-- users.ts
|   |-- lib
|   |   |-- checks.ts
|   |   |-- http.ts
|   |   `-- sleep.ts
|   |-- scenarios
|   |   |-- api
|   |   |   `-- auth.ts
|   |   `-- web
|   |       `-- homepage.ts
|   `-- tests
|       |-- api.load.ts
|       |-- browser.smoke.ts
|       `-- smoke.ts
`-- scripts
    |-- archive.mjs
    |-- build.mjs
    `-- run-k6.mjs
```

## Workflow

1. Write or update tests in `src/tests/*.ts`.
2. Put reusable flows in `src/scenarios`.
3. Keep common transport, assertions, and utilities in `src/lib`.
4. Bundle TypeScript into `dist/tests/*.js` with `pnpm bundle` or `yarn bundle`.
5. Run the output with `k6 run dist/tests/<file>.js`.

## Environment variables

The tests read runtime configuration from `__ENV`, so you can pass variables from your shell, CI, or `.env` loader of choice.

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://test.k6.io` | Base URL for web smoke tests |
| `API_BASE_URL` | `https://test-api.k6.io` | Base URL for API tests |
| `API_USERNAME` | empty | Optional API username override |
| `API_PASSWORD` | empty | Optional API password override |
| `K6_BROWSER_HEADLESS` | `true` | Headless browser toggle |
| `K6_BROWSER_TIMEOUT` | `60s` | Timeout for browser navigation, accepts `ms`, `s`, or `m` |

Example:

```bash
BASE_URL=https://example.com k6 run dist/tests/smoke.js
```

## Common commands

```bash
pnpm typecheck
pnpm bundle
pnpm archive
```

`pnpm archive` creates `.tmp/k6-bundle.tar`, which is useful when you need a single artifact for CI or remote execution.

## Extending the boilerplate

### Add a new test

Create `src/tests/checkout.load.ts`:

```ts
import type { Options } from "k6/options";
import { createStagesOptions } from "@/config/options";
import { runCheckoutFlow } from "@/scenarios/web/checkout";

export const options: Options = createStagesOptions([
  { duration: "30s", target: 10 },
  { duration: "1m", target: 10 },
  { duration: "30s", target: 0 },
]);

export default function checkoutLoad(): void {
  runCheckoutFlow();
}
```

Then bundle and run:

```bash
pnpm bundle
k6 run dist/tests/checkout.load.js
```

### Add shared test data

- Put static fixtures in `src/fixtures`.
- For generated payloads, add small builders near the scenario that uses them.

### Add thresholds or custom executors

Use the helpers in `src/config/options.ts` as defaults, then override as needed per test:

```ts
export const options: Options = createBaseOptions({
  scenarios: {
    constant_rate: {
      executor: "constant-arrival-rate",
      rate: 20,
      timeUnit: "1s",
      duration: "2m",
      preAllocatedVUs: 10,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
});
```

## CI notes

- Run `pnpm install --frozen-lockfile` or `yarn install --immutable`
- Run `pnpm bundle` or `yarn bundle`
- Publish `dist/` or `.tmp/k6-bundle.tar`
- Execute `k6 run` from the built artifact

## Docker alternative

If `k6` is not installed locally:

```bash
pnpm bundle
docker run --rm -i \
  -e BASE_URL \
  -v "$PWD/dist:/dist" \
  grafana/k6 run /dist/tests/smoke.js
```

## Notes

- `k6` itself executes JavaScript bundles, so TypeScript support is provided at build time.
- Source maps are enabled in the bundle step for easier debugging.
- Browser tests require a `k6` build with browser support.
