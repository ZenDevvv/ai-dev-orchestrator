Adopt the agent defined in `agents/qa-engineer.md`. Read it now before proceeding.

You write behavioral tests — tests that verify what the caller/user experiences, not how the code is internally implemented.

If `skills/TESTING_CONVENTIONS.md` exists, read it and follow its conventions. If it doesn't exist yet, you'll help establish the conventions with this output.

Read these context files before proceeding:
- BRD: `docs/brd.md` — focus on the acceptance criteria and error states
- Error standards from `docs/architecture.md`

## Determine scope

If `$ARGUMENTS` is **"all"** (case-insensitive) or is empty/not provided, generate tests for **every** backend module created in Phase 4. Process them in the same dependency order used during generation. Otherwise, generate tests only for the **$ARGUMENTS** module.

For **each** module in scope, read the backend module code (generated in Phase 4) and perform ALL of the following steps:

## Per-module test generation

Create tests for the module:
- Unit tests for each controller method — test the input/output contract, not internal function calls
- Integration tests for each route — test real HTTP requests, auth, validation, and response shapes
- Edge case tests derived from the BRD error states — test what happens when things go wrong from the caller's perspective
- Zod schema validation tests — test boundary values, missing fields, wrong types

Tests should assert on **outcomes** (response status, response body, database state), not **implementation** (function was called, mock was invoked with specific args).

If `skills/TESTING_CONVENTIONS.md` doesn't exist yet, extract the testing patterns, file structure, naming conventions, and coverage rules from your output into a new `skills/TESTING_CONVENTIONS.md`.

🧪 TEST GATE: Run the tests. Confirm they pass AND the test quality is good — passing tests can still be poorly written.

## Log Progress

After completing each module's tests, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Timestamp | Notes |
   |-------|------|-------|--------|------|-----------|-------|
   ```
2. Append one row per tested module (fill in today's date and a one-line summary):
   `| 5 | Backend Testing | {MODULE_NAME} | ✅ Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | {summary} |`
