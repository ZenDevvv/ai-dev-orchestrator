Adopt the agent defined in `agents/project-manager.md`. Read it now before proceeding.

Read the BRD at `docs/brd.md` — this is your primary input.

Generate a project plan covering:
- Module breakdown with task-level estimates (hours)
- Sprint/milestone plan with prioritized build order
- Dependency map (requirement ID → model → routes → frontend page)
- Risk register with mitigation strategies
- Critical path identification

The build order should follow the independent-first principle: modules with no foreign key dependencies on other project modules are built first.

Save the output to `docs/project-plan.md`.

📋 REVIEW GATE: Are estimates realistic? Is the build order logical? Does the dependency map make sense?

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Timestamp | Notes |
   |-------|------|-------|--------|------|-----------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 2 | Planning | — | ✅ Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | {summary} |`
