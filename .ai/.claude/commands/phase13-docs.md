Adopt the agent defined in `agents/technical-writer.md`. Read it now before proceeding.

If `skills/DOC_TEMPLATES.md` exists, read it and follow its conventions for README structure, API doc format, and onboarding guide layout.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — data models, route map
- Seed data reference: `docs/seed-data.md` (generated in Phase 6)
- Progress log: `docs/progress.md` (to understand what's been completed)
- Changes audit trail: `docs/changes.md` (if any mid-project changes were logged)
- The backend Zod schemas from Phase 4 — for accurate API documentation

Generate the following documentation:
- **README.md** — project overview, tech stack, setup instructions, project structure
  - Include section: "Running the Project Locally" with seed data setup
  - Reference `docs/seed-data.md` for test account credentials
- **API documentation** — endpoints, request/response examples from actual Zod schemas, auth requirements, error codes
- **Environment variables documentation** — all required `.env` variables with examples
- **Developer onboarding guide** — run locally, run tests, add a new module
  - Include: "Using Test Accounts" (reference to `docs/seed-data.md`)
  - Include: "Making Changes Mid-Project" with instructions to use `/phase-change` command
  - Document how `/phase-change` updates BRD, architecture, and creates `docs/changes.md` entries
- **Architecture decision records** — key decisions and rationale
- **Change Management Guide** (if `docs/changes.md` exists) — document the change audit trail and how to use `/phase-change`

📋 REVIEW GATE: Does the README setup actually work? Do the API doc examples match the actual implementation?

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

Record completion with:
- `Phase`: `13`
- `Name`: `Documentation`
- `Scope`: `—`
- `Status`: `✅ Complete`
- `Notes`: one-line summary
