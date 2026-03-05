Adopt the agent defined in `agents/backend-engineer.md`. Read it now before proceeding.

Read the skill doc at `skills/MODULE_TEMPLATE.md` — follow it exactly for file structure, naming, Zod patterns, and controller patterns. Read it now before proceeding.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — focus on routes and error standards

⚠️ PREREQUISITE: Phase 4a (DB Schema) must be complete before running this phase. The Prisma client must already be generated via `npx prisma generate`. Do **not** create or modify `.prisma` files here — they are owned by Phase 4a.

## Determine scope

If `$ARGUMENTS` is **"all"** (case-insensitive) or is empty/not provided, generate **every** module listed in the architecture doc's route map. Process them in dependency order — models with no FK dependencies first, then models that depend on them, and so on. Otherwise, generate only the module for **$ARGUMENTS**.

For **each** module in scope, perform ALL of the following steps:

## Per-module generation

Generate the backend module (skip Step 1 — Prisma schema is owned by Phase 4a):

- Zod validation schemas (create, update, response, query params) following MODULE_TEMPLATE.md Step 2
- Route definitions with OpenAPI docs following MODULE_TEMPLATE.md Step 5
- Controller logic (CRUD + custom operations) following MODULE_TEMPLATE.md Step 6
- Middleware (auth guards, validation)
- Error handling following the project error standards from architecture doc
- Config constants following MODULE_TEMPLATE.md Step 3
- Module entry (index.ts) following MODULE_TEMPLATE.md Step 4
- Register the module following MODULE_TEMPLATE.md Step 7

Run through the checklist at the bottom of MODULE_TEMPLATE.md before considering each module complete — skip the Prisma schema item, it was completed in Phase 4a.

⚠️ VERIFICATION GATE (per module): These Zod schemas become the frontend's source of truth. Verify:
- Does the Zod schema match the Prisma model (from Phase 4a) exactly?
- Are all routes from the route map implemented?
- Are auth guards applied correctly?

💡 After completing the FIRST module, run `/phase12-review` to catch pattern-level issues before generating more modules.

## Mark Downstream Phases as Stale

If this module is being **re-run** (i.e., a row for phase 4b `{MODULE_NAME}` already exists in `docs/progress.md`), scan for any `✅ Complete` rows in `docs/progress.md` for these downstream phases and scopes:

- Phase 5 — scope matches `{MODULE_NAME}`
- Phase 8 — scope matches `{MODULE_NAME}`
- Phase 9 — any pages listed in the BRD Page Manifest that are served by this module
- Phase 10 — tests for any pages affected above

For each found row, update the Status cell from `✅ Complete` to `⚠️ Stale` and append to its Notes cell: `| Stale: phase 4b {MODULE_NAME} re-run YYYY-MM-DD HH:mm:ss`

This signals that tests, frontend API modules, and pages depending on this module's Zod schemas may be out of date.

## Log Progress

After completing each module, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Timestamp | Notes |
   |-------|------|-------|--------|------|-----------|-------|
   ```
2. Append one row per completed module (fill in today's date and a one-line summary):
   `| 4b | Backend Module | {MODULE_NAME} | ✅ Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | {summary} |`
