# E2E Patterns (Playwright)

## Purpose

Defines stable Playwright patterns for Phase 11 end-to-end coverage so generated frontend code is validated by real user flows before deployment phases.

## Rules

1. Use Playwright (`@playwright/test`) for all E2E suites.
2. Keep all E2E specs under `templates/app/tests/e2e/`.
3. Prefer user-facing selectors first (`getByRole`, `getByLabel`, visible text) before CSS selectors.
4. Every critical flow must include at least one happy-path test and one error-path test.
5. Capture runtime regressions by failing tests on uncaught `pageerror` events.
6. Do not assert on implementation details (no internal React state assertions).
7. Use deterministic test data or controlled API stubs for flaky external dependencies.

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
npm run test:e2e
```

All three must pass before considering Phase 11 complete.
