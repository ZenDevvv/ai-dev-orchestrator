# App Template

Frontend starter for the team's fullstack projects. Built with React Router v7, TypeScript, Tailwind CSS, and shadcn/ui — structured so new pages and modules slot in consistently.

## Stack

- React Router v7 — file-based routing with SSR support
- TypeScript
- Tailwind CSS + shadcn/ui — component library and styling
- Vite — dev server and build tool
- TanStack Query (React Query) — server state and data fetching
- Zod — schema validation (copied from backend per module)
- Axios — HTTP client via a shared API client

## Project Structure

```
app/
├── components/
│   ├── ui/             # shadcn/ui primitives (Button, Input, Dialog, etc.)
│   ├── molecule/       # Composed UI components (DataTable, ComboBox, etc.)
│   ├── organisms/      # Feature-level components (AppSidebar, etc.)
│   ├── forms/          # Form components per module
│   └── skeletons/      # Loading skeleton components

├── routes/             # Page components (file-based routing)
│   └── auth/           # Auth pages (login, etc.)

├── layouts/            # Route layout wrappers
│   ├── main-layout.tsx
│   ├── admin-layout.tsx
│   └── auth-layout.tsx

├── hooks/              # React Query hooks per module (use-auth.ts, use-supplier.ts, etc.)
├── services/           # API call functions per module
├── context/auth/       # Auth context and provider
├── zod/                # Zod schemas (copied and kept in sync with backend)
├── types/              # TypeScript types
├── configs/
│   ├── endpoints.ts    # API endpoint constants
│   └── page-titles.ts  # Page title constants
└── lib/
    ├── api-client.ts   # Axios instance with auth headers
    ├── query-client.ts # TanStack Query client config
    └── utils.ts        # Shared utilities
```

Each module follows the same layering: `zod/` → `types/` → `services/` → `hooks/` → `routes/` (page).

## Quick Start

```bash
npm install
npm run dev
```

Set the API base URL in `app/lib/api-client.ts` or via environment variable.

## Playwright E2E

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright runs against a local dev server using `npm run dev:e2e`.

Suggested scoped runs:

```bash
# Frontend-only mocked coverage (Phase 10)
npm run test:e2e -- --grep @phase10-mocked

# Live-backend integration coverage (Phase 11)
npm run test:e2e -- --grep @phase11-live
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with ESLint |
| `npm run frontend:check` | Typecheck + production build sanity check |
| `npm run test:e2e` | Run Playwright E2E tests |

## License

MIT
