# AI Dev Orchestrator

A structured AI-powered development workflow for building fullstack apps from idea to deployment — using Claude Code slash commands that automatically wire up the right agent, skill, and context at every phase.

---

## What This Is

AI Dev Orchestrator turns a rough app idea into a production-ready fullstack project through 14 sequential phases — each one a slash command that adopts the correct agent role, loads the right skill document, and scopes to the exact context it needs.

The workflow starts with `/discover`, an interactive concept refinement session that clarifies your app before any code or requirements are written. Every phase from there builds on the last: BRD → architecture → schema → backend modules → tests → UI design → frontend → deployment.

**Three ways to run it:**

| Mode | How | Best for |
|---|---|---|
| Phase by phase | Run each `/phaseN` command manually, review output, proceed | Production-grade builds with full control |
| Start manual, finish auto | Run early phases manually, then `/continue` for the rest | When you want to review BRD and architecture before handing off |
| Full auto | `/discover` then `/build` | Rapid prototyping and scaffolding |

**Stack the phases are calibrated for:**

**Core** — scaffolded in every project:
- **Backend:** Node.js + TypeScript + Express 5 + Prisma (MongoDB) + Zod + Swagger
- **Frontend:** React Router v7 + TypeScript + Tailwind CSS + shadcn/ui + Vite

**Optional** — included only when the concept requires it:
- **Redis** — caching, rate limiting, or session storage
- **Socket.IO** — real-time features (chat, live updates, notifications)

`/discover` captures whether these are needed via the Integrations and Feature Scope categories — phases use that to decide what to scaffold.

If your team uses a different stack, update `skills/MODULE_TEMPLATE.md` and `skills/API_STANDARD.md` before running any phases — those two files are where the conventions live.

---

## How It Works

Start with `/discover`. It interviews you about your app idea and writes `docs/concept.md` — the structured input that every phase depends on. Phase 1, `/build`, and `/continue` will all hard-stop if this file doesn't exist.

Once the concept is solid, each phase command handles everything automatically:

- Adopts the correct agent role (Business Analyst, Backend Engineer, QA Engineer, etc.)
- Reads the relevant skill document for that phase
- Scopes to exactly the right context from `docs/`
- Knows what artifact to produce and where to save it

For example, `/phase4b-backend-modules AUTH`:

1. Adopts the Backend Engineer agent
2. Reads `MODULE_TEMPLATE.md`
3. Reads your BRD and architecture doc, scoped to the AUTH module
4. Generates Zod schemas, routes, controllers, and middleware

You review the output, make corrections, and move to the next phase.

## Sample Usage

```
# Always start here — refine until concept is solid:
/discover <your rough app idea>
/discover                          # run again to add or clarify more
/discover                          # run as many times as needed

# Then proceed phase by phase:
/phase1-brd
/phase2-planning
/phase3-architecture
/phase4a-db-schema all
/phase4b-backend-modules <MODULE_NAME> | all
/phase5-backend-testing <MODULE_NAME> | all
/phase6-migrations
/phase7-ui-design <optional: design rules>
/phase8-frontend-api <MODULE_NAME> | all
/phase9-pages <PAGE_NAME> | all
/phase10-frontend-testing <MODULE_OR_PAGE_NAME> | all
/phase11-e2e
/phase12-review <optional: what to review>
/phase13-docs
/phase14-deployment

# Start any new session — re-orients Claude with project state, stale items, and next action:
/resume

# Mid-project requirement changes:
/phase-change add bulk CSV export to REPORTS — finance team needs it for audits

# Log a manual override when you correct the AI's output:
/log-decision "Phase 3 | AI used String[] for User.roles | Changed to separate Role model | Reason: roles need their own permission attributes"
```

