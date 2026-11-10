# DevLab Portal Agent Guidelines

Master guidelines for AI agents developing on **DevLab Portal (Control Plane, IAM, App Store & Process Supervision)**.

---

## 1. Core Invariants (Zero Exceptions)

0. **Zero Commits Without Explicit Confirmation (CRITICAL)**:
   - NEVER execute `git commit`, `git push`, or open pull requests in ANY repository unless the user explicitly commands it in the current turn (e.g. "commit these changes", "commit and push").
   - Directives like "start", "proceed", "fix this", "implement", "build", or "test" authorize implementation, building, and running tests ONLY.
   - Always leave changes staged or in the working tree, present verification results, and wait for confirmation.

1. **Standardized Attribution**:
   - All git commit author and committer metadata, documentation, and PR attribution must use `yuva.devlab@gmail.com`.

2. **Organization Standards & `.github` Inheritance**:
   - Branch naming must strictly follow: `^(feat|fix|refactor|perf|chore|docs|test|ci|hotfix)/[a-z0-9-]+$`.
   - Commits must conform to Conventional Commits: `<type>(<optional-scope>): <imperative summary>`.
   - PR descriptions must adhere to the 5-section high-signal standard defined in `yuvadevlab/.github` (Summary, Changes, How to Test, Proof of Verification, Risks).

3. **Hard 250-Line Maximum Rule**:
   - No source file in `apps/api/`, `apps/web/`, or `packages/ui/` may exceed 250 lines. Decompose early at 200 lines.

4. **Pure Platform CSS & Design Tokens**:
   - Utility-first CSS frameworks are prohibited. All styling is implemented using W3C Cascade Layers (`@layer dl-*`) and layout tokens.

5. **Detailed JSDoc & Documentation**:
   - Every service, controller, gateway, and resolver method must have comprehensive JSDoc comments.

6. **Next.js Page & Layout Invariant (Pure SSR Wrappers)**:
   - All `page.tsx` and `layout.tsx` files across Next.js apps MUST remain Server Components (`SSR`). NEVER mark `page.tsx` or `layout.tsx` with `"use client"`.
   - All interactive client logic, state, and browser APIs must reside in dedicated client components under `features/<feature>/components/` or `components/`.
   - All authentication pages must be grouped under `app/(auth)/...`.

7. **Feature-Scoped TanStack Query Hook Encapsulation**:
   - Direct inline calls to `useQuery`, `useMutation`, or raw `fetch` calls inside UI components are strictly forbidden.
   - All server state queries, mutations, query keys, and SSR prefetch helpers must be encapsulated in dedicated files under `features/<feature>/api/`.

8. **Strict `UI_COPY` Centralization Invariant (Zero Exceptions)**:
   - ALL user-facing text (labels, headers, button text, placeholders, empty states, error messages, toast copy, and dialog descriptions) MUST be centralized in `@/lib/ui-copy/` dictionaries.
   - Direct raw hardcoded strings in JSX/TSX components are strictly prohibited.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
