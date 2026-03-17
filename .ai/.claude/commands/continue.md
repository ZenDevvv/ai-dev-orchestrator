# Continue - Resume Full Build From Progress

> **Beta:** `/continue` resumes remaining phases in guarded mode by default. Pass `--fast-mode` to skip non-mandatory review prompts only; strict completion gates still apply.

## Load Concept

Read `docs/concept.md` in full.

If `docs/concept.md` does not exist, stop immediately and output:

```text
? No concept found.

/continue requires a defined app concept before running.
Run /discover first to build your concept, then re-run /continue.

/discover <your rough app idea>
```

Do not proceed without `docs/concept.md`.

## Parse Arguments

`$ARGUMENTS` may contain flags and optional design rules for Phase 7 if it has not run yet.

1. Detect `--fast-mode` anywhere in `$ARGUMENTS`.
   - If present, set `CONTINUE_MODE=FAST`.
   - If absent, set `CONTINUE_MODE=GUARDED`.
2. Parse design rules:
   - If `|||` appears, treat everything after `|||` as design rules.
   - If `|||` does not appear, remove recognized flags and treat the remaining text as design rules.
3. Trim whitespace from the resulting design rules string.

Examples:
- `/continue` -> guarded mode, no design rules
- `/continue --fast-mode` -> fast mode, no design rules
- `/continue minimal sidebar` -> guarded mode, design rules passed to Phase 7 if needed
- `/continue --fast-mode ||| minimal sidebar` -> fast mode, design rules passed to Phase 7 if needed

---

## Step 1 - Read Progress

Read `docs/progress.md` in full.

Build a completion map from the rows:
- Ignore non-phase meta rows where `Phase` is not one of: `1, 2, 3, 4a, 4b, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14` (for example: `BUILD` run rows, `-` change rows).
- A single-run phase (`1, 2, 3, 4a, 6, 7, 11, 12, 13, 14`) is complete if it has a `✅ Complete` row and no `⚠️ Stale` row for the same phase number.
- A per-item phase (`4b, 5, 8, 9, 10`) is complete when the row with scope `all` is marked `✅ Complete`, OR when every individual scope row for that phase is `✅ Complete` and none are `⚠️ Stale`.
- Any phase with a `⚠️ Stale` row is not complete and must be re-run.
- If `docs/progress.md` is empty or has no data rows, all phases are pending and execution starts from Phase 1.

Before proceeding, output:

```text
=== CONTINUE BUILD ===

Mode: {CONTINUE_MODE}
Completed (will skip): [list phase numbers]
Stale (will re-run):   [list phase numbers, or "none"]
Pending (will run):    [list phase numbers in order]

Starting from: Phase [N]
```

---

## Context Note

Each phase re-reads its required files from disk (BRD, architecture, module code, etc.), so document-based context is never lost between phases.

The only context risk is unlogged ad-hoc chat decisions. Use `/log-decision` to record manual overrides.

---

## Strict Completion Contract (Mandatory In All Modes)

These rules apply to both `CONTINUE_MODE=GUARDED` and `CONTINUE_MODE=FAST`:

1. Any missing required scope item or required artifact is a hard failure.
2. Partial completion is failure. Never treat placeholders, stubs, or "to-do later" outputs as complete unless a phase explicitly allows placeholders.
3. If blocked on missing inputs, missing generated files, or unresolved gate failures, stop immediately and fail.
4. Never output `=== CONTINUE COMPLETE ===` unless all strict checks pass.

---

## Strict Failure Protocol

Use this protocol on any strict-gate failure:

```text
=== CONTINUE FAILED ===

Mode: {CONTINUE_MODE}
Failed Gate: {GATE_NAME}

Missing required items:
- {item 1}
- {item 2}

Blockers:
- {blocker 1}
- {blocker 2}

Missing concept coverage:
- {CF-xxx} missing {story|requirement|page|module|status|notes}
- {CF-yyy} missing {story|requirement|page|module|status|notes}

Run status:
- Continue summary complete block: NOT emitted
- Remaining phases: not executed
```

After emitting this block, stop immediately. Do not continue phases and do not emit the continue-complete summary.

---

## Concept Parity Gate (Mandatory Before Resuming)

Run this gate as soon as `docs/brd.md` is available and before executing any phase >= 2.

