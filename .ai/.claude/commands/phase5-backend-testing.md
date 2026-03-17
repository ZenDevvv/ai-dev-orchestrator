Adopt the agent defined in `agents/qa-engineer.md`. Read it now before proceeding.

You write behavioral tests: tests that verify what the caller or user experiences, not how the code is internally implemented.

If `skills/TESTING_CONVENTIONS.md` exists, read it and follow its conventions. If it does not exist yet, you will help establish the conventions with this output.

Read these context files before proceeding:
- BRD: `docs/brd.md` - focus on acceptance criteria and error states
- Error standards from `docs/architecture.md`

## Determine Scope

If `$ARGUMENTS` is `all` (case-insensitive) or is empty/not provided, generate tests for every backend module created in Phase 4. Process them in the same dependency order used during generation. Otherwise, generate tests only for the `$ARGUMENTS` module.

For each module in scope, read the backend module code (generated in Phase 4) and perform all of the following steps.

## Per-Module Test Generation

Create tests for the module:
- Unit tests for each controller method - test the input/output contract, not internal function calls
- Integration tests for each route - test real HTTP requests, auth, validation, and response shapes
- Edge case tests derived from the BRD error states - test what happens when things go wrong from the caller's perspective
- Zod schema validation tests - test boundary values, missing fields, wrong types

For protected routes, test both sides of the auth boundary:
- Missing or invalid auth yields the documented `401` or `403`
- Valid auth using the project's real session mechanism succeeds and returns the expected response shape

For modules with protected create, update, or delete routes, add at least one authenticated mutation continuity test:
- Establish auth through the real login/session flow or the project's canonical authenticated test helper
- Call the protected mutation route
- Assert on response status, response body, and resulting database state

Tests should assert on outcomes (response status, response body, database state), not implementation details (function was called, mock was invoked with specific args).

If `skills/TESTING_CONVENTIONS.md` does not exist yet, extract the testing patterns, file structure, naming conventions, and coverage rules from your output into a new `skills/TESTING_CONVENTIONS.md`.

## Mandatory Test Gate

Run these commands in `templates/api/`:

```bash
npm run build
npm test
```

If any command fails, stop and fix the module/tests before proceeding.

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

For each tested module, record completion with:
- `Phase`: `5`
- `Name`: `Backend Testing`
- `Scope`: `{MODULE_NAME}`
- `Status`: `✅ Complete`
- `Notes`: one-line summary including auth and mutation coverage
