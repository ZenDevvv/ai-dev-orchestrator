# Changelog

All notable changes to the AI Dev Orchestrator are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

---

## [1.5.1] — 2026-03-05

### Changed
- **`/fix-bugs` execution model** — now uses a deterministic check pipeline with explicit order and IDs: API build -> API tests -> app typecheck -> app build -> mocked E2E -> live E2E.
- **`/fix-bugs` retry behavior** — after a patch, reruns the failed check first, then continues forward in sequence; upstream regressions restart from the earliest failed check.
- **README `/fix-bugs` section** — updated to document the strict check order.

### Why
This removes ambiguity during auto-stabilization runs and makes bug-fix sessions repeatable across projects.

---

## [1.5.0] — 2026-03-05

### Added
- **`/fix-bugs` command** — new post-build stabilization command at `.ai/.claude/commands/fix-bugs.md` that runs an automated triage + patch loop until required checks pass (or reports hard blockers).
- **README command guide** — added a dedicated `/fix-bugs` section with usage, behavior, and best-use cases.

### Changed
- **Quick reference (`.ai/CLAUDE.md`)** — phase sequence, run modes, and error-recovery guidance now include `/fix-bugs all` for automated post-build cleanup.
- **README command map** — `.ai/.claude/commands/` listing now includes `fix-bugs.md`.

### Why
`/build` and `/continue` optimize for speed, which can leave projects with cross-phase regressions. A dedicated stabilization command creates a consistent, repeatable way to patch and validate until the scaffold is runnable.

---

## [1.4.0] — 2026-02-28

### Added
- **`FRONTEND_TESTING.md` skill** — full frontend testing conventions for Phase 10: 4-state coverage rules, RTL query priority order, component/hook/form/accessibility patterns with code examples, and anti-patterns table. Phase 10 previously shared `TESTING_CONVENTIONS.md` which was backend-focused.
- **`PLANNING_CONVENTIONS.md` skill** — project planning conventions for Phase 2: dependency-based module ordering, estimation baselines (per task type), risk scoring (likelihood × impact), sprint structure rules, output format templates (module table, sprint plan, risk register, critical path), and anti-patterns.
- **Root `.gitignore`** — excludes `.ai/`, `node_modules/`, `.env`, `dist/`, `build/`, and common OS/editor artifacts. Previously undocumented that `.ai/` should be gitignored.
- **`.env.example` in `templates/api/`** — documents all required and optional environment variables: `DATABASE_URL`, `JWT_*`, `CORS_ORIGINS`, `REDIS_URL`, `CLOUDINARY_*`, `LOGTAIL_SOURCE_TOKEN`.
- **`.env.example` in `templates/app/`** — documents `VITE_API_BASE_URL` and `VITE_APP_NAME`.

### Changed
- **`CLAUDE.md`** — replaced README pointer with a full quick-reference card: phase sequence with one-line descriptions, three run modes, key file paths, error recovery steps, and skills table. Designed to orient Claude in non-Claude Code environments with a single file reference.
- **`/discover` command** — formally adopts the Business Analyst agent role. Now reads `.ai/agents/business-analyst.md` at session start, inheriting the BA's priorities (user-centric, error states, no implementation suggestions) and anti-patterns.
- **`/build` and `/continue` commands** — replaced inaccurate context-loss warning (which implied BRD decisions could be forgotten) with an accurate context note: document-based context is never lost because each phase re-reads its required files from disk. The only real risk is unlogged ad-hoc chat decisions — addressed by `/log-decision`.
- **`MODULE_TEMPLATE.md`** — fixed cache TTL contradiction. `getById` route TTL changed from `90s` to `300s` to align with `ARCHITECTURE_STANDARD.md` (`300s` for detail views, `60s` for list views). Both files now agree.
- **`templates/api/` starter** — removed real-project modules that leaked from source project: `app/metrics/`, `app/systemLog/` and their corresponding Prisma schemas (`metrics.prisma`, `system-log.prisma`). Core starter now contains only `auth`, `user`, `person`, `notification`, and `template` modules. `index.ts` updated to match.
- **README Skills table** — updated `TESTING_CONVENTIONS.md` entry to reflect Phase 5 only (backend). Phase 10 now uses `FRONTEND_TESTING.md`.
- **README Phase 2 entry** — updated skill reference from `—` to `PLANNING_CONVENTIONS`.

### Why
The audit identified two skill gaps that degraded output quality on first run (Phase 2 had no conventions, Phase 10 borrowed backend-only conventions), a cache TTL contradiction that produced inconsistent module behavior, missing developer onboarding files (no `.gitignore`, no `.env.example`), and template pollution from a real project that could mislead Phase 4b. The `CLAUDE.md` expansion enables the orchestrator to be used outside Claude Code with a single context file instead of the full README.

---

## [1.3.0] — 2026-02-28

### Changed
- **`/discover` command** — restructured around two explicit modes: `Seed + Refine` (when `$ARGUMENTS` is present) and `Refine only` (no arguments). Both modes always end with refinement questions — the command never just writes and stops.
- **`/discover` exit condition** — when all categories are fully defined, outputs `=== CONCEPT COMPLETE ===` instead of asking questions. This is how users know to stop running `/discover` and proceed to Phase 1.
- **`/discover` error state** — running `/discover` with no arguments and no `docs/concept.md` now fails with a clear message instead of silently doing nothing.
- **`/discover` gap analysis** — extended from 6 to 8 categories. Added **Design Preferences** (visual style, layout, device targets) and **Technical Stack** (stack preferences, hosting target, existing tech constraints).
- **`/discover` contradiction handling** — if new input contradicts confirmed content in `docs/concept.md`, Claude flags the conflict with `AskUserQuestion` and requires explicit confirmation before overwriting. No more silent overwrites.
- **`docs/concept.md` template** — added `## Technical Stack` section with default stack pre-filled (Node.js + Express + Prisma + MongoDB / React Router v7 + Tailwind + shadcn/ui). Users confirm defaults or specify a custom stack.

