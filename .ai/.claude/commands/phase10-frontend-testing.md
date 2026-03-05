Adopt the agent defined in `agents/qa-engineer.md`. Read it now before proceeding.

You write behavioral tests - test what the user sees and experiences, not component internals.

Read `skills/FRONTEND_TESTING.md` and follow its conventions for frontend behavioral testing.

Read these context files before proceeding:
- BRD: `docs/brd.md` - focus on the acceptance criteria for: $ARGUMENTS
- The page component(s) from Phase 9 for this page/module
- The frontend API module from Phase 8 - mock data factories

## Determine scope

If `$ARGUMENTS` is **"all"** (case-insensitive) or is empty/not provided, generate tests for **every** page listed in the BRD's **Page Manifest** table. Process them in the same order as Phase 9. Otherwise, generate tests only for **$ARGUMENTS**.

For **each** page in scope, perform ALL of the following steps:

Create mocked Playwright tests in `templates/app/tests/e2e/`:
- Validate visible content and critical interactions from the user's perspective
- Validate loading, empty, error, and populated states by stubbing network responses with `page.route`
- Validate form validation behavior and user-facing error messages
- Validate keyboard accessibility and basic ARIA behavior for key flows
- Tag each Phase 10 test with `@phase10-mocked` in the test title

This phase is frontend-only. Do not require a live backend for Phase 10 tests.

A good test reads like: "when the user clicks submit with an empty name field, they see a validation error."
A bad test reads like: "expect setError to have been called with {name: 'required'}."

## Mandatory Test Gate

Run these commands in `templates/app/`:

```bash
npm run typecheck
npm run build
npm run test:e2e -- --grep @phase10-mocked
```

If any command fails, stop and fix the page/tests before proceeding.

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Timestamp | Notes |
   |-------|------|-------|--------|------|-----------|-------|
   ```
2. Append one row per tested page (fill in today's date and a one-line summary):
   `| 10 | Frontend Testing | {PAGE_NAME} | ? Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | {summary} |`
