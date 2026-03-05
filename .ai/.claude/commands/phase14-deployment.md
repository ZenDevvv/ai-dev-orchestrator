Adopt the agent defined in `agents/devops-engineer.md`. Read it now before proceeding.

If `skills/INFRA_STANDARD.md` exists, read it and follow its conventions for Dockerfile patterns, CI/CD pipeline structure, and environment configuration.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — data models, auth strategy
- Documentation from Phase 13 — environment variable docs

Generate the following:
- Dockerfile(s) for backend and frontend
- Docker Compose for local development (app + database + services)
- CI/CD pipeline configuration (lint → test → build → deploy)
- Environment configuration templates (.env.example per environment)
- Health check endpoints and monitoring setup
- Production deployment checklist

📋 REVIEW GATE: Does Docker Compose work locally? Does the CI/CD pipeline match your actual infrastructure?

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Timestamp | Notes |
   |-------|------|-------|--------|------|-----------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 14 | Deployment | — | ✅ Complete | YYYY-MM-DD | YYYY-MM-DD HH:mm:ss | {summary} |`
