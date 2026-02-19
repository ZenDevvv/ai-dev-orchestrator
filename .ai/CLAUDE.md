# AI-Assisted Fullstack Development Workflow

This project uses a 14-phase AI-assisted development workflow. The full playbook is in `AI-Assisted Fullstack Development Workflow.md`.

## How to Use

Each phase has a slash command: `/phase1-brd`, `/phase4a-db-schema`, `/phase4b-backend-modules`, `/phase9-pages`, etc.
Run them in order. Pass the module or page name as an argument when needed.

**Examples:**
- `/phase1-brd` — generate the BRD from your app concept
- `/phase4a-db-schema all` — generate all Prisma models and run prisma generate
- `/phase4b-backend-modules AUTH` — generate the backend module for AUTH
- `/phase9-pages DashboardPage` — generate the dashboard page
- `/phase-change "add bulk CSV export to REPORTS — finance team needs it for audits"` — log a requirement change and get an impact report

## Project Layout

```
agents/          — AI agent files (loaded automatically by phase commands)
skills/            — Skill docs: MODULE_TEMPLATE.md, API_STANDARD.md, BRD_FORMAT.md
docs/              — Project artifacts (BRD, architecture, designs, progress, changes) — created as you go
```

## Workflow Dependency Map

```
Phase 1 — BRD ✅ VERIFY
  └── Phase 2 — Planning
        └── Phase 3 — Architecture
              ├── Phase 4a → 4b → 5 → 6  (Backend track)
              └── Phase 7                 (Design track — UI design + style guide)
                    ↘
              Phase 8 → 9 → 10 → 11 → 12 → 13 → 14  (Frontend + Finalization)
```

After Phase 3, the backend track (4a→4b→5→6) and design track (7) can run in parallel.
The frontend track (8+) starts once both are complete.

## Skills (Reference Docs)

| Skill | File | Used In |
|-------|------|---------|
| BRD Format | `skills/BRD_FORMAT.md` | Phase 1 |
| Module Template | `skills/MODULE_TEMPLATE.md` | Phase 4a (Step 1), Phase 4b |
| API Standard | `skills/API_STANDARD.md` | Phase 8 |
| Architecture Standard | `skills/ARCHITECTURE_STANDARD.md` | Phase 3, 4a, 4b, 12 |
| Testing Conventions | `skills/TESTING_CONVENTIONS.md` | Phase 5, 10 |
| Style Guide | embedded in `docs/ui-design.md` | Phase 9 (per-project, created in Phase 7) |

Skills marked as pending don't exist yet — they'll be created as you run through projects and refine your conventions.

## Change Management

When requirements change or new features are added mid-project, use `/phase-change` — never edit the BRD directly without logging the change.

`/phase-change` will:
1. Update `docs/brd.md` (and `docs/architecture.md` if models/routes are affected)
2. Write a `CHG-NNN` entry to `docs/changes.md` with the reason and full impact
3. Add a `🔄 Changed` row to `docs/progress.md`
4. Output an impact report listing exactly which phases need to be re-run

`docs/changes.md` is the audit trail — it records *what* changed, *why*, and *what was affected*.

## Progress Tracking

Each phase appends a row to `docs/progress.md` when it completes. The file is created automatically on first use.

Format: `| Phase | Name | Scope | Status | Date | Notes |`

- Single-run phases (1, 2, 3, 4a, 6, 7, 11, 13, 14): one row per run, scope `—` (4a may list model count)
- Per-module/page phases (4b, 5, 8, 9, 10): one row per module/page
- Phase 12 (Review): one row per review checkpoint

## Core Principles

1. **BRD is the anchor** — every phase references it
2. **One phase at a time** — review each output before moving on
3. **Per-module iteration** — for phases 4, 5, 8, 9, 10, run one module/page at a time
4. **Independent modules first** — start with models that have no FK dependencies
5. **Rolling code reviews** — run Phase 12 after the first backend module and first frontend page, not just at the end
