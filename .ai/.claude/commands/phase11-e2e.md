Adopt the agent defined in `agents/qa-engineer.md`. Read it now before proceeding.

If `skills/E2E_PATTERNS.md` exists, read it and follow its conventions for selector strategy, fixture structure, and flow test patterns.

Read these context files before proceeding:
- BRD: `docs/brd.md` - full document for cross-module flows
- Architecture: `docs/architecture.md` - route map
- UI Design: `docs/ui-design.md` - user flow diagrams

Create Playwright E2E test suites in `templates/app/tests/e2e/`:
- Cover each user flow from the UI design
- Cover happy-path tests for all critical journeys
- Cover edge-case and error-path tests from BRD error states
- Cover cross-module integration tests (create -> list -> edit -> delete)
- Cover auth flow tests (login, logout, unauthorized access, role-based access)

## Mandatory Test Gate

Run these commands in `templates/app/`:

```bash
npm run typecheck
npm run build
npm run test:e2e
```

All E2E flows must pass against a running backend or mocked E2E test environment.

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 11 | E2E Tests | — | ? Complete | YYYY-MM-DD | {summary} |`
