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

Follow the canonical logging spec in `docs/progress.md`.

For each tested module, record completion with:
- `Phase`: `5`
- `Name`: `Backend Testing`
- `Scope`: `{MODULE_NAME}`
- `Status`: `✅ Complete`
- `Notes`: one-line summary