1. Parse `docs/concept.md` section `## Core Features - Must Have (MVP)` or `## Core Features — Must Have (MVP)` into ordered `CONCEPT_MVP_ITEMS`:
   - Parse top-level bullets only.
   - Assign deterministic IDs by order: `CF-001`, `CF-002`, ...
2. Parse `docs/brd.md` section `### Concept Coverage Matrix (MVP Lock)` with columns:
   - `Concept ID | Concept Feature | Story IDs | Requirement IDs | Page(s) | Module(s) | Status | Notes`
3. Validate concept-to-BRD parity:
   - Every concept MVP bullet must have exactly one matrix row with matching `Concept ID` and `Concept Feature`.
   - Matrix row count must equal concept MVP item count (no missing, no extra).
   - `Status` must be `Covered` or `Backend-Only` for every row.
   - Every row must have non-empty `Story IDs` and `Requirement IDs`.
   - `Covered` rows must have non-empty `Page(s)` and non-empty `Module(s)`.
   - `Backend-Only` rows must have non-empty `Module(s)` and non-empty `Notes`.
4. On any failure, use strict failure protocol and include detailed `Missing concept coverage` entries by `CF-xxx` and unmet link type.
5. Lock the validated matrix as `CONCEPT_COVERAGE_LOCK` for downstream audits.

Timing rules:
- If Phase 1 runs during this `/continue`, run this gate immediately after Phase 1.
- If Phase 1 is skipped as complete, run this gate before the first pending phase executes.

No bypass flags are allowed. Missing concept MVP coverage is a hard failure.

---

## Required Scope Derivation (Required Before Any Phase >= 4)

As soon as both `docs/brd.md` and `docs/architecture.md` are available, derive and lock:

1. `REQUIRED_PAGES` from BRD Page Manifest:
   - `PAGE_NAME`
   - `ROUTE_PATH`
2. `REQUIRED_MODULES` from architecture route map:
   - `MODULE_NAME`
   - primary backend route prefix/path group
3. Normalize module slugs for file-path checks using route prefix as source of truth when names differ.
4. Print a checklist:

```text
=== REQUIRED CONTINUE SCOPE ===
Modules ({N}): [module list]
Pages ({M}): [page list]
Routes ({M}): [route list]
```

Timing rule:
- If Phases 1-3 are skipped, derive scope before executing Phase 4a or any later phase.
- If Phase 3 runs during `/continue`, derive scope immediately after Phase 3.

If scope cannot be derived unambiguously, fail using the strict failure protocol.

---

## Global Execution Rules

Apply these rules for the entire run:

1. **Skip complete phases**
   - If a phase is complete and not stale, print `[ SKIP ] Phase N - already complete` and move on.
2. **Re-run stale phases**
   - If a phase has `⚠️ Stale`, treat it as pending and execute it fully.
3. **Strict completion gates are mandatory in all modes**
   - Enforce strict artifact and parity checks in both `GUARDED` and `FAST`.
   - Any strict-gate failure triggers the strict failure protocol and stops the run.
4. **Guarded by default**
   - If `CONTINUE_MODE=GUARDED`, honor verification/review prompts from each phase.
   - If a phase tells you to run `/phase12-review`, do it before continuing.
5. **Fast mode is explicit**
   - If `CONTINUE_MODE=FAST`, skip non-mandatory review prompts only.
   - Do not skip mandatory build/test/parity/anti-mock gates.
6. **npm install before prisma generate**
   - In Phase 4a, run `npm install` in `templates/api/` before `npx prisma generate`.
7. **Frontend bootstrap before frontend phases**
   - Before Phase 8 (if it will run), run in `templates/app/`: `npm install` and `npx playwright install chromium`.
8. **Context checkpoint between phases**
   - After each phase completes (or is skipped), run `/checkpoint`.
9. **Mandatory backend validation after Phase 5**
   - Run from `templates/api/`: `npm run build` and `npm test`.
   - If either command fails, fail the run.
10. **Mandatory frontend sanity checks**
   - After Phases 8, 9, 10, and 11 (when run), execute from `templates/app/`: `npm run typecheck` and `npm run build`.
   - If either command fails, fail the run.
