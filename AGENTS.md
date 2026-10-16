# DevLab Portal Agent Guidelines

Master guidelines for AI agents developing on **DevLab Portal (Control Plane, IAM & App Store Platform)**.

All agents must adhere to:

1. **Hard 250-Line Maximum Rule**: No file in `apps/api/` or `apps/web/` may exceed 250 lines. Decompose early at 200 lines.
2. **Detailed JSDoc & Explanatory Comments**: Every service, controller, and resolver method must have comprehensive documentation.
3. **Database Casing**: All tables, models, and DB enums must strictly use lowercase `snake_case`.
4. **Zero Magic Strings & Strict Typing**: Use canonical enums and strict Zod/DTO validation.
5. **Quality Gates & Conventional Commits**: Commits must pass husky commitlint (`feat(scope): ...`).
6. **Next.js Page & Layout Invariant (Pure SSR Wrappers)**: All `page.tsx` and `layout.tsx` files across Next.js apps MUST remain Server Components (`SSR`). NEVER mark `page.tsx` or `layout.tsx` with `"use client"`. They act strictly as server wrappers (handling metadata, SSR prefetching, server data fetching, and rendering client view components). All interactive client logic, state, and browser APIs must reside in dedicated client components under `features/<feature>/components/` or `components/`.
7. **Auth Route Grouping**: All authentication pages must be grouped under `app/(auth)/...`.
8. **Feature-Scoped TanStack Query Hook Encapsulation (FinAI & OrchestrAI Standard)**: Direct inline calls to `useQuery`, `useMutation`, or raw `apiClient`/`fetch` calls inside UI components are strictly forbidden. All server state queries, mutations, query keys, and SSR prefetch helpers must be encapsulated in dedicated files under `features/<feature>/api/` (e.g., `get-<resource>.ts`, `create-<resource>.ts`). Each hook module must export: canonical `<resource>QueryKey()`, custom hook `use<Resource>Query()` or `use<Action>Mutation()`, and optional `prefetch<Resource>()`. Components must exclusively consume these exported custom hooks.
