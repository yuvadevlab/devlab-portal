# Contributing to DevLab Portal

Thank you for contributing to DevLab Portal! This guide details local development, PR standards, and architectural conventions.

---

## 1. Prerequisites

- **Node.js:** `>= 20.x`
- **pnpm:** `>= 9.x`
- **PostgreSQL:** `>= 15`
- **Redis:** `>= 7.x`

---

## 2. Quick Start

```bash
# Clone and install dependencies
git clone https://github.com/yuvadevlab/devlab-portal.git
cd devlab-portal
pnpm install

# Setup environment variables
cp .env.example .env

# Generate Prisma Client & Run DB push
pnpm db:generate
pnpm db:push

# Seed database with initial tenants & admin user
pnpm db:seed

# Start development servers
pnpm dev
```

---

## 3. Commit Guidelines

We enforce **Conventional Commits** via `commitlint` and `husky`:

- `feat(scope)`: New capability or endpoint.
- `fix(scope)`: Bug fix.
- `chore(scope)`: Dependency updates or build tooling.
- `docs(scope)`: Documentation updates.

---

## 4. Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

---

## 5. Questions & Support

For technical queries, architecture discussions, or contributor guidance, please contact the maintainers at **[yuva.devlab@gmail.com](mailto:yuva.devlab@gmail.com)**.
