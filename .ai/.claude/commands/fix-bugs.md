# Fix Bugs - Automated Post-Build Stabilization

> **Auto Mode:** Run fix loops automatically until required checks pass, or stop only when a hard blocker is reached.

## Purpose

Use this command after `/build`, `/continue`, or any phase run that leaves compile errors, failing tests, or broken flows.

This command focuses on **stabilization**, not feature expansion.

## Input

`$ARGUMENTS` is optional and can contain:
- `all` (default): full-project stabilization
- `backend`: API-only fixes
- `frontend`: app-only fixes
- `phase:<N>`: prioritize fixes for one phase's outputs first
- free text with known failures (paste error summary)

If no arguments are provided, treat scope as `all`.

---

## Agent Role

Adopt the agent defined in `agents/software-architect.md`. Read it now before proceeding.

In this role:
- Prioritize system correctness and cross-layer contract integrity
- Fix root causes, not symptoms
- Keep changes minimal and aligned with BRD + architecture

---

## Load Context

Read these files before fixing:
- `docs/progress.md` (if present)
- `docs/brd.md`
- `docs/architecture.md`
- `docs/ui-design.md` (if present)
- `docs/changes.md` (if present)

Then infer likely failure origin from phase ownership:
- Backend schema/contracts: Phases 4a, 4b, 5, 6
- Frontend contracts/pages: Phases 8, 9, 10
- Integration flows: Phase 11
- Cross-cutting quality/security: Phase 12

---

## Global Rules

1. **Automatic loop:** continue fixing and re-running checks until all required checks pass.
2. **Minimal patches:** edit the smallest set of files necessary for each failure.
3. **No silent contract drift:** if backend schema/response changes, update corresponding frontend Zod/types/hooks.
4. **No broad regenerations by default:** patch targeted files first; regenerate a full phase only when patching is riskier.
5. **Preserve intent:** fixes must remain consistent with BRD requirements and architecture decisions.
6. **Check after every fix:** re-run the failed check immediately, then downstream checks.
7. **Cap loops:** stop after 8 full fix cycles if hard blockers persist, then output a blocker report.

---

## Required Check Matrix

Run checks based on scope:

### Deterministic check order

Use these check IDs and run them in this exact order:

- **C1 (API build):** in `templates/api/` -> `npm run build`
- **C2 (API tests):** in `templates/api/` -> `npm run test`
- **C3 (APP typecheck):** in `templates/app/` -> `npm run typecheck`
- **C4 (APP build):** in `templates/app/` -> `npm run build`
- **C5 (Mocked E2E):** in `templates/app/` -> `npm run test:e2e -- --grep @phase10-mocked`
- **C6 (Live E2E):** in `templates/app/` -> `npm run test:e2e -- --grep @phase11-live`

### Scope to pipeline mapping

- `backend` -> C1 -> C2
- `frontend` -> C3 -> C4 -> C5
- `all` -> C1 -> C2 -> C3 -> C4 -> C5 -> C6
- `phase:<N>` -> run owning checks first, then complete the full `all` pipeline:
  - `phase:4a|4b|5|6` -> start C1
  - `phase:8|9|10` -> start C3
  - `phase:11` -> start C6 (then run C1..C5 if stale/failed)
  - `phase:12|13|14` -> start C1

### Live integration requirement

Before C6, ensure backend API is running and reachable.

If live tests fail due to environment unavailability (server, DB, credentials), treat as infrastructure blocker and report clearly.

---

## Fix Loop Procedure

Repeat until all required checks pass:

1. Run checks in pipeline order for the chosen scope.
2. On first failure:
   - isolate failing file(s) and root cause
   - apply minimal fix
   - re-run the failed check ID only (e.g., C4)
   - if it passes, continue from the next check ID in sequence
3. If the same failure repeats twice:
   - reassess root cause at architecture/contract layer
   - patch upstream source of truth, then re-run dependent checks
4. If an upstream check fails after a downstream fix, restart from the earliest failed check ID and proceed forward.
5. Track touched areas by phase ownership (4b/8/9/10/11/etc.) for logging.

---

## Progress Logging

After successful stabilization, append a row to `docs/progress.md`:

If file does not exist, create:
```
# Project Progress

| Phase | Name | Scope | Status | Date | Timestamp | Notes |
|-------|------|-------|--------|------|-----------|-------|
```

Then append:
`| - | Bug Fix | {scope} | ✅ Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | Fixed until checks pass: {list of commands} |`

If blocked after 8 cycles, append:
`| - | Bug Fix | {scope} | ⚠️ Stale | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | Blocked: {concise blocker summary} |`

---

## Output

When all checks pass, output:

```
=== BUG FIX COMPLETE ===

Scope: {scope}
Cycles: {N}

Checks passed:
- [list]

Files fixed:
- [path list]

Notes:
- [important contract/alignment notes]
```

If blocked, output:

```
=== BUG FIX BLOCKED ===

Scope: {scope}
Cycles attempted: {N}

Passing checks:
- [list]

Failing checks:
- [list]

Blockers:
- [what is preventing auto-resolution]

Recommended manual actions:
1. ...
2. ...
```
