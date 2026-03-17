Adopt the agent defined in `agents/qa-engineer.md`. Read it now before proceeding.

If `skills/E2E_PATTERNS.md` exists, read it and follow its conventions for selector strategy, fixture structure, and flow test patterns.

Read these context files before proceeding:
- BRD: `docs/brd.md` - full document for cross-module flows
- Architecture: `docs/architecture.md` - route map and auth strategy
- UI Design: `docs/ui-design.md` - user flow diagrams

Create Playwright E2E integration test suites in `templates/app/tests/e2e/`:
- Cover each user flow from the UI design
- Cover happy-path tests for all critical journeys
- Cover edge-case and error-path tests from BRD error states
- Cover cross-module integration tests (create -> list -> edit -> delete)
- Cover auth flow tests (login, logout, unauthorized access, role-based access)
- Tag each Phase 11 integration test title with `@phase11-live`

For every critical protected module with authenticated create, update, or delete routes, include live coverage for:
- login or register -> protected mutation succeeds
- protected mutation result is visible in the next read/list step
- logged-out or expired-session mutation attempt is denied with the expected user-facing behavior

Phase 11 is live-backend integration testing. Do not mock core API calls in this phase.
Do not count mocked login flows or stubbed auth responses as Phase 11 coverage.

## Mandatory Test Gate

Before running the gate, ensure the backend API is running and reachable by the frontend.

Run these commands in `templates/app/`:

```bash
npm run typecheck
npm run build
npm run test:e2e -- --grep @phase11-live
```

All E2E flows must pass against a running backend.

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

Record completion with:
- `Phase`: `11`
- `Name`: `E2E Tests`
- `Scope`: `-`
- `Status`: `✅ Complete`
- `Notes`: one-line summary including authenticated mutation coverage