> Want to skip the manual phase-by-phase flow entirely? See [`/build`](#build--full-project-scaffold-beta) below.
> Already started manually and want to finish in one go? See [`/continue`](#continue--resume-full-build-beta).

---

## `/discover` — App Concept Refinement

The required first step before any build. Run it as many times as needed until your concept is solid — then proceed to Phase 1 or `/build`.

### How It Works

1. Takes your rough app idea and asks 2–4 targeted clarifying questions via interactive prompts
2. Writes a structured `docs/concept.md` covering users, features, monetization, integrations, and constraints
3. Ends with a readiness assessment — tells you what's clear, what's still vague, and whether to run again or proceed
4. On re-runs, reads existing `docs/concept.md` and asks about gaps — never overwrites confirmed content

### Usage

```
/discover <your rough app idea>    # first run — seed the concept
/discover                          # subsequent runs — refine and fill gaps
```

### Example Flow

```
/discover a SaaS invoicing tool for freelancers
# → asks about user roles, monetization, integrations, MVP scope
# → writes docs/concept.md, reports what's still vague

/discover
# → reads concept.md, asks follow-up questions about the remaining gaps
# → updates concept.md, reports: "Ready for Phase 1"

/phase1-brd    # or /build
```

---

## `/build` — Full Project Scaffold `[BETA]`

> **Beta:** `/build` runs all 14 phases sequentially with no review gates, no checkpoints, and no human intervention. Requires `/discover` to have been run first. Use the per-phase commands when you need control over the output.

`/build` executes every phase from BRD to deployment in a single command — the fastest way to generate a complete project scaffold once your concept is defined.

### How It Works

1. Reads `docs/concept.md` — fails if it doesn't exist (run `/discover` first)
2. Claude runs all 14 phases in order, each phase's output feeding into the next
3. `/checkpoint` runs between phases to preserve context across the long session
4. A final build summary is output when Phase 14 completes

### Usage

```
/build                        # uses docs/concept.md, AI picks design defaults
/build <design rules>         # passes design rules to Phase 7
```

### Examples

```
# Concept already defined via /discover — AI picks design defaults
/build

# With design rules for Phase 7
/build dark mode default, minimal sidebar, mobile first
```

### Before Running

- **Required:** run `/discover` until `docs/concept.md` exists and concept is solid
- **Optional:** drop reference images (`.png`, `.jpg`, `.webp`) into `docs/design-references/` — Phase 7 reads them automatically for style extraction
- **Required:** your project directory should have a working `package.json` — Phase 4a runs `npm install` before `prisma generate`

### What Gets Produced

| Output | Phase |
|--------|-------|
| `docs/brd.md` — Business Requirements Document | 1 |
| `docs/project-plan.md` — Sprint plan and dependency map | 2 |
| `docs/architecture.md` — Data models, routes, auth strategy | 3 |
| `prisma/schema/*.prisma` — Prisma model files | 4a |
| Backend modules — routes, controllers, Zod schemas | 4b |
| Backend test suites | 5 |
| `prisma/seed.ts` — Seed data script | 6 |
| `docs/seed-data.md` — Test accounts and seed data reference | 6 |
| `docs/ui-design.md` — Style guide, wireframes, user flows | 7 |
| Frontend API modules — hooks, types, service layer | 8 |
| Page components | 9 |
| Frontend test suites | 10 |
| E2E test suites | 11 |
| Code review report | 12 |
| README, API docs, onboarding guide, change management guide | 13 |
| Dockerfiles, Docker Compose, CI/CD config | 14 |

### Trade-offs vs. Per-Phase Workflow

| | `/build` | Per-phase |
|---|---|---|
| Speed | Fast — one command | Slower — phase by phase |
| Control | None — AI decides everything | Full — review and correct at each gate |
| Output quality | Good for scaffolding, needs post-review | Higher — human-in-the-loop at every gate |
| Best for | Prototyping, exploring ideas quickly | Production-grade builds |

**Recommended pattern:** Use `/build` to generate a full scaffold fast, then use per-phase commands to refine, fix, or regenerate specific phases. Run `/resume` after the build completes to see the full phase log and spot anything that needs attention.

---

## `/continue` — Resume Full Build `[BETA]`

> **Beta:** Like `/build`, `/continue` runs remaining phases with no review gates and no human intervention. The difference: it reads `docs/progress.md` first and skips any phase already marked `✅ Complete`.
>
> **Requires:** `docs/concept.md` — run `/discover` first if you haven't already.

Use `/continue` when you've started the manual phase-by-phase flow and want to hand off the rest to Claude in one go.

### How It Works

1. Reads `docs/progress.md` to build a completion map
2. Prints a summary of which phases will be skipped, re-run (stale), or executed
3. Executes only the remaining phases in order — skipping complete ones, re-running stale ones
4. Runs `/checkpoint` between phases and outputs a final build summary

### Usage

```
/continue
/continue ||| <design rules>
```

The `|||` separator passes design rules to Phase 7 if it hasn't run yet. If Phase 7 is already complete, the design rules are ignored.

### Examples

```
# You've finished Phase 1 manually — continue the rest
/continue

# You've finished Phases 1-3 and want to pass design rules for Phase 7
/continue dark mode default, minimal sidebar
```

### Status Output

Before executing, `/continue` prints what it found:

```
=== CONTINUE BUILD ===

Completed (will skip): 1, 2, 3
Stale (will re-run):   5
Pending (will run):    4a, 4b, 6, 7, 8, 9, 10, 11, 12, 13, 14

Starting from: Phase 4a
```

### When to Use `/continue` vs `/build`

| | `/build` | `/continue` |
|---|---|---|
| Starting point | Always Phase 1 | Reads `docs/progress.md` and skips complete phases |
| Use when | Starting fresh from an idea | You've already run some phases manually |
| Stale phases | N/A | Re-runs automatically |

---

## Repository Structure

```
├── README.md
├── .claude/
│   └── settings.json               # Claude Code workspace settings
│
├── .ai/                            # Orchestrator — add to .gitignore in your project
│   ├── CLAUDE.md                   # Auto-loaded by Claude Code — project context
│   ├── .claude/commands/           # Slash commands
│   │   ├── phase1-brd.md           # BRD generation
│   │   ├── phase2-planning.md
│   │   ├── phase3-architecture.md
│   │   ├── phase4a-db-schema.md    # Prisma models + prisma generate
│   │   ├── phase4b-backend-modules.md  # Zod schemas, routes, controllers
│   │   ├── phase5-backend-testing.md
│   │   ├── phase6-migrations.md
│   │   ├── phase7-ui-design.md
│   │   ├── phase8-frontend-api.md
│   │   ├── phase9-pages.md
│   │   ├── phase10-frontend-testing.md
│   │   ├── phase11-e2e.md
│   │   ├── phase12-review.md
│   │   ├── phase13-docs.md
│   │   ├── phase14-deployment.md
│   │   ├── resume.md               # Session resume — project state, stale items, next action
│   │   ├── phase-change.md         # Log requirement changes & get impact reports
│   │   ├── log-decision.md         # Log manual AI overrides to docs/decision-log.md
│   │   ├── discover.md             # Iterative concept refinement — required before phase1 or build
│   │   ├── build.md                # [BETA] Full project scaffold — all 14 phases in one command
│   │   ├── continue.md             # [BETA] Resume build — skips completed phases, runs remaining
│   │   └── checkpoint.md           # Session summary — context preservation between phases
│   │
│   ├── agents/                     # AI agent role definitions (9 roles)
│   │   ├── business-analyst.md
│   │   ├── project-manager.md
│   │   ├── software-architect.md
│   │   ├── backend-engineer.md
│   │   ├── qa-engineer.md
│   │   ├── ui-designer.md
│   │   ├── frontend-engineer.md
│   │   ├── technical-writer.md
│   │   └── devops-engineer.md
│   │
│   ├── skills/                     # Reusable skill documents
│   │   ├── BRD_FORMAT.md           # BRD structure, module IDs, GWT criteria
│   │   ├── MODULE_TEMPLATE.md      # Backend file structure, Zod, controller patterns
│   │   ├── API_STANDARD.md         # Frontend hooks, service layer, Zod copy rules
│   │   ├── ARCHITECTURE_STANDARD.md
│   │   ├── TESTING_CONVENTIONS.md
│   │   └── ...                     # More skills added as you refine conventions
│   │
│   ├── docs/                       # Project artifact templates (filled in as you run phases)
│   │   ├── concept.md              # /discover output — structured app concept, required before Phase 1
│   │   ├── brd.md                  # Phase 1 output
│   │   ├── project-plan.md         # Phase 2 output
│   │   ├── architecture.md         # Phase 3 output
│   │   ├── ui-design.md            # Phase 7 output (style guide + wireframes combined)
│   │   ├── design-references/      # Drop reference images here before running Phase 7
│   │   ├── seed-data.md            # Phase 6 output — test credentials & seed reference
│   │   ├── progress.md             # Progress log (auto-updated after each phase)
│   │   ├── changes.md              # Change audit trail (created by /phase-change)
│   │   └── decision-log.md         # Manual override log (created by /log-decision)
│   │
│   └── AI-Assisted Fullstack Development Workflow.md  # Full playbook reference
│
└── templates/
    ├── api/                        # Node.js + Express + Prisma starter template
    └── app/                        # React + Tailwind + shadcn/ui starter template
```

> **Note:** The `.ai/` folder is the orchestrator. Your actual project code (backend, frontend, prisma schemas, etc.) lives in the project root, outside `.ai/`. Add `.ai/` to your `.gitignore` so the orchestrator doesn't get committed with your project code.

---

## Prerequisites

- **VSCode** with [Claude Code](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code)
- A project idea to build

---

## Getting Started

1. **Clone this repo** into your workspace
2. **Open in VSCode** with Claude Code installed
3. **Run `/discover`**: type `/discover` followed by your rough app idea — answer the questions, run again until concept is solid
4. **Run `/phase1-brd`**: generates the BRD from `docs/concept.md` — review it carefully, it drives everything downstream
5. **Continue through phases** in order, using the slash commands

---

## Progress Tracking & Changes

Every phase automatically logs its completion to `docs/progress.md`:

```
| Phase | Name            | Scope       | Status      | Date       | Notes                            |
|-------|-----------------|-------------|-------------|------------|----------------------------------|
| 1     | BRD             | —           | ✅ Complete | 2026-02-18 | 5 modules, 32 requirements       |
| 2     | Planning        | —           | ✅ Complete | 2026-02-18 | 3 sprints, 4 risks flagged       |
| 4a    | DB Schema       | all         | ✅ Complete | 2026-02-19 | 6 models, prisma generate OK     |
| 4b    | Backend Module  | AUTH        | ✅ Complete | 2026-02-19 | Login, register, JWT             |
| 4b    | Backend Module  | USERS       | ✅ Complete | 2026-02-19 | CRUD + avatar upload             |
| 5     | Backend Testing | AUTH        | ⚠️ Stale   | 2026-02-19 | Tests OK | Stale: phase 4b AUTH re-run 2026-02-20 |
```

**Status values:**
- `✅ Complete` — phase finished and not invalidated by subsequent changes
- `⚠️ Stale` — phase was completed but a dependency was re-run or a change was logged that requires re-running this phase
- `🔄 Changed` — written by `/phase-change` to record a requirement change

Run `/resume` at the start of any session to see a summary of complete, stale, and pending phases — and the exact next command to run.

### Handling Mid-Project Changes

When requirements change or new features are added, use `/phase-change`:

```
/phase-change add bulk CSV export to REPORTS — finance team needs it for audits
```

This command:
1. **Updates the BRD** — adds or modifies requirements, never renumbers IDs
2. **Updates architecture** — if models or routes are affected
3. **Writes to `docs/changes.md`** — a timestamped change entry with:
   - What changed
   - Why (business context)
   - Which requirements/modules were affected
   - Exact phases that need re-running
4. **Logs to progress.md** — a `🔄 Changed` row
5. **Outputs an impact report** — so you know exactly what to action next

The `docs/changes.md` file is your audit trail — it answers "why does this exist?" months later.

---

## Logging Manual Decisions

When you correct or override AI output during any phase, log it:

```
/log-decision "Phase 3 | AI used String[] for User.roles | Changed to separate Role model | Reason: roles need their own permission attributes"
```

Use `|` to separate fields:
1. **Phase** — which phase you were in
2. **What AI generated** — brief description of the original output
3. **What I changed** — what you manually corrected
4. **Reason** — why you made the change
5. **Pattern (optional)** — if this keeps happening, note it here

This appends a formatted entry to `docs/decision-log.md`. When the same correction appears twice, encode it into the relevant skill document (`skills/MODULE_TEMPLATE.md`, `skills/ARCHITECTURE_STANDARD.md`, etc.) so the AI won't repeat the mistake on the next phase run.

---

## The 14 Phases

### Phase 1 — Business Requirements

```
/phase1-brd
```

**Requires:** `docs/concept.md` — run `/discover` first.

Agent: Business Analyst | Skill: `BRD_FORMAT` | Reads: `docs/concept.md` | Output: `docs/brd.md`

Generates a complete BRD with module IDs, requirement IDs, Given/When/Then acceptance criteria, error states, **user stories**, and a **Page Manifest**. User stories map every user-facing interaction to a page — this becomes the source of truth for what Phase 7 designs and Phase 9 builds.

**Gate:** ⚠️ VERIFY — this document drives everything. Invest the most review time here.

---

### Phase 2 — Project Planning & Estimation

```
/phase2-planning
```

Agent: Project Manager | Skill: — | Reads: `docs/brd.md` | Output: `docs/project-plan.md`

Generates module breakdown, task estimates, sprint plan, dependency map, and risk register.

**Gate:** Review estimates and build order.

---

### Phase 3 — Architecture & Model Design

```
/phase3-architecture
```

Agent: Software Architect | Skill: `ARCHITECTURE_STANDARD` | Reads: `docs/brd.md`, `docs/project-plan.md` | Output: `docs/architecture.md`

Designs data models, ERD, API route map, auth strategy, and error standards. If `skills/ARCHITECTURE_STANDARD.md` doesn't exist yet, this phase creates it.

**Gate:** Review model relationships, API surface completeness, auth guards.

---

### Phase 4a — DB Schema

```
/phase4a-db-schema all | <MODEL_NAME>
```

**Example:** `/phase4a-db-schema all` or `/phase4a-db-schema User`

Agent: Backend Engineer | Skill: `MODULE_TEMPLATE` (Step 1) | Reads: `docs/architecture.md` (data models + ERD) | Output: `prisma/schema/[entity].prisma` files

Generates all Prisma schema files from the architecture doc's data models, defines all relations, and runs `npx prisma generate`. Run with `all` to process every model in dependency order.

**Gate:** All FK references resolve, relations are consistent on both sides, `prisma generate` succeeds.

---

### Phase 4b — Backend Module Generation

```
/phase4b-backend-modules <MODULE_NAME> | all
```

**Example:** `/phase4b-backend-modules AUTH` or `/phase4b-backend-modules all`

Agent: Backend Engineer | Skill: `MODULE_TEMPLATE` | Reads: `docs/brd.md` (module section), `docs/architecture.md` | Output: module code

Requires Phase 4a to be complete. Generates Zod schemas, routes, controllers, and middleware — using the already-generated Prisma client. Pass a module name for one module, or `all` to generate every module in dependency order.

**Gate:** ⚠️ VERIFY — Zod schemas become the frontend's source of truth. After the **first** module, run `/phase12-review` before generating more.

---

### Phase 5 — Backend Testing

```
/phase5-backend-testing <MODULE_NAME> | all
```

**Example:** `/phase5-backend-testing AUTH` or `/phase5-backend-testing all`

Agent: QA Engineer | Skill: `TESTING_CONVENTIONS` | Reads: `docs/brd.md` (acceptance criteria), Phase 4b module code, `docs/architecture.md`

Generates behavioral unit tests, integration tests, and Zod validation tests. Pass a module name for one module, or `all` to test every module. If `skills/TESTING_CONVENTIONS.md` doesn't exist yet, this phase creates it.

**Gate:** Run tests. Confirm they pass AND the test quality is good.

---

### Phase 6 — Database Migrations & Seed Data

```
/phase6-migrations
```

Agent: Backend Engineer | Skill: `MIGRATION_TEMPLATE` | Reads: `docs/brd.md`, `docs/architecture.md`, Phase 4a schemas, Phase 4b modules | Outputs: `prisma/seed.ts`, `docs/seed-data.md`

Auto-detects database type. **SQL:** generates migration scripts, rollback scripts, and seed data. **MongoDB:** skips migrations (Prisma handles schema), generates Prisma seed scripts for all models with per-environment data (dev/staging/test). Does not generate index verification scripts — `prisma db push` handles indexes.

**Also generates `docs/seed-data.md`** — a quick reference documenting:
- Auto-generated test account credentials (username/password for each role)
- Default bootstrap data (organizations, teams, etc.)
- Environment-specific seed data summary (dev/staging/test)
- How to reset the database locally
- Common testing scenarios

**Gate:** SQL: migrations run up and down cleanly. MongoDB: seed data passes Zod validation, FK relationships are consistent. Reference `docs/seed-data.md` is created and test accounts are documented.

---

### Phase 7 — UI/UX Design & Style Guide

```
/phase7-ui-design <optional: design rules>
```

**Examples:**
- `/phase7-ui-design` — generate designs using defaults
- `/phase7-ui-design mobile first, dark mode default`
- `/phase7-ui-design minimal sidebar`

**Before running:** drop any reference images (`.png`, `.jpg`, `.webp`, etc.) into `docs/design-references/`. Phase 7 reads them automatically.

Agent: UI Designer | Reads: `docs/brd.md` (Page Manifest from user stories), `docs/architecture.md`, `docs/design-references/` | Output: `docs/ui-design.md`

Generates everything in a single file: the Style Guide (exact Tailwind classes, shadcn variants, hex colors), wireframes, user flows, component inventory, responsive behavior, and state designs. Automatically reads any images in `docs/design-references/` and extracts colors, typography, spacing, and component patterns — visual style only, never features. Custom design rules (e.g., "mobile first", "dark mode default") override extracted styles. Phase 9 also reads `docs/design-references/` as a visual consistency check when generating pages.

**Gate:** Does every page in the Page Manifest have a wireframe? Is every style guide rule specific enough to produce identical results across independently prompted pages?

---

### Phase 8 — Frontend API Modules

```
/phase8-frontend-api <MODULE_NAME>
```

**Example:** `/phase8-frontend-api AUTH`

Agent: Frontend Engineer | Skill: `API_STANDARD` | Reads: `docs/brd.md` (module section), Phase 4b Zod schemas, `docs/architecture.md`

Copies Zod schemas from backend, generates TypeScript types, endpoint configs, service layer, React Query hooks, and mock data factories for one module.

**Gate:** Do copied Zod schemas exactly match the backend?

---

### Phase 9 — Page Generation

```
/phase9-pages <PAGE_NAME>
```

**Example:** `/phase9-pages DashboardPage` or `/phase9-pages LoginPage`

Agent: Frontend Engineer | Reads: `docs/brd.md` (module section), `docs/ui-design.md` (wireframe + style guide), `docs/design-references/`, Phase 8 hooks/types

Builds one page at a time using Tailwind + shadcn/ui, following the style guide exactly. Reads `docs/design-references/` images as a visual consistency check. Implements all states: loading, empty, error, populated.

**Gate:** Does the page match the design? After the **first** page, run `/phase12-review` before generating more.

---

### Phase 10 — Frontend Testing

```
/phase10-frontend-testing <MODULE_OR_PAGE_NAME>
```

**Example:** `/phase10-frontend-testing DashboardPage`

Agent: QA Engineer | Skill: `TESTING_CONVENTIONS` | Reads: `docs/brd.md` (acceptance criteria), Phase 9 page, Phase 8 mock data

Generates behavioral component tests, hook tests, form validation tests, and accessibility tests.

**Gate:** Run tests. Confirm they pass AND the test quality is good.

---

### Phase 11 — Integration & E2E Testing

```
/phase11-e2e
```

Agent: QA Engineer | Skill: `E2E_PATTERNS` | Reads: `docs/brd.md`, `docs/architecture.md`, `docs/ui-design.md`

Generates E2E test suites covering user flows, happy paths, error paths, cross-module integration, and auth flows.

**Gate:** All E2E flows pass against a running backend.

---

### Phase 12 — Code Review (Rolling)

```
/phase12-review <optional: what to review>
```

**Examples:**

- `/phase12-review first backend module AUTH`
- `/phase12-review full backend track`
- `/phase12-review first frontend page DashboardPage`
- `/phase12-review` (auto-detects checkpoint based on progress)

Agent: Software Architect | Skill: `REVIEW_CHECKLIST` | Reads: `docs/brd.md`, `docs/architecture.md`, relevant code

Reviews code for security, performance, consistency, missing pieces, and API contract alignment. Run this at checkpoints — not just at the end.

**Gate:** All critical issues resolved before proceeding.

---

### Phase 13 — Documentation

```
/phase13-docs
```

Agent: Technical Writer | Skill: `DOC_TEMPLATES` | Reads: `docs/brd.md`, `docs/architecture.md`, `docs/seed-data.md`, `docs/progress.md`, `docs/changes.md` (if exists), Phase 4b Zod schemas

Generates comprehensive project documentation:
- **README.md** — project overview, tech stack, setup instructions, project structure
- **API documentation** — endpoints, request/response examples, auth requirements, error codes
- **Environment variables documentation** — all required `.env` variables
- **Developer onboarding guide** — includes test account reference (from `docs/seed-data.md`), running tests, and adding new modules
- **Architecture decision records** — key decisions and rationale
- **Change Management Guide** (if applicable) — documents how to use `/phase-change` for mid-project requirement changes, references `docs/changes.md` audit trail

**Key integration:** The onboarding guide includes:
- Setup steps that reference `docs/seed-data.md` for test credentials
- Instructions for using `/phase-change` to log requirement changes mid-project
- How the `/phase-change` command automatically updates BRD, architecture, and creates audit trail entries

**Gate:** Does the README setup actually work? Do API doc examples match reality? Is the onboarding guide complete enough for a new developer?

---

### Phase 14 — Deployment Configuration

```
/phase14-deployment
```

Agent: DevOps Engineer | Skill: `INFRA_STANDARD` | Reads: `docs/brd.md`, `docs/architecture.md`, Phase 13 docs

Generates Dockerfiles, Docker Compose, CI/CD pipeline, env templates, health checks, and production deployment checklist.

**Gate:** Does Docker Compose work locally? Does CI/CD match your infrastructure?

---

## Workflow Order

```
/discover (required — run until concept is solid)
  └── Phase 1 — BRD (VERIFY)
        └── Phase 2 — Planning
              └── Phase 3 — Architecture
                    ├── Backend Track:  Phase 4a → 4b → 5 → 6    (can run in parallel with Phase 7)
                    └── Design Track:   Phase 7
                                              ↘
                    Both tracks complete → Phase 8 → 9 → 10 → 11 → 12 → 13 → 14
```

After Phase 3, the backend track and design track can run in parallel (two separate Claude Code sessions).

**Backend track order:** Phase 4a generates all Prisma models first → Phase 4b generates modules one by one against the stable schema.

---

## Code Review Checkpoints

Run `/phase12-review` at these points — don't wait until the end:

| When                                | Why                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| After first backend module (4b)     | Catch pattern-level issues before generating more modules |
| After backend track (Phases 4a-6)   | Cross-module consistency, migration correctness           |
| After first frontend page           | Catch UI pattern issues before generating more pages      |
| After frontend track (Phases 8-10)  | Cross-page consistency, API contract alignment            |
| After E2E (Phase 11)                | Final security + performance sweep                        |

---

## Skills

Skills are reusable reference documents encoding your conventions. They survive across projects and improve over time.

| Skill                      | Status                         | Used In           |
| -------------------------- | ------------------------------ | ----------------- |
| `BRD_FORMAT.md`            | ✅ Ready                       | Phase 1           |
| `MODULE_TEMPLATE.md`       | ✅ Ready                       | Phase 4a, 4b      |
| `API_STANDARD.md`          | ✅ Ready                       | Phase 8           |
| `ARCHITECTURE_STANDARD.md` | ✅ Ready                       | Phase 3, 4a, 4b, 12 |
| `TESTING_CONVENTIONS.md`   | ✅ Ready                       | Phase 5, 10       |
| Style Guide (in `ui-design.md`) | Created per-project by Phase 7 | Phase 9      |
| `MIGRATION_TEMPLATE.md`    | Add when ready                 | Phase 6           |
| `E2E_PATTERNS.md`          | Add when ready                 | Phase 11          |
| `REVIEW_CHECKLIST.md`      | Add when ready                 | Phase 12          |
| `DOC_TEMPLATES.md`         | Add when ready                 | Phase 13          |
| `INFRA_STANDARD.md`        | Add when ready                 | Phase 14          |

Skills you don't have yet won't block you — the phase commands handle missing skills gracefully. After your first project, extract patterns from what worked into new skill docs.

---

## Extending

**Add a skill:** Create a `.md` file in `skills/` (Purpose → Rules → Templates → Examples → Anti-patterns). The relevant phase command will pick it up automatically.

**Add a agent:** Create a `.md` file in `agents/` (Identity → Perspective → Priorities → What You Produce → What You Do Not Do).

**Refine over time:** When you correct the AI's output, note what you changed. If the same correction happens twice, add a rule to the relevant skill doc.
