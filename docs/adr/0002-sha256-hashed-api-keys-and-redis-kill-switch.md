# ADR 0002: SHA-256 Hashed API Keys & Sub-Millisecond Redis Kill Switch

## Status

Accepted

## Context

Downstream AI gateways and developers require high-throughput programmatic API keys. Plaintext keys in databases pose catastrophic leak risks. Furthermore, compromised keys must be instantly revokable across all edge gateways.

## Decision

1. **Irreversible Hashing:** Keys are generated with a secure prefix (`dl_live_...`), presented once to the user upon creation, and hashed using SHA-256 before storage in PostgreSQL.
2. **Distributed Redis Cache:** Active key hashes and tenant rate limits are cached in Redis.
3. **Emergency Kill-Switch:** Tenant administrators can trigger a kill signal that evicts cached keys and marks the tenant inactive in Redis in sub-1 millisecond.

## Consequences

- **Security:** Even in the event of a database compromise, attacker cannot recover usable API keys.
- **Latency:** Authentication middleware checks Redis in < 1ms without querying primary relational storage.
