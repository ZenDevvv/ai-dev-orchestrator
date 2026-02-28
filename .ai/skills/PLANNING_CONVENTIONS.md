# Planning Conventions

Project planning output conventions for Phase 2. The goal is a plan that a developer can execute without re-reading the BRD — everything they need to know about order, dependencies, and risks should be in the plan.

**Used in:** Phase 2

---

## Rules

1. **Dependency order first** — modules that have no foreign key dependencies go in Sprint 1. Every other module waits until its dependencies are complete.
2. **Risk register is required** — every plan includes a risk register. A plan without identified risks is an incomplete plan.
3. **Each sprint has a deliverable** — not just a task list. The deliverable describes what a working demo looks like at the end of the sprint.
4. **Estimate with test time** — backend module estimates include writing tests. A module is not done until its tests pass.
5. **Per-module iteration** — phases 4b, 5, 8, 9, 10 run one module/page at a time. The plan reflects this with one row per module.
6. **Parallel tracks after Phase 3** — backend track (4a → 4b → 5 → 6) and design track (Phase 7) can run in parallel after Phase 3 is complete.

---

## Module Dependency Ordering

Independent modules first — a module is independent if its Prisma schema has no `@db.ObjectId` references to another module in the same project.

```
Sprint 1: Independent modules (no FK dependencies)
Sprint 2: Modules that depend only on Sprint 1 modules
Sprint 3+: Remaining modules in dependency order
Final sprint: Testing (5, 10, 11) + Deployment (14)
```

**Example ordering:**
```
User (no deps)  → Sprint 1
Organization (no deps) → Sprint 1
Team (depends on User, Organization) → Sprint 2
Project (depends on Team) → Sprint 3
```

---

## Estimation Baseline

| Task type | Baseline estimate |
|---|---|
| Simple CRUD module (backend only) | 1 day |
| Simple CRUD module (backend + tests) | 1.5 days |
| Complex module (auth, payments, file upload) | 3–4 days |
| Frontend API module (Phase 8, per module) | 0.5 days |
| Frontend page (Phase 9, per page) | 1 day |
| Frontend page (complex, with many states) | 1.5–2 days |
| Backend test suite (Phase 5, per module) | 0.5× build time |
| Frontend test suite (Phase 10, per page) | 0.5× build time |
| E2E test suite (Phase 11) | 1–2 days |
| Documentation (Phase 13) | 1 day |
| Deployment config (Phase 14) | 1 day |

These are baselines — adjust up for unfamiliar tech, complex logic, or many edge cases. Adjust down for boilerplate-heavy modules with low business logic.

---

## Risk Scoring

Score each risk: **Likelihood** (1–3) × **Impact** (1–3) = **Score** (1–9)

| Score | Priority |
|---|---|
| 7–9 | 🔴 High — must have a mitigation plan |
| 4–6 | 🟡 Medium — monitor, have a contingency |
| 1–3 | 🟢 Low — acknowledge and accept |

**Common risks to always check:**
- Third-party API availability (payment, email, auth providers)
- Auth complexity (RBAC vs simple auth adds 2–3 days)
- File upload / media handling (Cloudinary, S3 setup)
- Real-time features (Socket.IO adds cross-module complexity)
- MongoDB schema flexibility vs relational-like constraints
- Context window limits for large projects using `/build`

---

## Output Format

### Module Table

```markdown
| Module | Sprint | Dependencies | Complexity | Backend est. | Frontend est. |
|--------|--------|-------------|------------|-------------|---------------|
| AUTH   | 1      | None         | High        | 4 days       | 1 day         |
| USERS  | 1      | None         | Medium      | 1.5 days     | 1 day         |
| TEAMS  | 2      | USERS        | Medium      | 1.5 days     | 1.5 days      |
```

### Sprint Plan

```markdown
## Sprint 1 — Core Foundation
**Deliverable:** Working login, registration, and user profile management

| Phase | Task | Module | Est. |
|-------|------|--------|------|
| 4a    | DB Schema | all | 0.5 days |
| 4b    | Backend module | AUTH | 4 days |
| 4b    | Backend module | USERS | 1.5 days |
| 5     | Backend tests | AUTH | 2 days |
| 5     | Backend tests | USERS | 1 day |
| 7     | UI Design | — | 1 day |
```

### Risk Register

```markdown
## Risks

| Risk | Likelihood | Impact | Score | Priority | Mitigation |
|------|-----------|--------|-------|----------|-----------|
| Stripe integration delays | 2 | 3 | 6 | 🟡 Medium | Use mock payment in Sprint 1; integrate real Stripe in Sprint 3 |
| Auth complexity (RBAC) | 2 | 3 | 6 | 🟡 Medium | Design role model in Phase 3; review after first 4b run |
```

### Critical Path

```markdown
## Critical Path

Longest dependency chain: AUTH → USERS → TEAMS → PROJECTS → REPORTS

Any delay in AUTH delays every subsequent module. Run Phase 12 review after AUTH is complete before generating more modules.
```

---

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Assigning parallel tasks to same sprint without checking dependencies | Team blocks itself | Check FK dependencies before assigning sprint numbers |
| Not accounting for test time in estimates | Sprints always run over | Add 0.5× build time for every Phase 5 and Phase 10 task |
| Marking a module as Sprint 1 if it has FK deps | Module can't be built until deps exist | Move it to the sprint after its last dependency |
| Vague sprint deliverables ("work on backend") | Can't tell if sprint is done | Write specific deliverables ("user can log in and update profile") |
| No risk register | Risks surface as surprises | Always include at minimum 3 risks |
| Estimating without knowing the module's complexity | Under- or over-estimates | Read the BRD's acceptance criteria count and error states before estimating |
