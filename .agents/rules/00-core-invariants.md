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

7. **Zero Hardcoded Strings & UI Copy Catalogs**:
   - Direct inline hardcoded strings for user-facing UI text (labels, buttons, tooltips, error banners, modal descriptions) are strictly forbidden.
   - All UI copy must be defined and centralized in `apps/web/src/lib/ui-copy/` catalogs (e.g. `apps.ts`, `auth.ts`, `common.ts`).

8. **Enums Over Raw String Unions (Change Resilience)**:
   - Avoid declaring types as raw string literal unions (e.g. `type Status = "ACTIVE" | "INACTIVE"`).
   - Always declare TypeScript `enum`s or key-value object dictionaries (`as const`).
   - Updating an underlying string value only requires changing the enum definition, leaving consumer code intact.

9. **URL Query Parameters & Route Keys Centralization**:
   - Raw query string fragments (e.g. `"?redirect="`, `"?app="`, `"token"`) are strictly prohibited in application code.
   - Use centralized enums such as `AuthQueryParamKey` from `@/lib/constants/enums` and build URLs using `URLSearchParams` or typed route helpers.

10. **Semantic Component Architecture & 90/10 Hybrid Styling Standard**:

- UI components (cards, tables, buttons, dialogs, drawers, forms, badges, navigation) must declare purpose-revealing semantic classes (e.g. `.dl-card`, `.app-card`, `.process-drawer`, `.dl-table`) defined in domain-scoped modular stylesheets (`< 200 lines`, strictly `< 250 lines`) under `@layer dl-components`.
- Multi-class utility soup in JSX (`className="class-1 class-2 class-3..."`) is strictly prohibited for component definitions; utilities are reserved exclusively for macro layout orchestration (10% glue).
- Component themes, variants, and dimensions must be parameterized via component-scoped CSS variables (e.g. `--card-accent`, `--card-padding`) mapped to `@yuva-devlab/tokens`.
