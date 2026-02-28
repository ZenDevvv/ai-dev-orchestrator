# Build — Full Project Scaffold (Fast Mode)

> **Fast Mode:** No gates. No pauses. No review checkpoints. Execute all 14 phases sequentially without stopping for user input.

## Load Concept

Before doing anything, read `docs/concept.md` in full.

If `docs/concept.md` does not exist, stop immediately and output:

```
❌ No concept found.

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

## Context Note

Each phase re-reads its required files (BRD, architecture, module code, etc.) fresh from disk — so document-based context is never lost between phases.

The only thing that can be lost across a long session is **unlogged ad-hoc decisions**: corrections or clarifications made verbally in the chat during a previous phase that were never written to a file. Use `/log-decision` to record any manual overrides so they survive context compression.

---

## Global Execution Rules

Apply these rules for the **entire build** — they override any per-phase instructions:

1. **Skip all gates** — ignore every `⚠️ VERIFICATION GATE`, `📋 REVIEW GATE`, and `🧪 TEST GATE`. Do not pause. Continue to the next phase automatically.
2. **Skip all review prompts** — ignore every `💡 After completing the FIRST module/page, run /phase12-review...` suggestion.
3. **npm install before prisma generate** — in Phase 4a, run `npm install` inside `templates/api/` before running `npx prisma generate`.
4. **Context checkpoint between phases** — after each phase completes, run `/checkpoint` to produce a session summary before starting the next phase.

---

## Phase Sequence

### Phase 1 — BRD
Read `.ai/.claude/commands/phase1-brd.md` and execute all instructions.
Input: `docs/concept.md` (already loaded above)

> Context Checkpoint: run `/checkpoint`

---

### Phase 2 — Planning
Read `.ai/.claude/commands/phase2-planning.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 3 — Architecture
Read `.ai/.claude/commands/phase3-architecture.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4a — DB Schema
Read `.ai/.claude/commands/phase4a-db-schema.md` and execute all instructions.
Scope: `all`
Before running `npx prisma generate`, first run `npm install` inside `templates/api/`.

> Context Checkpoint: run `/checkpoint`

---

### Phase 4b — Backend Modules
Read `.ai/.claude/commands/phase4b-backend-modules.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 5 — Backend Testing
Read `.ai/.claude/commands/phase5-backend-testing.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 6 — Migrations
Read `.ai/.claude/commands/phase6-migrations.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 7 — UI Design
Read `.ai/.claude/commands/phase7-ui-design.md` and execute all instructions.
Input: [$ARGUMENTS as design rules, or empty string if none provided]

> Context Checkpoint: run `/checkpoint`

---

### Phase 8 — Frontend API
Read `.ai/.claude/commands/phase8-frontend-api.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 9 — Pages
Read `.ai/.claude/commands/phase9-pages.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 10 — Frontend Testing
Read `.ai/.claude/commands/phase10-frontend-testing.md` and execute all instructions.
Scope: `all`

> Context Checkpoint: run `/checkpoint`

---

### Phase 11 — E2E Tests
Read `.ai/.claude/commands/phase11-e2e.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 12 — Code Review (Final Sweep)
Read `.ai/.claude/commands/phase12-review.md` and execute all instructions.
Scope: `full project`

> Context Checkpoint: run `/checkpoint`

---

### Phase 13 — Documentation
Read `.ai/.claude/commands/phase13-docs.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

### Phase 14 — Deployment
Read `.ai/.claude/commands/phase14-deployment.md` and execute all instructions.

> Context Checkpoint: run `/checkpoint`

---

## Build Complete

When Phase 14 is done, output a final summary:

```
=== BUILD COMPLETE ===

All 14 phases completed.

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
3. Run from `templates/api/`: npm install && npx prisma db push && npx prisma db seed
4. Start the dev server and verify the app runs
5. Run /phase12-review to do a manual quality pass on anything that needs attention
```
