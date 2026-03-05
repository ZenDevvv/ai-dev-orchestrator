Adopt the agent defined in `agents/software-architect.md`. Read it now before proceeding.

If `skills/REVIEW_CHECKLIST.md` exists, read it and follow its security, performance, and consistency checks.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — data models, route map, error standards

The user will specify what to review: $ARGUMENTS

If no specific scope is given, determine the checkpoint based on project progress:
1. **After first backend module** — Review controller patterns, auth guards, error handling, Zod structure. This is the most important checkpoint — patterns here propagate to all modules.
2. **After backend track complete** — Cross-module consistency, migration correctness, query patterns, N+1 queries, missing indexes.
3. **After first frontend page** — Component structure, style guide adherence, hook usage patterns.
4. **After frontend track complete** — Cross-page consistency, API contract alignment, state management, Zod schema drift.
5. **Final sweep** — Full security review, performance review, everything together.

Review the code for:
- **Security:** auth guards, input sanitization, no exposed secrets, injection prevention
- **Performance:** N+1 queries, missing indexes, unnecessary re-renders, missing pagination
- **Consistency:** naming conventions, error handling patterns, structure matches architecture
- **Missing pieces:** unhandled edge cases, missing error boundaries, missing loading states
- **API contract:** frontend types still match backend Zod schemas

📋 REVIEW GATE: Prioritize security and performance findings. All critical issues must be resolved before proceeding.

## Log Progress

Follow the canonical logging spec in `docs/progress.md`.

For each review run, record completion with:
- `Phase`: `12`
- `Name`: `Code Review`
- `Scope`: `{checkpoint or scope}`
- `Status`: `✅ Complete`
- `Notes`: one-line summary
