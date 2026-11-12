# ADR 0001: Centralized SSO Control Plane & Asymmetric RS256 Tokens

## Status

Accepted

## Context

The DevLab ecosystem consists of multiple distinct web applications (`FinAI`, `OrchestrAI`, `DevLab Logs`, and future `KnowledgeAI`). Managing discrete credentials per application creates credential fatigue and operational risk.

## Decision

DevLab Portal serves as the single source of truth for user identities and authentication:

1. Users authenticate exclusively at the DevLab Portal (`localhost:3000`).
2. Authentication generates asymmetric RS256 JWTs signed with DevLab's private key.
3. Consumer applications verify incoming tokens using the public key without needing backend-to-backend synchronous verification for every request.
4. Redirection parameters (`?app=<id>&redirect=<url>`) handle seamless handoff back to consumer origins.

## Consequences

- **Decoupled Verification:** Consumer apps authenticate requests statelessly with zero latency penalty.
- **Centralized Revocation:** Invalidation occurs via refresh tokens and short-lived access credentials.
