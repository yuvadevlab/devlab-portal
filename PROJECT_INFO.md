# DevLab Portal — Master Product Specification, Technical Dossier & Operations Manual

---

## 1. Product File: Strategic Vision & Control Plane Mandate

### 1.1 Executive Product Summary

**DevLab Portal** is the centralized developer management platform, API key lifecycle authority, and governance control plane for the entire DevLab multi-repo ecosystem (`orchestrai`, `finai`, `devlab-logs`, `incidentai`).

In a distributed AI and financial services infrastructure, distributed security cannot rely on fragmented, decentralized key validation or slow database queries. DevLab Portal provides:

1. **Cryptographic API Key Authority**: Issues cryptographically secure, prefixed API keys (`dl_live_...`, `dl_test_...`) with SHA-256 salted hashes, scoping permissions down to individual endpoints and token budgets.
2. **Sub-Millisecond Redis Kill-Switch Bus**: Emits immediate key, user, and tenant revocation signals across a Redis Pub/Sub backplane (`devlab:killswitch:events`), guaranteeing that revoked credentials are rejected across all services in <1 millisecond.
3. **Multi-Tenant Organization & RBAC Engine**: Fine-grained role-based access control (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`) governing tenant memberships, team invites, and security audit logs.
4. **Platform Usage & Quota Governance**: Centralized token rate-limiting and quota tracking, preventing runaway LLM consumption across tenant swarms.

### 1.2 Target Personas & Primary Use Cases

| Persona                               | Operational Context                                                        | Primary Pain Points Addressed                                                                                             |
| :------------------------------------ | :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **Enterprise Security Administrator** | Managing organizational access and revoking compromised credentials        | Needs instant, sub-millisecond global key revocation across all running workers and gateways without restarting services. |
| **Platform / DevOps Engineer**        | Onboarding new developer teams, managing API keys, and setting rate limits | Provides self-service key generation, automated tenant provisioning, and declarative quota management.                    |
| **Compliance & Audit Officer**        | Reviewing access logs, permission shifts, and security compliance          | Requires immutable, cryptographically verifiable audit trails of all key creations, revocations, and role escalations.    |
| **Application Developer**             | Generating test keys and monitoring live service consumption               | Delivers an intuitive Next.js console for generating test/production keys and viewing live request metrics.               |

---

## 2. Exhaustive Feature Directory & Technical Mechanics

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEVLAB PORTAL TOPOLOGY & CONTROL PLANE                               │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                  [Portal Web Console (Next.js 15 — Port 3005)]
                                        │  (HTTP / SSE)
                                        ▼
                  [Portal Fastify API Control Plane (Port 3015)]
                                        │
     ┌──────────────────────────────────┼──────────────────────────────────┐
     ▼                                  ▼                                  ▼
[API Key Management Engine]    [RBAC & Tenant Hierarchy]      [Instant Kill-Switch Pub/Sub]
 • SHA-256 Salted Hashing       • Multi-Tenant Isolation       • Redis Channel:
 • Prefixes: dl_live_ / dl_test_• Roles: OWNER/ADMIN/MEMBER     devlab:killswitch:events
 • Capability Scopes & Quotas   • Audit Log Persistence        • <1ms Propagation SLA
     │                                  │                                  │
     └──────────────────────────────────┴─────────────────┬────────────────┘
                                                          ▼
                                            [PostgreSQL 16 & Redis 7]
```

### 2.1 Application Layer Breakdown

#### 1. Developer Web Console (`apps/web` — Port `3005`)

- **Technology Stack**: Next.js 15, React 19, Tailwind CSS v4, `@yuva-devlab/ui`, `@yuva-devlab/tokens`.
- **Purpose**: Modern administrative web application for tenant and API key lifecycle management.
- **Detailed Features**:
  - **API Key Management Dashboard**: Create, view, copy (one-time display), rotate, and revoke live and test API keys.
  - **One-Click Instant Kill-Switch**: Visual red-alert button allowing immediate eviction of compromised keys or entire tenant access.
  - **Audit Log Explorer**: Filterable, searchable table displaying chronological security events with IP addresses, user agents, and actor IDs.
  - **Tenant & Team Management**: Invite team members, assign granular RBAC roles, and manage billing profiles.
  - **Real-Time Usage Telemetry**: Charts showing active requests, token consumption, and rate limit saturation.

#### 2. Fastify Control Plane API (`apps/api` — Port `3015`)

- **Technology Stack**: Fastify v4, Prisma ORM, PostgreSQL 16, Redis 7.
- **Purpose**: High-throughput REST API serving authentication verification, key generation, and control plane operations.
- **Detailed Features**:
  - **Cryptographic Key Generation**: Generates 32-byte cryptographically secure random bytes encoded in base62, prefixed with `dl_live_` or `dl_test_`. Stores only the `SHA-256` hash in PostgreSQL.
  - **Sub-Millisecond Redis Key Caching**: Syncs key metadata (tenant ID, scopes, status) to Redis with key format `devlab:apikey:<hash>`, enabling sub-millisecond lookups for downstream gateways.
  - **Kill-Switch Event Publisher**: When a key or tenant is revoked, immediately deletes the Redis cache entry and broadcasts a revocation payload to the `devlab:killswitch:events` channel.
  - **Comprehensive Audit Trail**: Automatically writes immutable records into the `AuditLog` table for every state mutation.

---

## 3. Inter-System Ecosystem Collaboration ("How It Works With Others")

```mermaid
sequenceDiagram
    autonumber
    participant Admin as Security Admin (Portal :3005)
    participant Portal as Portal API (:3015)
    participant Redis as Redis (:6379)
    participant GW as OrchestraI Gateway (:4001)
    participant Worker as OrchestraI Worker (:4003)
    participant Logs as DevLab Logs (:3020)

    Admin->>Portal: 1. POST /api/v1/keys/:id/revoke (Revoke Key)
    Portal->>Portal: 2. Update PostgreSQL (Status = REVOKED)
    Portal->>Redis: 3. DEL devlab:apikey:<hash>
    Portal->>Redis: 4. PUBLISH devlab:killswitch:events { keyId, tenantId, status: "REVOKED" }

    par Instant Sub-Millisecond Notification
        Redis->>GW: 5a. Receive Killswitch Event (<1ms)
        GW->>GW: Invalidate local in-memory key cache
    and
        Redis->>Worker: 5b. Receive Killswitch Event (<1ms)
        Worker->>Worker: Abort in-flight task for revoked key
    end

    Portal->>Logs: 6. Stream Security Audit Event (:3020)
    Portal-->>Admin: 200 OK (Key Instantly Revoked)
```

### 3.1 Inter-Repository Integration Matrix

| Ecosystem Member    | Direction | Protocol & Transport | Exact Payload Contract & Endpoint                       | Purpose & Operational Behavior                                                                      |
| :------------------ | :-------: | :------------------- | :------------------------------------------------------ | :-------------------------------------------------------------------------------------------------- |
| **`orchestrai`**    | Outbound  | Redis Pub/Sub & HTTP | `POST http://localhost:4001/api/v1/internal/killswitch` | Emits revocation events; validates client API keys on session initiation.                           |
| **`finai`**         | Outbound  | Redis Pub/Sub & HTTP | `GET http://localhost:3015/api/v1/subscriptions/verify` | Provides subscription tier verification and user feature entitlements.                              |
| **`devlab-logs`**   | Outbound  | HTTP/2 POST          | `POST http://localhost:3020/api/v1/logs/ingest`         | Streams administrative audit records, access history, and key management actions.                   |
| **`incidentai`**    | Outbound  | Webhook HTTP POST    | `POST http://localhost:8085/api/v1/incidents/webhook`   | Dispatches alerts if Redis pub/sub connection drops or database replication delays occur.           |
| **`devlab-guard`**  |  Inbound  | CLI Git Pre-commit   | `uv run devlab-guard scan --path .`                     | Scans codebase to enforce 250-line rule, type safety, and zero magic strings.                       |
| **`devlab-shared`** |  Static   | npm Package Imports  | Direct package import                                   | Imports `@yuva-devlab/ui`, `@yuva-devlab/tokens`, `@yuva-devlab/logger`, and `@yuva-devlab/errors`. |

---

## 4. Technical Guidelines & Invariant Rules

### 4.1 Prime Non-Negotiable Invariants

1. **Zero Raw Key Storage**:
   - Plaintext API keys are displayed to the user ONCE upon creation and never stored.
   - The database stores only the `SHA-256` hash and a non-sensitive 4-character prefix/suffix hint (e.g. `dl_live_...a8f2`).
2. **Sub-1ms Revocation Propagation**:
   - Every key revocation MUST publish to Redis pub/sub and delete the corresponding Redis key synchronously within the database transaction.
3. **Hard 250-Line Maximum Rule**:
   - No code file across `apps/*` may exceed 250 lines. Decompose early at 200 lines.
4. **Canonical Enums Only**:
   - All roles (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`) and key statuses (`ACTIVE`, `REVOKED`, `EXPIRED`) must use strict TypeScript enums.

---

## 5. Developer Usage Guidelines & Operations Manual

### 5.1 Local Prerequisites & Setup

```bash
# Clone the repository
git clone https://github.com/yuvadevlab/devlab-portal.git
cd devlab-portal

# Install dependencies
pnpm install

# Start local database & run Prisma migrations
pnpm db:generate
pnpm db:migrate

# Start Web (:3005) and API (:3015) in development mode
pnpm dev

# Verify monorepo typecheck
pnpm typecheck
```

### 5.2 Complete Environment Variables Reference

| Variable                 |  Type  |         Default          | Required | Description                                                                                   |
| :----------------------- | :----: | :----------------------: | :------: | :-------------------------------------------------------------------------------------------- |
| `PORT`                   | Number |          `3015`          |   Yes    | Fastify API listening port.                                                                   |
| `DATABASE_URL`           | String |            —             |   Yes    | PostgreSQL connection string (`postgresql://postgres:postgres@localhost:5432/devlab_portal`). |
| `REDIS_URL`              | String | `redis://localhost:6379` |   Yes    | Redis URL for caching key metadata and kill-switch pub/sub.                                   |
| `DEVLAB_LOGS_URL`        | String | `http://localhost:3020`  |   Yes    | DevLab Logs ingestion endpoint.                                                               |
| `INCIDENTAI_WEBHOOK_URL` | String | `http://localhost:8085`  |    No    | Webhook URL for incident alerting.                                                            |

### 5.3 Programmatic API Key Verification Example

```bash
# Verify API Key via Fastify Gateway Endpoint
curl -X POST http://localhost:3015/api/v1/keys/verify \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "dl_live_a1b2c3d4e5f6g7h8i9j0"
  }'
```
