# API Template

Lightweight backend starter for the team's fullstack projects. Built with TypeScript, Express 5, Prisma (MongoDB), and Zod — structured so new modules follow a consistent pattern from day one.

## Stack

- Node.js + TypeScript
- Express 5
- Prisma ORM (MongoDB)
- Zod — request validation and schema definitions
- Redis — optional caching and session features
- Swagger/OpenAPI — auto-generated API docs
- Socket.IO — real-time events
- Cloudinary — file/image uploads
- Mocha — testing

## Project Structure

```
app/
├── auth/               # JWT auth (login, register, refresh)
├── user/               # User CRUD
├── person/             # Person profile management
├── notification/       # In-app notifications
├── metrics/            # Usage and performance metrics
├── systemLog/          # Audit logging
└── template/           # Starter module — copy this when adding a new module

config/
├── config.ts           # Environment variables
├── database.ts         # Prisma client
├── redis.ts            # Redis client
├── security.ts         # CORS, helmet, rate limiting
├── upload.config.ts    # Multer + Cloudinary upload config
└── metrics.config.ts

helper/                 # Shared utilities (cloudinary helper, etc.)
docs/                   # OpenAPI specs, Postman setup, deployment guides
```

Each module follows the same structure: `index.ts` → `[module].router.ts` → `[module].controller.ts`.

## Quick Start

```bash
npm install
```

Create `.env`:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/your-db
JWT_SECRET=replace_with_secure_secret
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=http://localhost:3000
CORS_CREDENTIALS=true
```

Run locally:

```bash
npm run prisma-generate
npm run dev
```

## API Basics

- Health check: `GET /` and `GET /health`
- Base path: `/api`
- Swagger UI (non-production): `/api/swagger`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run prod` | Run compiled server |
| `npm run test` | Run Mocha tests |
| `npm run lint` | Run ESLint |
| `npm run prisma-generate` | Generate Prisma client |
| `npm run export-docs` | Generate OpenAPI/Postman docs |

## Docker

```bash
docker compose up -d --build
```

See `docs/DOCKER_SETUP.md` for full setup steps.

## License

MIT
