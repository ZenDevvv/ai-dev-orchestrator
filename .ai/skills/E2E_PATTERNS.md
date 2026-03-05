# E2E Patterns (Playwright)

## Purpose

Defines stable Phase 11 Playwright integration patterns so generated frontend code is validated against a live backend before deployment phases.

## Rules

1. Use Playwright (`@playwright/test`) for all E2E suites.
2. Keep all E2E specs under `templates/app/tests/e2e/`.
3. Tag every Phase 11 integration test title with `@phase11-live`.
4. Prefer user-facing selectors first (`getByRole`, `getByLabel`, visible text) before CSS selectors.
5. Every critical flow must include at least one happy-path test and one error-path test.
6. Capture runtime regressions by failing tests on uncaught `pageerror` events.
7. Do not assert on implementation details (no internal React state assertions).
8. Run against a live backend for core API flows. Do not mock the main module APIs in Phase 11.

## Baseline Setup

- `templates/app/playwright.config.ts` defines:
  - `testDir: tests/e2e`
  - `webServer` startup command for local frontend
  - `baseURL` for route navigation
  - Chromium desktop project
- Required scripts in `templates/app/package.json`:
  - `test:e2e`
  - `test:e2e:ui`
  - `test:e2e:headed`
  - `test:e2e:report`

## Required Flows

1. Public route loads (`/`)
2. Auth entry route loads (`/login`)
3. Role-protected flow denies unauthorized users
4. At least one create -> list -> update -> delete flow across modules

## Execution Gate

From `templates/app/`, run:

```bash
npm run typecheck
npm run build
npm run test:e2e -- --grep @phase11-live
```

All three must pass before considering Phase 11 complete.
