# Core Invariants — DevLab Portal

1. **250-Line Limit**: Every single file across `apps/api` and `apps/web` must stay strictly under 250 lines of code.
2. **OIDC & Cryptography**:
   - RS256 key pair rotation using Node `crypto`.
   - Immutable audit log trigger on database mutations.
3. **Control Plane & Kill-Switch**:
   - Redis Pub/Sub topic `app.state.changed` broadcasts kill-switch events in sub-5ms.
   - Apollo GraphQL schema must expose both queries and real-time subscriptions.