### Why
The previous command had no clear "done" signal — users didn't know when to stop running `/discover`. The two-mode split makes intent explicit: you seed with an argument, you refine without one. The `CONCEPT COMPLETE` exit condition closes the loop. Adding Design Preferences and Technical Stack to gap analysis ensures those categories are probed before Phase 1, where discovering them late would require architecture rework.

---

## [1.2.0] — 2026-02-27

### Added
- **`/discover` command** — iterative app concept refinement using `AskUserQuestion` before Phase 1. Run multiple times until the concept is fully clarified. Writes structured output to `docs/concept.md`.
- **`docs/concept.md`** — new required artifact that captures app name, users & roles, core features, monetization, integrations, constraints, and open questions. Created and maintained by `/discover`.

### Changed
- **`/phase1-brd`** — no longer accepts `$ARGUMENTS` as the app concept. Now reads `docs/concept.md` exclusively. Hard-stops with a clear error message if `docs/concept.md` is missing.
- **`/build`** — removed app concept from `$ARGUMENTS`. Now reads `docs/concept.md` as the Phase 1 input. `$ARGUMENTS` now accepts design rules only (passed to Phase 7). Hard-stops if `docs/concept.md` is missing.
- **`/continue`** — same concept.md guard as `/build`. Hard-stops if `docs/concept.md` is missing.

### Why
Phase 1 is the most consequential phase — every downstream artifact (architecture, schema, code) traces back to the BRD. Accepting a raw concept string in one shot allowed silent assumption-filling. `/discover` enforces a structured clarification step before any formal requirements are written, reducing BRD rework.

---

## [1.1.0] — 2026-02-27

### Added
- **`/continue` command** — resumes an in-progress build by reading `docs/progress.md` and skipping phases already marked `✅ Complete`. Re-runs `⚠️ Stale` phases automatically. Outputs a status block (completed / stale / pending) before executing. Accepts optional design rules via `$ARGUMENTS` for Phase 7.

### Why
`/build` always starts from Phase 1 with no progress awareness. Users who started the manual phase-by-phase flow had no way to hand off remaining phases to Claude in one command. `/continue` bridges the gap between manual and automated workflows.

---

## [1.0.1] — 2026-02-27

### Changed
- Moved `templates/api/` and `templates/app/` into a single consolidated `templates/` folder.
- Updated `ARCHITECTURE_STANDARD.md` and `ui-design.md` references to reflect new paths.
- Removed machine-specific absolute path from `.claude/settings.json` — replaced with relative path `.ai/.claude/commands`. Removed hardcoded Bash allow rule.
- Fixed repository structure diagram in README to show actual `.ai/` layout.

---

## [1.0.0] — 2026-02-27

### Added
- **`/log-decision` command** — logs manual AI overrides to `docs/decision-log.md` using pipe-delimited input (`Phase | What AI generated | What I changed | Reason | Pattern (optional)`). Warns when a correction has been seen before, prompting the user to encode it into the relevant skill doc.

---

## [0.4.0] — 2026-02-20

### Added
- **`/build` command `[BETA]`** — executes all 14 phases sequentially in fast mode with no review gates. Accepts app concept and optional design rules via `|||` separator. Runs `/checkpoint` between each phase. Outputs a final build summary with artifact list and next steps.

---

## [0.3.0] — 2026-02-20

### Added
- **Phase 6 seed data output** — `/phase6-migrations` now generates `docs/seed-data.md` alongside `prisma/seed.ts`. Documents test account credentials, default bootstrap data, environment-specific seed summaries, database reset instructions, and common testing scenarios.

---

## [0.2.0] — 2026-02-20

### Changed
- Renamed the workflow folder from `AI-Assisted Fullstack Development Workflow/` to `.ai/` — cleaner, hidden by default, easier to reference in command paths and `.gitignore`.
- Updated all internal command file references to use the `.ai/` prefix.

---

## [0.1.0] — 2026-02-20

### Added
- Initial release of the AI Dev Orchestrator.
- **14 phase commands**: `/phase1-brd` through `/phase14-deployment` — each adopts the correct agent, reads the relevant skill doc, and scopes to the right context automatically.
- **`/resume` command** — session re-orientation. Reads `docs/progress.md`, `docs/brd.md`, `docs/architecture.md`, and `docs/changes.md` to output a structured summary of complete, stale, and pending phases with the exact next command to run.
- **`/phase-change` command** — handles mid-project requirement changes. Updates BRD and architecture, writes a timestamped entry to `docs/changes.md`, logs a `🔄 Changed` row to `docs/progress.md`, and outputs an impact report.
- **`/checkpoint` command** — session summary for context preservation between long phases.
- **9 agent role definitions**: Business Analyst, Project Manager, Software Architect, Backend Engineer, QA Engineer, UI Designer, Frontend Engineer, Technical Writer, DevOps Engineer.
- **5 skill documents**: `BRD_FORMAT.md`, `MODULE_TEMPLATE.md`, `API_STANDARD.md`, `ARCHITECTURE_STANDARD.md`, `TESTING_CONVENTIONS.md`.
- **Starter templates**: `templates/api/` (Node.js + Express + Prisma + Zod + Redis + Swagger + Socket.IO) and `templates/app/` (React Router v7 + TypeScript + Tailwind + shadcn/ui + Vite).
- **`docs/progress.md`** — auto-updated after every phase with status (`✅ Complete`, `⚠️ Stale`, `🔄 Changed`), timestamp, and notes.
