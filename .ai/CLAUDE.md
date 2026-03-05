# AI Dev Orchestrator — Quick Reference

This project uses a 14-phase AI-assisted development workflow. Each phase is a slash command that adopts the right agent, reads the right skill, and writes the right artifact.

---

## Start Here

**Required first step — always:**
```
/discover <your app idea>    # seeds docs/concept.md
/discover                    # run again to fill gaps
```

Phase 1 and `/build` hard-stop if `docs/concept.md` doesn't exist.

---

## Phase Sequence

```
/discover              → docs/concept.md
/phase1-brd            → docs/brd.md               ⚠️ REVIEW THIS CAREFULLY — drives everything
/phase2-planning       → docs/project-plan.md
/phase3-architecture   → docs/architecture.md
/phase4a-db-schema all → prisma/schema/*.prisma + prisma generate
/phase4b-backend-modules <MODULE>   → backend module code
/phase5-backend-testing <MODULE>    → backend test suites
/phase6-migrations     → prisma/seed.ts + docs/seed-data.md
/phase7-ui-design      → docs/ui-design.md
/phase8-frontend-api <MODULE>       → frontend hooks, services, types
/phase9-pages <PAGE>                → page components
/phase10-frontend-testing <PAGE>    → frontend test suites
/phase11-e2e           → E2E test suites
/phase12-review        → code review report
/phase13-docs          → README, API docs, onboarding guide
/phase14-deployment    → Dockerfiles, CI/CD, .env templates
/fix-bugs all          -> automated stabilization loop (optional, post-build)
```

**Module-level phases** (4b, 5, 8, 9, 10): run one module or page at a time. Pass `all` to process every module in dependency order.

---

## Three Run Modes

| Mode | Command | Best for |
|------|---------|----------|
| Phase by phase | Run each `/phaseN` manually | Production builds — review at every gate |
| Start manual, finish auto | Run early phases manually, then `/continue` | Review BRD + architecture, hand off the rest |
| Full auto | `/build` | Rapid prototyping |
| Auto stabilize | `/fix-bugs all` | Post-build cleanup until checks pass |

---

## Key Files

| Path | Purpose |
|------|---------|
| `docs/concept.md` | `/discover` output — required before Phase 1 |
| `docs/brd.md` | Business requirements — source of truth for all phases |
| `docs/architecture.md` | Data models, routes, auth strategy |
| `docs/progress.md` | Phase completion log — check this to see where you are |
| `docs/ui-design.md` | Style guide + wireframes — Phase 9 reads this |
| `.ai/agents/` | Agent role definitions (9 roles) |
| `.ai/skills/` | Reusable skill documents (conventions and templates) |
| `.ai/.claude/commands/` | Slash command prompt files |

---

## Error Recovery

**"No concept found" error on Phase 1 or /build:**
→ Run `/discover <your app idea>` first

**Phase failed or produced bad output:**
→ Check `docs/progress.md` for the last known state
→ Run `/resume` to re-orient: it shows complete, stale, and pending phases
→ Run `/fix-bugs all` for automatic triage + patch loops, or fix manually and re-run the phase command

**Phase marked ⚠️ Stale:**
→ Re-run that phase command — it regenerates from current inputs
→ Downstream phases that depend on it should also be re-run

**Mid-project requirement change:**
→ Use `/phase-change <what changed and why>` — never edit BRD directly
→ It updates the BRD, marks affected phases stale, and writes to `docs/changes.md`

**Lost context mid-session:**
→ Run `/resume` at the start of any new session to re-orient

---

## Skills (Reference Docs)

| Skill | File | Used In |
|-------|------|---------|
| BRD Format | `skills/BRD_FORMAT.md` | Phase 1 |
| Module Template | `skills/MODULE_TEMPLATE.md` | Phase 4a, 4b |
| API Standard | `skills/API_STANDARD.md` | Phase 8 |
| Architecture Standard | `skills/ARCHITECTURE_STANDARD.md` | Phase 3, 4a, 4b, 12 |
| Testing Conventions | `skills/TESTING_CONVENTIONS.md` | Phase 5 |
| Frontend Testing | `skills/FRONTEND_TESTING.md` | Phase 10 |
| Planning Conventions | `skills/PLANNING_CONVENTIONS.md` | Phase 2 |
| Style Guide | embedded in `docs/ui-design.md` | Phase 9 (per-project, created in Phase 7) |

Skills not yet created (generate on first run, extract into file afterward):
- `skills/MIGRATION_TEMPLATE.md` — Phase 6
- `skills/E2E_PATTERNS.md` — Phase 11
- `skills/REVIEW_CHECKLIST.md` — Phase 12
- `skills/DOC_TEMPLATES.md` — Phase 13
- `skills/INFRA_STANDARD.md` — Phase 14

---

## Stack

**Always scaffolded:**
- Backend: Node.js + TypeScript + Express 5 + Prisma (MongoDB) + Zod + Swagger
- Frontend: React Router v7 + TypeScript + Tailwind CSS + shadcn/ui + Vite

**Included when concept requires it:**
- Redis — caching, rate limiting, session storage
- Socket.IO — real-time features

To use a different stack: update `skills/MODULE_TEMPLATE.md` and `skills/API_STANDARD.md` before running any phases.
