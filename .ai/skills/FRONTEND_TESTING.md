# Frontend Testing Conventions

Frontend tests verify what the user sees and does — not how the code is structured internally. Every test should read like a user story, not a code trace.

**Used in:** Phase 10

---

## Rules

1. **Behavioral only** — test visible output and user interactions, never internal state or implementation details
2. **Accessible queries first** — query by ARIA role, label, or visible text before falling back to `data-testid`
3. **4-state coverage** — every component that fetches data must have tests for: loading, empty, error, and populated states
4. **Real interactions** — use `userEvent` (not `fireEvent`) to simulate typing, clicking, and submitting
5. **No implementation coupling** — never assert on component internals, internal function calls, or state values directly
6. **Mock at the boundary** — mock service layer functions, not internal component logic

---

## Tools

```
@testing-library/react      — render, screen, within
@testing-library/user-event — userEvent.click(), userEvent.type(), userEvent.selectOptions()
@testing-library/jest-dom   — toBeInTheDocument(), toBeVisible(), toHaveValue(), etc.
vitest                      — test runner (or jest if the project uses it)
msw                         — mock service worker for API-level mocking (preferred over mocking hooks directly)
```

---

## File Structure

```
src/
├── __tests__/
│   ├── pages/
│   │   └── [PageName].test.tsx        # Full page component tests
│   ├── components/
│   │   └── [ComponentName].test.tsx   # Reusable component tests
│   └── hooks/
│       └── [useHookName].test.ts      # Custom hook tests
```

Name test files the same as the component or hook they test.

---

## Query Priority Order

Use in this order — stop at the first one that works:

1. `getByRole` — most accessible and semantically correct
2. `getByLabelText` — for form inputs
3. `getByPlaceholderText` — fallback for unlabeled inputs
4. `getByText` — for visible text content
5. `getByDisplayValue` — for current input values
6. `getByAltText` — for images
7. `getByTitle` — for title attributes
8. `getByTestId` — last resort only, when no accessible query works

---

## Component Test Patterns

### Basic render test
```typescript
import { render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";

describe("UserCard", () => {
  it("renders user name and email", () => {
    render(<UserCard name="Alice" email="alice@example.com" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });
});
```

### 4-state coverage (loading / empty / error / populated)
```typescript
describe("UserList", () => {
  it("shows loading skeleton while data is fetching", () => {
    render(<UserList isLoading={true} users={[]} />);
    expect(screen.getByRole("status")).toBeInTheDocument(); // spinner/skeleton
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows empty state when no users exist", () => {
    render(<UserList isLoading={false} users={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it("shows error message when fetch fails", () => {
    render(<UserList isLoading={false} users={[]} error="Failed to load users" />);
    expect(screen.getByRole("alert")).toHaveTextContent(/failed to load/i);
  });

  it("renders all users when data is available", () => {
    const users = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ];
    render(<UserList isLoading={false} users={users} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
```

### User interaction
```typescript
import userEvent from "@testing-library/user-event";

it("calls onDelete when delete button is clicked", async () => {
  const handleDelete = vi.fn();
  render(<UserCard name="Alice" onDelete={handleDelete} />);

  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  expect(handleDelete).toHaveBeenCalledOnce();
});
```

---

## Hook Test Patterns

Use `renderHook` with your query client wrapper for React Query hooks.

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsers } from "./useUsers";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUsers", () => {
  it("returns user list on success", async () => {
    // Mock the service function
    vi.mocked(userService.getAll).mockResolvedValue({ users: [{ id: "1", name: "Alice" }] });

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.users).toHaveLength(1);
  });

  it("returns error state on failure", async () => {
    vi.mocked(userService.getAll).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});
```

---

## Form Test Patterns

### Validation — invalid submission
```typescript
it("shows validation errors when submitting empty form", async () => {
  render(<LoginForm onSubmit={vi.fn()} />);

  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(screen.getByText(/password is required/i)).toBeInTheDocument();
});
```

### Validation — valid submission calls handler
```typescript
it("calls onSubmit with form data when valid", async () => {
  const handleSubmit = vi.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "secret123");
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: "user@example.com",
    password: "secret123",
  });
});
```

### Field-level error clearing
```typescript
it("clears email error when user starts typing", async () => {
  render(<LoginForm onSubmit={vi.fn()} />);
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();

  await userEvent.type(screen.getByLabelText(/email/i), "a");
  expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
});
```

---

## Accessibility Test Patterns

```typescript
it("form inputs have accessible labels", () => {
  render(<LoginForm onSubmit={vi.fn()} />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

it("error messages are announced to screen readers", async () => {
  render(<LoginForm onSubmit={vi.fn()} />);
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

  const emailError = screen.getByText(/email is required/i);
  expect(emailError).toHaveAttribute("role", "alert");
});

it("modal dialog traps focus", async () => {
  render(<ConfirmDialog open={true} onConfirm={vi.fn()} />);
  const dialog = screen.getByRole("dialog");
  expect(dialog).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /confirm/i })).toHaveFocus();
});
```

---

## Anti-Patterns

| Anti-pattern | Problem | Fix |
|---|---|---|
| `getByTestId("submit-btn")` | Brittle, not accessible | Use `getByRole("button", { name: /submit/i })` |
| `expect(component.state.isLoading).toBe(false)` | Tests internal state | Test what user sees instead |
| `expect(mockService).toHaveBeenCalled()` (without user action) | Tests implementation | Test visible result of the call |
| `fireEvent.click()` | Doesn't simulate real browser events | Use `userEvent.click()` |
| Snapshot tests for complex components | Brittle, uninformative on failure | Test specific elements and behaviors |
| Mocking the component you're testing | Defeats the purpose | Mock only external dependencies (services, API) |
| Testing a loading state with `isLoading={false}` | Wrong prop | Use realistic props that match the state you're testing |
