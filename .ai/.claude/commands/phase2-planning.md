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

Follow the canonical logging spec in `docs/progress.md`.

Record completion with:
- `Phase`: `2`
- `Name`: `Planning`
- `Scope`: `—`
- `Status`: `✅ Complete`
- `Notes`: one-line summary of planning output
