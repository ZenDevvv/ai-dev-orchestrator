Adopt the agent defined in `agents/frontend-engineer.md`. Read it now before proceeding.

Read these context files before proceeding:
- BRD: `docs/brd.md` - focus on the relevant module requirements for: $ARGUMENTS
- UI Design: `docs/ui-design.md` - the wireframe for this specific page AND the Style Guide section (Section 1) for all styling decisions
- The frontend API module from Phase 8 - hook signatures, types, and Zod schemas
- Design references: check `docs/design-references/` for any image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`) and read them. Use these as a visual consistency check when implementing the page - the generated UI should reflect the same visual style extracted from these images in Phase 7.

## Determine scope

If `$ARGUMENTS` is **"all"** (case-insensitive) or is empty/not provided, generate **every** page listed in the BRD's **Page Manifest** table. Process them in order as they appear in the manifest. Otherwise, generate only the page for **$ARGUMENTS**.

For **each** page in scope, perform ALL of the following steps:

Build the page for **$ARGUMENTS**:
- Implement the layout matching the wireframe from `docs/ui-design.md`
- Use Tailwind CSS for styling, following the Style Guide section of `docs/ui-design.md` exactly
- Use shadcn/ui components where applicable
- Import and use the generated hooks from Phase 8 for data fetching
- Implement all states: loading, empty, error, populated
- Include form validation using the frontend Zod schemas
- Implement responsive behavior per the Style Guide
- Follow Page Integration Rules from API_STANDARD.md Step 5 and Step 6:
  - Use Zod types directly - no intermediate row/item types
  - Put display helpers in reusable utility files, not inline

## Frontend Sanity Check (mandatory)

After each page is generated, run these commands in `templates/app/`:

```bash
npm run typecheck
npm run build
```

If either command fails, stop and fix the generated page before moving to the next page.

REVIEW GATE: Does the page match the wireframe? Are Tailwind classes and shadcn components consistent with the Style Guide? Do all states render correctly? Compare against previously generated pages for visual consistency.

After completing the FIRST page, run `/phase12-review` to catch pattern-level issues before generating more pages.

## Mark Downstream Phases as Stale

If this page is being **re-run** (i.e., a row for phase 9 `{PAGE_NAME}` already exists in `docs/progress.md`), scan for any `? Complete` rows in `docs/progress.md` for these downstream phases and scopes:

- Phase 10 - scope matches `{PAGE_NAME}`

For each found row, update the Status cell from `? Complete` to `?? Stale` and append to its Notes cell: `| Stale: phase 9 {PAGE_NAME} re-run YYYY-MM-DD HH:mm:ss`

This signals that frontend tests for this page may be testing a previous version of the page component.

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Timestamp | Notes |
   |-------|------|-------|--------|------|-----------|-------|
   ```
2. Append one row per completed page (fill in today's date and a one-line summary):
   `| 9 | Pages | {PAGE_NAME} | ? Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | {summary} |`