11. **Mandatory Phase 10 mocked Playwright check**
   - After Phase 10 (when run), execute from `templates/app/`: `npm run test:e2e -- --grep @phase10-mocked`.
   - If it fails, fail the run.
12. **Mandatory Phase 11 live Playwright check**
   - After Phase 11 (when run), execute from `templates/app/`: `npm run test:e2e -- --grep @phase11-live`.
   - If it fails, fail the run.
13. **Per-phase artifact assertions (mandatory)**
    - After Phase 4b, 8, 9, 10, and 11 (when run), execute the artifact/parity assertions defined in those phase sections.
    - Missing required items is failure even if compile/tests pass.
14. **Anti-shortcut rule**
    - Never mark a phase complete from intent alone. Completion requires concrete artifact existence and required-scope parity.
    - If blocked, fail with blockers; do not continue.
15. **Mandatory concept parity execution**
    - If Phase 1 is skipped as complete, run the **Concept Parity Gate** immediately after the continue status output and before executing the first pending phase.
    - If Phase 1 runs, execute the gate immediately after Phase 1.
---

## Phase Sequence

### Phase 1 - BRD
If complete: `[ SKIP ] Phase 1 - already complete`.
Otherwise: read `.ai/.claude/commands/phase1-brd.md` and execute all instructions.
If Phase 1 is pending but `docs/brd.md` already exists, treat as regeneration.

If Phase 1 runs, immediately run the **Concept Parity Gate**. If it fails, stop immediately.

> Context Checkpoint: run `/checkpoint`

---

### Phase 2 - Planning
If complete: `[ SKIP ] Phase 2 - already complete`.
Otherwise: read `.ai/.claude/commands/phase2-planning.md` and execute all instructions.

If the **Concept Parity Gate** has not run in this `/continue` session yet, run it now before Phase 2.

> Context Checkpoint: run `/checkpoint`

---

### Phase 3 - Architecture
If complete: `[ SKIP ] Phase 3 - already complete`.
Otherwise: read `.ai/.claude/commands/phase3-architecture.md` and execute all instructions.

If Phase 3 runs, immediately run the **Required Scope Derivation** section and lock:
- `REQUIRED_MODULES`
- `REQUIRED_PAGES`

> Context Checkpoint: run `/checkpoint`

---

### Phase 4a - DB Schema
If complete: `[ SKIP ] Phase 4a - already complete`.
Otherwise: read `.ai/.claude/commands/phase4a-db-schema.md` and execute all instructions.
Scope: `all`
Before `npx prisma generate`, first run `npm install` in `templates/api/`.

If `REQUIRED_MODULES`/`REQUIRED_PAGES` are not locked yet (because Phases 1-3 were skipped), run **Required Scope Derivation** now before continuing.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4b - Backend Modules
If complete: `[ SKIP ] Phase 4b - already complete`.
Otherwise: read `.ai/.claude/commands/phase4b-backend-modules.md` and execute all instructions.
Scope: `all`

If `REQUIRED_MODULES`/`REQUIRED_PAGES` are not locked yet, run **Required Scope Derivation** now before continuing.

If Phase 4b runs, execute mandatory artifact assertion (strict gate):
- For every item in `REQUIRED_MODULES`, confirm backend module artifacts exist:
  - `templates/api/app/{moduleSlug}/index.ts`
  - `templates/api/app/{moduleSlug}/{moduleSlug}.router.ts`
  - `templates/api/app/{moduleSlug}/{moduleSlug}.controller.ts`
- Confirm each required module is registered in `templates/api/index.ts` (import + `app.use(config.baseApiPath, ...)` registration path for that module).
- If any module artifact or registration is missing, fail immediately via the strict failure protocol.

> Context Checkpoint: run `/checkpoint`

---

### Phase 5 - Backend Testing
If complete: `[ SKIP ] Phase 5 - already complete`.
Otherwise: read `.ai/.claude/commands/phase5-backend-testing.md` and execute all instructions.
Scope: `all`

If Phase 5 runs, then run from `templates/api/`:
`npm run build && npm test`

> Context Checkpoint: run `/checkpoint`

---

