Adopt the agent defined in `agents/business-analyst.md`. Read it now before proceeding.

Follow the BRD format standard defined in `skills/BRD_FORMAT.md`. Read it now before proceeding.

## Load Concept

Read `docs/concept.md` in full. This is the required input for this phase.

If `docs/concept.md` does not exist, stop immediately and output:

```
❌ No concept found.

Run /discover first to define your app concept before generating the BRD.
/discover <your rough app idea>
```

Do not proceed without `docs/concept.md`.

## Concept Scope Lock (Hard Gate)

Before generating `docs/brd.md`, derive locked MVP concept scope from `docs/concept.md`:

1. Find the section titled either:
   - `## Core Features - Must Have (MVP)`, or
   - `## Core Features — Must Have (MVP)`.
2. Parse only top-level bullet items in that section until the next `##` heading.
3. Normalize each bullet as one concept feature and assign deterministic IDs by order:
   - `CF-001`, `CF-002`, `CF-003`, ...
4. Store as ordered `CONCEPT_MVP_ITEMS`.

Hard rules:
- If the section is missing or has zero bullet items, fail this phase immediately.
- Do not reduce or omit concept MVP features based on existing repo/template files.
- Every `CF-xxx` item must be traceable in the BRD coverage matrix before Phase 1 can complete.

## Pre-flight Check

Before generating, check the `## Open Questions` section of `docs/concept.md`.

If it contains any unresolved items, output this warning then continue:

```
⚠️ concept.md has open questions — the BRD may be incomplete in those areas.
   Consider running /discover again to resolve them before proceeding.

   Open questions found:
   - [list each item from the Open Questions section]
```

## Generate BRD

Using the content of `docs/concept.md` as your source of truth, generate a complete Business Requirements Document following the BRD_FORMAT skill exactly:
- Project overview and objectives
- User roles and agents (table format)
- User stories for every user-facing interaction, each with:
  - Unique story ID (US-NNN format)
  - As a / I want to / So that format
  - Module mapping (which module it belongs to)
  - Page mapping (which page(s) this story implies - names must exactly match rows in the Page Manifest)
  - Priority classification
- Page Manifest table derived from user stories (page name, related stories, route)
- Functional requirements grouped by module, each with:
  - Unique module ID (uppercase snake_case: AUTH, USERS, PROJECTS, etc.)
  - Unique requirement IDs (MODULE_ID-NNN format)
  - Description from the user's perspective
  - Given/When/Then acceptance criteria (minimum 2 per requirement; add more for requirements with multiple error paths)
  - Error states with error codes for every failure path
  - Priority classification: **MVP** (required for launch) or **Post-MVP** (future iteration)
- Module-level error states table for cross-cutting errors (errors that apply to every endpoint in a module, e.g., 401 Unauthorized, 403 Forbidden, 429 Rate Limited)
- Non-functional requirements with measurable targets
- Assumptions and constraints
- Out of scope items - Post-MVP features are listed here by name only; do not write acceptance criteria for them
- Required section: `### Concept Coverage Matrix (MVP Lock)` with table schema:
  - `| Concept ID | Concept Feature | Story IDs | Requirement IDs | Page(s) | Module(s) | Status | Notes |`

Concept Coverage Matrix hard rules:
- Matrix must contain exactly one row for every `CF-xxx` in `CONCEPT_MVP_ITEMS`, in the same order.
- Allowed `Status` values: `Covered`, `Backend-Only`.
- Every row must have non-empty `Story IDs` and `Requirement IDs`.
- `Covered` rows must have non-empty `Page(s)` and non-empty `Module(s)`.
- `Backend-Only` rows must have non-empty `Module(s)` and non-empty `Notes` explaining why there is no page.
- No extra rows are allowed beyond locked concept MVP items.

Order modules by independence - modules with no dependencies on other modules come first.

Save the output to `docs/brd.md`.

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

Record completion with:
- `Phase`: `1`
- `Name`: `BRD`
- `Scope`: `—`
- `Status`: `✅ Complete`
- `Notes`: one-line summary of BRD output

## Verification Gate

⚠️ **VERIFY before proceeding to Phase 2.** This document drives everything downstream - invest review time here.

- [ ] Every module has at least 2 requirements
- [ ] Every requirement has >= 2 Given/When/Then criteria
- [ ] Every requirement has at least 1 error state with an error code
- [ ] Every page in the Page Manifest is covered by at least 1 user story
- [ ] Page names in user stories exactly match rows in the Page Manifest
- [ ] No implementation details in requirements (no DB, framework, or endpoint mentions)
- [ ] Post-MVP features appear only in the Out of Scope section - not in module bodies
- [ ] `Concept Coverage Matrix (MVP Lock)` exists with one row per `CF-xxx`
- [ ] Every `CF-xxx` row has Story IDs and Requirement IDs
- [ ] `Covered` rows include both Page(s) and Module(s)
- [ ] `Backend-Only` rows include Module(s) plus Notes justification
- [ ] No concept MVP feature was narrowed or omitted from BRD scope
