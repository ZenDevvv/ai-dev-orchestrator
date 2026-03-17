Adopt the agent defined in `agents/software-architect.md`. Read it now before proceeding.

If `skills/REVIEW_CHECKLIST.md` exists, read it and follow its security, performance, and consistency checks.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` - data models, route map, auth strategy, and error standards

The user will specify what to review: `$ARGUMENTS`

If no specific scope is given, determine the checkpoint based on project progress:
1. After first backend module - review controller patterns, auth guards, error handling, and Zod structure. This is the most important checkpoint because pattern bugs here propagate.
2. After backend track complete - review cross-module consistency, migration correctness, query patterns, auth continuity, and missing indexes.
3. After first frontend page - review component structure, style guide adherence, hook usage patterns, and shared client usage.
4. After frontend track complete - review cross-page consistency, API contract alignment, state management, auth transport, and Zod schema drift.
5. Final sweep - review full security, performance, and integration behavior together.

Review the code for:
- Security: auth guards, input sanitization, no exposed secrets, injection prevention
- Performance: N+1 queries, missing indexes, unnecessary re-renders, missing pagination
- Consistency: naming conventions, error handling patterns, structure matches architecture
- Missing pieces: unhandled edge cases, missing error boundaries, missing loading states
- API contract: frontend types still match backend Zod schemas
- Auth transport continuity: login/session creation, shared `apiClient` usage, cookies or session propagation, protected mutation behavior, and any raw `fetch`, `withCredentials: false`, or manual auth-header divergence on internal app routes

## Review Gate

Prioritize security and auth-transport findings. All critical issues must be resolved before proceeding.

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

For each review run, record completion with:
- `Phase`: `12`
- `Name`: `Code Review`
- `Scope`: `{checkpoint or scope}`
- `Status`: `✅ Complete`
- `Notes`: one-line summary