### Phase 6 - Migrations
If complete: `[ SKIP ] Phase 6 - already complete`.
Otherwise: read `.ai/.claude/commands/phase6-migrations.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 7 - UI Design
If complete: `[ SKIP ] Phase 7 - already complete`.
Otherwise: read `.ai/.claude/commands/phase7-ui-design.md` and execute all instructions.
Input: [parsed design rules, or empty string if none provided]

> Context Checkpoint: run `/checkpoint`

---

### Phase 8 - Frontend API
If complete: `[ SKIP ] Phase 8 - already complete`.
Otherwise: read `.ai/.claude/commands/phase8-frontend-api.md` and execute all instructions.
Scope: `all`

If Phase 8 runs, first run from `templates/app/`:
`npm install && npx playwright install chromium`

If Phase 8 runs, then run from `templates/app/`:
`npm run typecheck && npm run build`

If Phase 8 runs, execute mandatory artifact/parity assertion (strict gate):
- Re-read `docs/progress.md`.
- For Phase `8`, verify a `✅ Complete` row exists for every module in `REQUIRED_MODULES`.
- Verify none of those Phase `8` scopes are marked `⚠️ Stale`.
- If any required module is missing a Phase 8 complete row, fail immediately.

> Context Checkpoint: run `/checkpoint`

---

### Phase 9 - Pages
If complete: `[ SKIP ] Phase 9 - already complete`.
Otherwise: read `.ai/.claude/commands/phase9-pages.md` and execute all instructions.
Scope: `all`

If Phase 9 runs, then run from `templates/app/`:
`npm run typecheck && npm run build`

If Phase 9 runs, execute mandatory artifact/parity assertions (strict gate):
- Parse `templates/app/app/routes.ts` and collect all registered route paths plus referenced component file paths.
- For every row in `REQUIRED_PAGES`, verify:
  - The required route path exists in `templates/app/app/routes.ts` (or an equivalent index route for `/`).
  - The referenced route component file exists under `templates/app/app/`.
- Re-read `docs/progress.md` and verify Phase `9` has a `✅ Complete` row for every required page scope and no stale rows for those scopes.
- If any required route, component file, or Phase 9 scope row is missing, fail immediately.

> Context Checkpoint: run `/checkpoint`

---

### Phase 10 - Frontend Testing
If complete: `[ SKIP ] Phase 10 - already complete`.
Otherwise: read `.ai/.claude/commands/phase10-frontend-testing.md` and execute all instructions.
Scope: `all`

If Phase 10 runs, then run from `templates/app/`:
`npm run typecheck && npm run build && npm run test:e2e -- --grep @phase10-mocked`

If Phase 10 runs, execute mandatory parity assertion (strict gate):
- Re-read `docs/progress.md` and verify Phase `10` has a `✅ Complete` row for every required page scope in `REQUIRED_PAGES`.
- Verify none of those Phase `10` scopes are marked `⚠️ Stale`.
- If any required page is missing Phase 10 completion coverage, fail immediately.

> Context Checkpoint: run `/checkpoint`

---

### Phase 11 - E2E Tests
If complete: `[ SKIP ] Phase 11 - already complete`.
Otherwise: read `.ai/.claude/commands/phase11-e2e.md` and execute all instructions.

If Phase 11 runs, then run from `templates/app/`:
`npm run typecheck && npm run build && npm run test:e2e -- --grep @phase11-live`

If Phase 11 runs, execute mandatory live-integration assertions (strict gate):
- Confirm there is live test coverage by finding at least one test title tagged `@phase11-live` in `templates/app/tests/e2e/`.
- Enforce anti-mock policy for core app API calls:
  - In files containing `@phase11-live`, fail if core API traffic is stubbed/intercepted (for example `page.route`, `route.fulfill`, `route.abort`) for backend app endpoints such as `/api`, configured base API paths, or local backend URLs.
  - Third-party non-core stubs may remain, but core app API stubbing is not allowed in Phase 11.
- If no live-tagged test exists, or core API stubbing is detected, fail immediately.

> Context Checkpoint: run `/checkpoint`

---

### Phase 12 - Code Review (Final Sweep)
If complete: `[ SKIP ] Phase 12 - already complete`.
Otherwise: read `.ai/.claude/commands/phase12-review.md` and execute all instructions.
Scope: `full project`

> Context Checkpoint: run `/checkpoint`

---

### Phase 13 - Documentation
If complete: `[ SKIP ] Phase 13 - already complete`.
Otherwise: read `.ai/.claude/commands/phase13-docs.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 14 - Deployment
If complete: `[ SKIP ] Phase 14 - already complete`.
Otherwise: read `.ai/.claude/commands/phase14-deployment.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

## Pre-Complete Strict Completion Audit (Mandatory)

When Phase 14 is done (or skipped), run a strict completion audit before any continue-complete output:

1. Re-read `docs/progress.md` and fail if any required phase/scope is stale/changed/incomplete.
2. Page manifest parity:
   - `REQUIRED_PAGES` count must equal implemented required route entries in `templates/app/app/routes.ts`.
   - Every required page route must reference a real component file under `templates/app/app/`.
3. Backend module parity:
   - `REQUIRED_MODULES` count must equal implemented backend module artifact sets under `templates/api/app/`.
   - Each required module must still have `index.ts`, `{moduleSlug}.router.ts`, `{moduleSlug}.controller.ts`, and registration in `templates/api/index.ts`.
4. Phase row parity:
   - Phase `8` complete scopes == `REQUIRED_MODULES`
   - Phase `9` complete scopes == `REQUIRED_PAGES`
   - Phase `10` complete scopes == `REQUIRED_PAGES`
5. Concept parity drift check using `CONCEPT_COVERAGE_LOCK`:
   - Re-read `docs/brd.md` and parse `Concept Coverage Matrix (MVP Lock)`.
   - For every `CF-xxx` row, verify listed `Story IDs` and `Requirement IDs` still exist in `docs/brd.md`.
   - For every listed module in `Module(s)`, verify backend module artifacts still exist and are registered in `templates/api/index.ts`.
   - For `Covered` rows, verify every listed page still resolves to a route in `templates/app/app/routes.ts` and a real component file under `templates/app/app/`.
6. If any parity mismatch or missing artifact is found, fail using the strict failure protocol and include `Missing concept coverage` entries.

Only if this strict completion audit passes, continue below.

---

## Continue Complete

After strict completion audit passes, output:

Before output, run a post-run search to determine next actions:
- Re-read `docs/progress.md` and collect any rows marked stale/changed/incomplete.
- Search the repo for unresolved implementation markers:
  - `TODO`
  - `FIXME`
  - `TBD`
  - `HACK`
  - `XXX`
- Check whether environment templates exist for both runtimes:
  - `templates/api/.env.example`
  - `templates/app/.env.example`
- Build a prioritized list:
  - `P0` blockers: failed checks, stale phases, missing required env/config.
  - `P1` quality: review, refactor, test hardening, docs cleanup.

```text
=== CONTINUE COMPLETE ===

