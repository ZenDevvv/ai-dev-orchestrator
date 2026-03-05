# Frontend Testing Conventions

Phase 10 frontend tests are Playwright-based and mocked at the network boundary. They verify user-visible behavior without depending on a live backend.

**Used in:** Phase 10

---

## Rules

1. **Behavioral only** - test visible output and user interactions, never internal state or implementation details.
2. **Accessible queries first** - prefer `getByRole`, `getByLabel`, and visible text before `getByTestId`.
3. **4-state coverage** - every data-driven page must cover loading, empty, error, and populated states.
4. **Real interactions** - use real browser actions in Playwright (`click`, `fill`, keyboard navigation).
5. **No implementation coupling** - never assert internal function calls or component internals.
6. **Mock at the boundary** - use `page.route` to stub API responses per test scenario.
7. **Tag coverage scope** - include `@phase10-mocked` in every Phase 10 test title.

---

## Tools

```text
@playwright/test            - browser automation and assertions
page.route                  - request stubbing for state and error scenarios
web-first assertions        - toBeVisible(), toHaveText(), toHaveURL(), etc.
```

---

## File Structure

```text
templates/app/tests/e2e/
|- [page-name].phase10.mocked.spec.ts
`- ...
```

Name files by page/flow and include `.phase10.mocked.spec.ts`.

---

## Query Priority Order

Use in this order and stop at the first stable selector:

1. `page.getByRole`
2. `page.getByLabel`
3. `page.getByPlaceholder`
4. `page.getByText`
5. `page.getByAltText`
6. `page.getByTitle`
7. `page.getByTestId` (last resort)

---

## Mocked Flow Pattern

```typescript
import { expect, test } from "@playwright/test";

test("login validation shows required errors @phase10-mocked", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ errors: [{ message: "Email is required" }] }),
    });
  });

  await page.goto("/login");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.getByText(/email is required/i)).toBeVisible();
});
```

---

## Execution Gate

From `templates/app/`, run:

```bash
npm run typecheck
npm run build
npm run test:e2e -- --grep @phase10-mocked
```

All three must pass before considering Phase 10 complete.

---

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| Live API dependency in Phase 10 | Flaky tests tied to backend availability | Stub requests with `page.route` |
| Unscoped Playwright suite in Phase 10 | Phase gate runs unrelated specs | Tag tests with `@phase10-mocked` and run grep |
| CSS-only selectors | Brittle tests | Use accessible selectors first |
| Asserting internals | Implementation coupling | Assert visible behavior only |
