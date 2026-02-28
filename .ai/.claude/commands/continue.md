# Continue — Resume Full Build From Progress

> **Fast Mode:** No gates. No pauses. No review checkpoints. Continues all remaining phases sequentially from wherever the last completed phase left off.

## Load Concept

Read `docs/concept.md` in full.

If `docs/concept.md` does not exist, stop immediately and output:

```
❌ No concept found.

/continue requires a defined app concept before running.
Run /discover first to build your concept, then re-run /continue.

/discover <your rough app idea>
```

Do not proceed without `docs/concept.md`.

## Parse Arguments

`$ARGUMENTS` is optional design rules passed to Phase 7 if it hasn't run yet:
- If `$ARGUMENTS` is provided, treat the entire input as design rules for Phase 7
- If no arguments, Phase 7 will use defaults if it runs

---

## Step 1 — Read Progress

Read `docs/progress.md` in full.

Build a completion map from the rows:
- A **single-run phase** (1, 2, 3, 4a, 6, 7, 11, 12, 13, 14) is **complete** if it has a `✅ Complete` row and no `⚠️ Stale` row for the same phase number.
- A **per-item phase** (4b, 5, 8, 9, 10) is **complete** when the row with scope `all` is marked `✅ Complete`, OR when every individual scope row for that phase is `✅ Complete` and none are `⚠️ Stale`.
- Any phase with a `⚠️ Stale` row is **not complete** — treat it as needing a re-run.
- If `docs/progress.md` is empty or has no data rows, all phases are pending — start from Phase 1.

Before proceeding, output a one-time status block:

```
=== CONTINUE BUILD ===

Completed (will skip): [list phase numbers]
Stale (will re-run):   [list phase numbers, or "none"]
Pending (will run):    [list phase numbers in order]

Starting from: Phase [N]
```

---

## Context Note

Each phase re-reads its required files (BRD, architecture, module code, etc.) fresh from disk — so document-based context is never lost between phases.

The only thing that can be lost across a long session is **unlogged ad-hoc decisions**: corrections or clarifications made verbally in the chat during a previous phase that were never written to a file. Use `/log-decision` to record any manual overrides so they survive context compression.

---

## Global Execution Rules

Apply these rules for the **entire run** — they override any per-phase instructions:

1. **Skip complete phases** — if a phase is marked complete and not stale, print `[ SKIP ] Phase N — already complete` and move to the next phase immediately. Do not re-execute any instructions from that phase's command file.
2. **Re-run stale phases** — if a phase has a `⚠️ Stale` row, treat it as pending and execute it fully.
3. **Skip all gates** — ignore every `⚠️ VERIFICATION GATE`, `📋 REVIEW GATE`, and `🧪 TEST GATE`. Do not pause. Continue to the next phase automatically.
4. **Skip all review prompts** — ignore every `💡 After completing the FIRST module/page, run /phase12-review...` suggestion.
5. **npm install before prisma generate** — in Phase 4a, run `npm install` in the project directory before running `npx prisma generate`.
6. **Context checkpoint between phases** — after each phase completes (or is skipped), run `/checkpoint` to preserve context before starting the next phase.

---

## Phase Sequence

### Phase 1 — BRD
Check completion map. If complete → `[ SKIP ] Phase 1 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase1-brd.md` and execute all instructions.
Note: if Phase 1 is pending but `docs/brd.md` already exists (partial run), read the existing file and treat Phase 1 as a regeneration pass.

> Context Checkpoint: run `/checkpoint`

---

### Phase 2 — Planning
Check completion map. If complete → `[ SKIP ] Phase 2 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase2-planning.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 3 — Architecture
Check completion map. If complete → `[ SKIP ] Phase 3 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase3-architecture.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4a — DB Schema
Check completion map. If complete → `[ SKIP ] Phase 4a — already complete`.
Otherwise: Read `.ai/.claude/commands/phase4a-db-schema.md` and execute all instructions.
Scope: `all`
Before running `npx prisma generate`, first run `npm install` in the project directory.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4b — Backend Modules
Check completion map. If complete → `[ SKIP ] Phase 4b — already complete`.
Otherwise: Read `.ai/.claude/commands/phase4b-backend-modules.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 5 — Backend Testing
Check completion map. If complete → `[ SKIP ] Phase 5 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase5-backend-testing.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 6 — Migrations
Check completion map. If complete → `[ SKIP ] Phase 6 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase6-migrations.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 7 — UI Design
Check completion map. If complete → `[ SKIP ] Phase 7 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase7-ui-design.md` and execute all instructions.
Input: [$ARGUMENTS as design rules, or empty string if none provided]

> Context Checkpoint: run `/checkpoint`

---

### Phase 8 — Frontend API
Check completion map. If complete → `[ SKIP ] Phase 8 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase8-frontend-api.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 9 — Pages
Check completion map. If complete → `[ SKIP ] Phase 9 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase9-pages.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 10 — Frontend Testing
Check completion map. If complete → `[ SKIP ] Phase 10 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase10-frontend-testing.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 11 — E2E Tests
Check completion map. If complete → `[ SKIP ] Phase 11 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase11-e2e.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 12 — Code Review (Final Sweep)
Check completion map. If complete → `[ SKIP ] Phase 12 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase12-review.md` and execute all instructions.
Scope: `full project`

> Context Checkpoint: run `/checkpoint`

---

### Phase 13 — Documentation
Check completion map. If complete → `[ SKIP ] Phase 13 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase13-docs.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 14 — Deployment
Check completion map. If complete → `[ SKIP ] Phase 14 — already complete`.
Otherwise: Read `.ai/.claude/commands/phase14-deployment.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

## Build Complete

When Phase 14 is done (or skipped), output a final summary:

```
=== CONTINUE COMPLETE ===

Phases skipped (were already complete): [list]
Phases re-run (were stale):             [list, or "none"]
Phases run (were pending):              [list]

Artifacts:
- docs/brd.md               — Business Requirements Document
- docs/project-plan.md      — Sprint plan and dependency map
- docs/architecture.md      — Data models, routes, auth strategy
- docs/ui-design.md         — Style guide, wireframes, user flows
- docs/progress.md          — Phase completion log
- prisma/schema/            — Prisma model files
- prisma/seed.ts            — Seed data script
- [backend module files]    — Zod schemas, routes, controllers
- [frontend module files]   — Hooks, service layer, types
- [test files]              — Unit, integration, component, E2E
- [deployment config]       — Dockerfiles, CI/CD, .env templates

Next steps:
1. Review docs/progress.md for the full phase log
2. Set up your .env file from the generated .env.example
3. Run: npm install && npx prisma db push && npx prisma db seed
4. Start the dev server and verify the app runs
5. Run /phase12-review to do a manual quality pass on anything that needs attention
```
