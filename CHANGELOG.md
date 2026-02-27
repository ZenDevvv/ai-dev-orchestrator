# Changelog

All notable changes to the AI Dev Orchestrator are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

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
- **`docs/progress.md`** — auto-updated after every phase with status (`✅ Complete`, `⚠️ Stale`, `🔄 Changed`), date, and notes.
