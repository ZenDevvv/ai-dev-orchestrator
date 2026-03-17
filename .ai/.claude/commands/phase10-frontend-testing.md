Adopt the agent defined in `agents/qa-engineer.md`. Read it now before proceeding.

You write behavioral frontend tests: test what the user sees and experiences, not component internals.

Read `skills/FRONTEND_TESTING.md` and follow its conventions for frontend behavioral testing.

Read these context files before proceeding:
- BRD: `docs/brd.md` - focus on the acceptance criteria for `$ARGUMENTS`
- The page component(s) from Phase 9 for this page/module
- The frontend API module from Phase 8 - hooks, service layer, and mock data factories

## Determine Scope

If `$ARGUMENTS` is `all` (case-insensitive) or is empty/not provided, generate tests for every page listed in the BRD's Page Manifest table. Process them in the same order as Phase 9. Otherwise, generate tests only for `$ARGUMENTS`.

For each page in scope, perform all of the following steps.

Create mocked Playwright tests in `templates/app/tests/e2e/`:
- Validate visible content and critical interactions from the user's perspective
- Validate loading, empty, error, and populated states by stubbing network responses with `page.route`
- Validate form validation behavior and user-facing error messages
- Validate keyboard accessibility and basic ARIA behavior for key flows
- Tag each Phase 10 test with `@phase10-mocked` in the test title

For protected create, update, or delete pages, add mocked auth-state coverage:
- Stub a `401` response on submit and assert the expected user-facing recovery behavior (message, redirect, or re-auth prompt)
- Stub a success response on submit and assert the page uses the normal generated hook/service flow

Phase 10 is frontend-only. Do not require a live backend for Phase 10 tests.
Do not treat Phase 10 as proof that cookies or tokens are being propagated correctly in the browser; that must be validated in Phase 11.

A good test reads like: "when the user clicks submit with an expired session, they see a sign-in prompt."
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

Follow the canonical logging spec in `docs/progress.md`.

For each tested page, record completion with:
- `Phase`: `10`
- `Name`: `Frontend Testing`
- `Scope`: `{PAGE_NAME}`
- `Status`: `✅ Complete`
- `Notes`: one-line summary including mocked auth-state coverage where applicable
