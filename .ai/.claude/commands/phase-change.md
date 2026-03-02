Adopt the agent defined in `agents/business-analyst.md`. Read it now before proceeding.

Read these context files before proceeding:
- BRD: `docs/brd.md` — current requirements, module IDs, requirement IDs, user stories
- Architecture: `docs/architecture.md` — current data models, routes, ERD
- Progress: `docs/progress.md` — current phase completion state
- Change log: `docs/changes.md` — existing change entries (to determine next CHG-NNN number); if this file doesn't exist, the next number is CHG-001

## Input

The user has described a change to the project: $ARGUMENTS

This may include:
- A new feature or module to add
- A modification to an existing requirement or user story
- A scope cut (removing something)
- A correction to a business rule or acceptance criterion
- A new page or UI flow

## Step 1 — Clarify the change

If the input is ambiguous or the reason for the change is not stated, ask the user:
1. What exactly is changing? (Be specific — which module, requirement, or user story)
2. Why is this change happening? (Stakeholder request, discovery, bug, pivot, legal requirement, etc.)
3. What is the priority of the change? (Must-have / Should-have / Nice-to-have)

Do not proceed past Step 1 until both *what* and *why* are clearly understood.

## Step 2 — Update the BRD

Apply the change to `docs/brd.md`:

- **New feature / module:** Add new user stories (US-NNN, continuing from the last used ID), new requirements (MODULE_ID-NNN), acceptance criteria, and error states following BRD_FORMAT conventions. If it's a new module, assign a new module ID.
- **Modified requirement:** Update the affected requirement in place. Preserve the original requirement ID — never reuse or renumber IDs.
- **Scope cut:** Mark the requirement as `[REMOVED - CHG-NNN]` rather than deleting it. Preservation of removed IDs prevents accidental reuse.
- **New page:** Add to the Page Manifest table.

## Step 3 — Update the Architecture (if needed)

If the change affects data models or API routes, update `docs/architecture.md`:
- Add or modify models, fields, relationships
- Add or modify routes in the route map
- Update the ERD (mermaid) if model structure changed

If the change is requirements-only (business rules, acceptance criteria, priority) with no structural impact, skip this step.

## Step 4 — Write the change log entry

Determine the next CHG-NNN number from `docs/changes.md`.

Create or append to `docs/changes.md` with this entry:

```
## CHG-NNN — YYYY-MM-DD

**Trigger:** {who or what prompted this change}
**Change:** {one-sentence description of what changed}
**Reason:** {the business context — why this was needed}
**BRD impact:** {list of added/modified/removed requirement IDs and user story IDs}
**Architecture impact:** {list of model/route changes, or "None"}
**Phases to re-run:** {list of phase numbers and module/page scope for each}
**Phases unaffected:** {list of phases confirmed unaffected and brief reason}
```

Be specific. "Phase 4 (REPORTS module)" is correct. "Phase 4" alone is not enough.

## Step 5 — Log to progress

Append a row to `docs/progress.md`:

`| — | Change | {CHG-NNN}: {feature name} | 🔄 Changed | YYYY-MM-DD | {one-line summary of what changed and why} |`

## Step 6 — Mark Stale Phases in Progress Log

For each phase listed under "Phases to Re-run" in the impact report (Step 7), scan `docs/progress.md` for any `✅ Complete` rows matching that phase and scope. For each found row, update the Status cell from `✅ Complete` to `⚠️ Stale` and append to its Notes cell: `| Stale: {CHG-NNN} YYYY-MM-DD`

This ensures `/resume` can surface exactly what needs re-running without the user manually tracking it.

If `docs/progress.md` does not exist or has no matching rows for the affected phases, skip this step.

## Step 7 — Output the impact report

Print a clear summary for the user:

```
## Change Logged: CHG-NNN

**What changed:** ...
**Why:** ...

### Docs Updated
- docs/brd.md — {what was added/modified}
- docs/architecture.md — {what was added/modified, or "no changes needed"}
- docs/changes.md — CHG-NNN entry added
- docs/progress.md — change row added

### Phases to Re-run
| Phase | Name | Scope | Reason |
|-------|------|-------|--------|
| ...   | ...  | ...   | ...    |

### Phases Unaffected
| Phase | Name | Reason |
|-------|------|--------|
| ...   | ...  | ...    |
```

⚠️ Do not re-run any phases yourself. Present the impact report and let the user decide what to action next.
