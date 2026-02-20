Adopt the agent defined in `agents/backend-engineer.md`. Read it now before proceeding.

If `skills/MIGRATION_TEMPLATE.md` exists, read it and follow its conventions for migration file naming, index conventions, and seed data format.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — data models, ERD, and database type
- Review the finalized backend modules from Phase 4 to ensure output matches the actual Zod schemas, not just the architecture doc

## Detect database type

Check `docs/architecture.md` (or Prisma schema `datasource` block) to determine the database type.

---

## If SQL database (PostgreSQL, MySQL, etc.)

Generate the following for each model:
- Migration scripts (create table, indexes, foreign keys) in dependency order
- Rollback scripts for each migration
- Seed data scripts with realistic test data
- Seed data for different environments (dev, staging, test)

📋 REVIEW GATE: Do migrations match the finalized models from Phase 4 (not just Phase 3)? Can migrations run up and down cleanly?

---

## If MongoDB (Prisma + MongoDB)

MongoDB is schemaless — traditional migration scripts are unnecessary. Prisma handles schema via `npx prisma db push`. Instead, focus on **seed data and index management**.

Generate the following:
- **Prisma seed script** (`prisma/seed.ts`) that creates realistic test data for **all** models in dependency order
- Seed data per environment (dev, staging, test) with different data volumes:
  - `dev`: Small dataset (~5–10 records per model) with edge cases
  - `staging`: Medium dataset (~50–100 records per model) simulating real usage
  - `test`: Minimal dataset (~2–3 records per model) for fast test runs
- **`package.json` seed command**: `"prisma": { "seed": "ts-node prisma/seed.ts" }`
- **Do NOT** generate an index verification script — `prisma db push` already creates indexes defined in the schema

### Seed data rules:
- Use `prisma.{entity}.createMany()` where possible for performance
- Respect FK dependencies — seed parent models before children
- Use realistic data (real-looking names, emails, dates) not "test1", "test2"
- Include edge cases: empty optional fields, max-length strings, boundary dates
- Seed data must pass Zod validation — match the schemas from Phase 4 exactly
- Make seed scripts idempotent — check for existing data or use `deleteMany()` before seeding

📋 REVIEW GATE: Does seed data pass Zod validation for every model? Are FK relationships consistent? Is the data realistic enough for meaningful dev/staging testing?

---

## Generate Seed Data Documentation

After generating seed scripts, create **`docs/seed-data.md`** with the following sections:

### 1. Test Accounts
Document all auto-generated credentials for each user role:
```
| Role | Username | Password | Email |
|------|----------|----------|-------|
| Admin | admin | [auto-generated] | admin@example.com |
| User | user | [auto-generated] | user@example.com |
```
Include one example account per role that developers can use immediately for manual testing.

### 2. Default Bootstrap Data
List any pre-seeded organizations, teams, projects, categories, or other foundational data:
- Default Organization name and ID
- Default Teams and their members
- Any other critical seed data developers need to know about

### 3. Environment-specific Data Summary
Brief reference showing what's seeded in each environment:
```
| Environment | Dataset Size | Purpose |
|-------------|--------------|---------|
| dev | Small (~5-10 records) | Local development with edge cases |
| staging | Medium (~50-100 records) | Production-like testing |
| test | Minimal (~2-3 records) | Fast test suite runs |
```

### 4. How to Reset the Database
Step-by-step instructions for developers to reset their local environment:
```bash
# Step 1: Install dependencies (if needed)
npm install

# Step 2: Push schema to database
npx prisma db push          # (MongoDB)
# or
npx prisma migrate deploy   # (SQL)

# Step 3: Run seed script
npm run seed
```

### 5. Test Data Sources & Generation
Reference where realistic test data comes from:
- Faker.js for names, emails, dates
- Fixture files or JSON fixtures
- Real-world data patterns used

### 6. Common Testing Scenarios Quick Reference
Examples like:
- "To test admin features, login as: admin / [password]"
- "Default organization has 3 teams with 5 members each"
- "Sample products are in the ACME Corp organization"

---

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 6 | Migrations | — | ✅ Complete | YYYY-MM-DD | {summary} |`
