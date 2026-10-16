# Core Invariants — DevLab Portal

1. **250-Line Limit**: Every single file across `apps/api` and `apps/web` must stay strictly under 250 lines of code.
2. **OIDC & Cryptography**:
   - RS256 key pair rotation using Node `crypto`.
   - Immutable audit log trigger on database mutations.
3. **Control Plane & Kill-Switch**:
   - Redis Pub/Sub topic `app.state.changed` broadcasts kill-switch events in sub-5ms.
   - Apollo GraphQL schema must expose both queries and real-time subscriptions.
4. **Next.js Page & Layout Invariant (Pure SSR Wrappers)**:
   - All `page.tsx` and `layout.tsx` files MUST remain Server Components (`SSR`).
   - NEVER place `"use client"` on `page.tsx` or `layout.tsx`.
   - Pages and layouts act purely as server wrappers (metadata, prefetching, server fetching, rendering client views).
   - Interactive UI, hooks, and browser APIs must live in `features/<feature>/components/<view>.tsx`.
5. **Route Grouping**: All authentication pages must be placed under `app/(auth)/...`.

6. **Feature-Scoped TanStack Query Hook Encapsulation**:
   - Direct inline calls to `useQuery`, `useMutation`, or raw `apiClient`/`fetch` calls inside UI components are strictly forbidden.
   - All server state queries, mutations, query keys, and SSR prefetch helpers must be encapsulated in dedicated files under `features/<feature>/api/` (e.g., `get-<resource>.ts`, `create-<resource>.ts`).
   - Each hook module must export: canonical `<resource>QueryKey()`, custom hook `use<Resource>Query()` or `use<Action>Mutation()`, and optional `prefetch<Resource>()`.
   - UI components must exclusively consume these exported custom hooks.
