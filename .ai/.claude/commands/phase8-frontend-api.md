Adopt the agent defined in `agents/frontend-engineer.md`. Read it now before proceeding.

Read the skill doc at `skills/API_STANDARD.md` - follow it exactly for Zod copy rules, hook patterns, service layer structure, and endpoint configuration. Read it now before proceeding.

Read these context files before proceeding:

- BRD: `docs/brd.md`
- The backend Zod schemas from Phase 4 (these are the source of truth)
- Architecture: `docs/architecture.md` - route map and data models

## Determine scope

If `$ARGUMENTS` is **"all"** (case-insensitive) or is empty/not provided, generate **every** frontend API module listed in the architecture doc's data models / route map. Process them in dependency order - modules with no FK dependencies first, then modules that depend on them, and so on. Otherwise, generate only the frontend API module for **$ARGUMENTS**.

For **each** module in scope, perform ALL of the following steps:

## Per-module generation

Using the backend Zod schemas as the single source of truth, generate the frontend API module following API_STANDARD.md:

1. Copy Zod schemas from backend into frontend (Step 4 of API_STANDARD.md - replace mongoose ObjectId with ObjectIdSchema)
2. Generate TypeScript types inferred from the Zod schemas
3. Generate API endpoint configuration (Step 1)
4. Generate service layer functions (Step 2)
5. Generate custom React Query hooks (Step 3)
Run through the Quick Reference Checklist at the bottom of API_STANDARD.md.

## Frontend Sanity Check (mandatory)

After each module is generated, run these commands in `templates/app/`:

```bash
npm run typecheck
npm run build
```

If either command fails, stop and fix the generated frontend API module before moving to the next module.

REVIEW GATE: Do the copied Zod schemas exactly match the backend? Are hook signatures correct and types properly inferred? Does `typecheck` and `build` pass after generation?

## Mark Downstream Phases as Stale

If this module is being **re-run** (i.e., a row for phase 8 `{MODULE_NAME}` already exists in `docs/progress.md`), scan for any `✅ Complete` rows in `docs/progress.md` for these downstream phases and scopes:

- Phase 9 - any pages listed in the BRD Page Manifest that use this module's hooks or types
- Phase 10 - tests for any pages affected above

For each found row, update the Status cell from `✅ Complete` to `⚠️ Stale` and append to its Notes cell: `| Stale: phase 8 {MODULE_NAME} re-run YYYY-MM-DD HH:mm:ss`

This signals that pages consuming this module's hooks or types may be using outdated contracts.

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

For each completed module, record completion with:
- `Phase`: `8`
- `Name`: `Frontend API`
- `Scope`: `{MODULE_NAME}`
- `Status`: `✅ Complete`
- `Notes`: one-line summary
