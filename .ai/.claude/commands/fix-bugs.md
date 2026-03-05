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

### Backend scope (`all` or `backend`)
Run from `templates/api/`:
```bash
npm run build
npm run test
```

### Frontend scope (`all` or `frontend`)
Run from `templates/app/`:
```bash
npm run typecheck
npm run build
npm run test:e2e -- --grep @phase10-mocked
```

### Live integration (`all`)
1. Ensure backend API is running and reachable.
2. Run from `templates/app/`:
```bash
npm run test:e2e -- --grep @phase11-live
```

If live tests fail due to environment unavailability (server, DB, credentials), treat as infrastructure blocker and report clearly.

---

## Fix Loop Procedure

Repeat until all required checks pass:

1. Run check matrix in dependency order:
   - backend build -> backend tests
   - frontend typecheck -> frontend build -> phase10 mocked e2e
   - phase11 live e2e (if scope is `all`)
2. On first failure:
   - isolate failing file(s) and root cause
   - apply minimal fix
   - re-run failed command
   - if it passes, continue with remaining commands
3. If the same failure repeats twice:
   - reassess root cause at architecture/contract layer
   - patch upstream source of truth, then re-run dependent checks
4. Track touched areas by phase ownership (4b/8/9/10/11/etc.) for logging.

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
