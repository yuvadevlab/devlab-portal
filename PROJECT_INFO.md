# DevLab Portal — Deep Product & Technical Specification Dossier

## 1. Product Overview & Vision

### 1.1 The Operational Problem Space

Autonomous AI agents possess unprecedented power: executing shell commands, modifying databases, orchestrating transactions, and generating software. However, without centralized control-plane governance, organizations face severe risks:

- **Runaway Token Costs**: An autonomous loop can burn thousands of dollars in LLM API credits within minutes.
- **Rogue Agent Execution**: In the event of an hallucination spiral or security compromise, operators need a mechanism to immediately revoke an agent's permissions without restarting production clusters.
- **Compliance Blindspots**: Enterprises cannot audit which agent triggered specific external tool invocations or accessed sensitive customer data.

### 1.2 The DevLab Portal Solution

DevLab Portal serves as the **central nervous system and security gateway control plane**:

1. **Cryptographic Key Management**: Issues scoped API keys with rate-limits, model permissions, and budgetary caps.
2. **Sub-Millisecond Redis Kill-Switch Rail**: Revocations publish instantly across Redis, cutting off rogue agents in <1ms without database polling.
3. **Immutable Tamper-Evident Audit Trails**: Every key invocation, quota adjustment, and administrative decision is permanently recorded in PostgreSQL.
4. **Developer-First Web Console**: Unified Next.js UI allowing administrators to provision tenants, manage credentials, and monitor consumption curves in real time.

---

## 2. Technical Stack & Architectural Rationale

### 2.1 Framework & Language Choices

#### 1. Fastify 5.2 (`apps/api`)

- **Why Fastify over Express?**
  - **Extreme Throughput**: Fastify is up to 2-3x faster than Express, capable of serving 35,000+ requests/sec per single Node core.
  - **Schema-Based Serialization**: Uses `fast-json-stringify` for high-speed response serialization.
  - **Native Async Architecture**: Built from the ground up for modern async/await execution without middleware error handling overhead.

#### 2. Next.js 15 (`apps/web`)

- **Why Next.js?**
  - **Server Components (RSC)**: Reduces client bundle size by rendering tenant tables and audit logs on the server.
  - **Design System Integration**: Native compatibility with `@yuva-devlab/ui` component library.

#### 3. Prisma ORM 7.8 & PostgreSQL (`prisma/`)

- **Why Prisma + PostgreSQL?**
  - **Strict Type Safety**: Generates end-to-end TypeScript types directly from the database schema.
  - **Relational Integrity**: Foreign-key constraints guarantee that orphaned keys or detached audit records cannot exist.

#### 4. Redis (Cache & Pub/Sub)

- **Why Redis?**
  - In-memory key verification guarantees <1ms latency overhead on gateway requests.
  - Redis Pub/Sub drives the distributed kill-switch rail, synchronizing revocation events across all distributed nodes instantaneously.

---

## 3. Structural & Architectural Design

```
devlab-portal/
├── apps/
│   ├── api/                    # Fastify high-performance gateway service
│   │   ├── src/
│   │   │   ├── routes/         # REST API route handlers
│   │   │   ├── services/       # Key hashing, Redis cache, and DB access
│   │   │   └── middleware/     # Rate limiter & auth guards
│   └── web/                    # Next.js 15 administrative dashboard
│       └── src/
│           ├── app/            # App router pages
│           └── components/     # UI widgets and forms
├── prisma/
│   └── schema.prisma           # Relational schema (Tenants, ApiKeys, AuditEvents)
├── .vscode/                    # Excludes node_modules from file watcher
└── turbo.json                  # Turborepo task pipeline configuration
```

---

## 4. Security & Cryptographic Invariants

1. **Zero Plaintext Persistence**: Plaintext API keys (`dl_live_...`) are returned exactly once upon creation. Only the SHA-256 hash is persisted.
2. **Timing-Safe Hash Comparison**: Verification uses constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
3. **Audit Log Immutability**: The `AuditEvents` table has no update or delete endpoints exposed in the application.
