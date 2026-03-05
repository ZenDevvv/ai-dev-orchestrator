# Build - Full Project Scaffold (Fast Mode)

> **Fast Mode:** No gates, no pauses, no review checkpoints. Execute all 14 phases sequentially without stopping for user input.

## Load Concept

Before doing anything, read `docs/concept.md` in full.

If `docs/concept.md` does not exist, stop immediately and output:

```
? No concept found.

/build requires a defined app concept before running.
Run /discover first to build your concept, then re-run /build.

/discover <your rough app idea>
```

Do not proceed without `docs/concept.md`.

## Parse Arguments

`$ARGUMENTS` is optional design rules passed to Phase 7:
- If `$ARGUMENTS` is provided, treat the entire input as design rules for Phase 7
- If no `$ARGUMENTS`, Phase 7 will use design defaults

---

## Build Run Logging

Before starting Phase 1, initialize run logging in `docs/progress.md`:

1. Follow the canonical logging spec in `docs/progress.md`.
2. Capture the build start timestamp:
   - `BUILD_START_TS` as `YYYY-MM-DD HH:mm:ss`
3. Log a build-start event with:
   - `Phase`: `BUILD`
   - `Name`: `Build Run`
   - `Scope`: `all`
   - `Status`: `🚀 Started`
   - `Timestamp`: `{BUILD_START_TS}`
   - `Notes`: `/build started`

Keep `BUILD_START_TS` available until the run completes so the finish row can reference it.

---

## Context Note

Each phase re-reads its required files (BRD, architecture, module code, etc.) fresh from disk, so document-based context is never lost between phases.

The only thing that can be lost across a long session is **unlogged ad-hoc decisions**: corrections or clarifications made verbally in chat during a previous phase that were never written to a file. Use `/log-decision` to record manual overrides so they survive context compression.

---

## Global Execution Rules

Apply these rules for the **entire build** - they override any per-phase instructions:

1. **Skip all gates** - ignore every verification/review/test gate prompt. Do not pause; continue to the next phase automatically.
2. **Skip all review prompts** - ignore every "after first module/page run /phase12-review" suggestion.
3. **npm install before prisma generate** - in Phase 4a, run `npm install` inside `templates/api/` before running `npx prisma generate`.
4. **Frontend bootstrap before frontend phases** - before Phase 8, run in `templates/app/`: `npm install` and `npx playwright install chromium`.
5. **Context checkpoint between phases** - after each phase completes, run `/checkpoint`.
6. **Mandatory frontend sanity checks** - after Phases 8, 9, 10, and 11, run from `templates/app/`: `npm run typecheck && npm run build`. If either command fails, stop and fix before proceeding.
7. **Mandatory Phase 10 mocked Playwright check** - after Phase 10, run from `templates/app/`: `npm run test:e2e -- --grep @phase10-mocked`. If it fails, stop and fix before proceeding.
8. **Mandatory Phase 11 live Playwright check** - after Phase 11, run from `templates/app/`: `npm run test:e2e -- --grep @phase11-live`. If it fails, stop and fix before proceeding.

---

## Phase Sequence

### Phase 1 - BRD
Read `.ai/.claude/commands/phase1-brd.md` and execute all instructions.
Input: `docs/concept.md` (already loaded above)

> Context Checkpoint: run `/checkpoint`

---

### Phase 2 - Planning
Read `.ai/.claude/commands/phase2-planning.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 3 - Architecture
Read `.ai/.claude/commands/phase3-architecture.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4a - DB Schema
Read `.ai/.claude/commands/phase4a-db-schema.md` and execute all instructions.
Scope: `all`
Before running `npx prisma generate`, first run `npm install` inside `templates/api/`.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4b - Backend Modules
Read `.ai/.claude/commands/phase4b-backend-modules.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 5 - Backend Testing
Read `.ai/.claude/commands/phase5-backend-testing.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 6 - Migrations
Read `.ai/.claude/commands/phase6-migrations.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 7 - UI Design
Read `.ai/.claude/commands/phase7-ui-design.md` and execute all instructions.
Input: [$ARGUMENTS as design rules, or empty string if none provided]

> Context Checkpoint: run `/checkpoint`

---

### Phase 8 - Frontend API
Read `.ai/.claude/commands/phase8-frontend-api.md` and execute all instructions.
Scope: `all`

Before Phase 8 starts, run from `templates/app/`:
`npm install && npx playwright install chromium`

Then run from `templates/app/`:
`npm run typecheck && npm run build`

> Context Checkpoint: run `/checkpoint`

---

### Phase 9 - Pages
Read `.ai/.claude/commands/phase9-pages.md` and execute all instructions.
Scope: `all`

Then run from `templates/app/`:
`npm run typecheck && npm run build`

> Context Checkpoint: run `/checkpoint`

---

### Phase 10 - Frontend Testing
Read `.ai/.claude/commands/phase10-frontend-testing.md` and execute all instructions.
Scope: `all`

Then run from `templates/app/`:
`npm run typecheck && npm run build && npm run test:e2e -- --grep @phase10-mocked`

> Context Checkpoint: run `/checkpoint`

---

### Phase 11 - E2E Tests
Read `.ai/.claude/commands/phase11-e2e.md` and execute all instructions.

Then run from `templates/app/`:
`npm run typecheck && npm run build && npm run test:e2e -- --grep @phase11-live`

> Context Checkpoint: run `/checkpoint`

---

### Phase 12 - Code Review (Final Sweep)
Read `.ai/.claude/commands/phase12-review.md` and execute all instructions.
Scope: `full project`

> Context Checkpoint: run `/checkpoint`

---

### Phase 13 - Documentation
Read `.ai/.claude/commands/phase13-docs.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 14 - Deployment
Read `.ai/.claude/commands/phase14-deployment.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

## Build Complete

When Phase 14 is done:

1. Capture finish timestamp:
   - `BUILD_END_TS` as `YYYY-MM-DD HH:mm:ss`
2. Log a build-finish event with:
   - `Phase`: `BUILD`
   - `Name`: `Build Run`
   - `Scope`: `all`
   - `Status`: `🏁 Finished`
   - `Timestamp`: `{BUILD_END_TS}`
   - `Notes`: `/build finished (started: {BUILD_START_TS})`
3. Run a post-build search to determine next actions:
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
4. Output a final summary:

```
=== BUILD COMPLETE ===

All 14 phases completed.

Artifacts:
- docs/brd.md               - Business Requirements Document
- docs/project-plan.md      - Sprint plan and dependency map
- docs/architecture.md      - Data models, routes, auth strategy
- docs/ui-design.md         - Style guide, wireframes, user flows
- docs/progress.md          - Phase completion log
- prisma/schema/            - Prisma model files
- prisma/seed.ts            - Seed data script
- [backend module files]    - Zod schemas, routes, controllers
- [frontend module files]   - Hooks, service layer, types
- [test files]              - Unit, integration, component, E2E
- [deployment config]       - Dockerfiles, CI/CD, .env templates

Post-build search findings:
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
3. Run from `templates/api/`: npm install && npx prisma db push && npx prisma db seed
4. Start the dev server and verify the app runs
5. Run /phase12-review to do a manual quality pass on anything that needs attention
```