Mode: {CONTINUE_MODE}
Strict completion audit: PASS
Required modules completed: {REQUIRED_MODULE_COUNT}/{REQUIRED_MODULE_COUNT}
Required pages completed: {REQUIRED_PAGE_COUNT}/{REQUIRED_PAGE_COUNT}
Phases skipped (were already complete): [list]
Phases re-run (were stale):             [list, or "none"]
Phases run (were pending):              [list]

Artifacts:
- docs/brd.md               - Business Requirements Document
- docs/project-plan.md      - Sprint plan and dependency map
- docs/architecture.md      - Data models, routes, auth strategy
- docs/ui-design.md         - Style guide, wireframes, user flows
- docs/progress.md          - Phase completion log
- prisma/schema/            - Prisma model files
- prisma/seed.ts            - Seed data script
- templates/api/app/*       - List concrete generated backend module folders and key files
- templates/app/app/*       - List concrete generated frontend API/page artifacts
- templates/app/tests/e2e/* - List concrete mocked/live E2E test files
- deployment/config files   - List concrete Docker/CI/.env example files generated

Post-run search findings:
- [List concrete findings from progress scan and repo marker search. If none, say "No blockers found."]

Recommended next steps (prioritized):
1. [Highest-priority P0 item from findings; if none, say "No P0 blockers."]
2. [Next P0/P1 item]
3. [Next item]
4. [Next item]
5. [Next item]

Baseline runbook (always include):
1. Review docs/progress.md for the full phase log
2. Set up your .env file from the generated .env.example
3. Run: npm install && npx prisma db push && npx prisma db seed
4. Start the dev server and verify the app runs
5. Run /phase12-review to do a manual quality pass on anything that needs attention
```
