# Security Policy

## Supported Versions

| Version | Supported          |
| :------ | :----------------- |
| `1.x`   | :white_check_mark: |
| `< 1.0` | :x:                |

## Reporting a Vulnerability

DevLab Portal is the central authentication authority and API key gatekeeper for the entire ecosystem. We take vulnerability reports with highest urgency.

1. **Do not open a public issue.**
2. Report vulnerabilities immediately to **`yuva.devlab@gmail.com`**.
3. Detail reproduction steps, exploit scenarios, and affected services (`apps/api`, `apps/web`).

## Core Security Controls

- **Zero Plaintext Secrets:** API keys are irreversibly hashed using SHA-256 before persistence.
- **Asymmetric Signature Authority:** SSO tokens are signed via RS256 with rotation support.
- **Instant Revocation:** Redis distributed cache provides sub-1ms emergency key revocation and tenant kill-switches.
- **SSO Bounce Protection:** Loop guards prevent cross-domain token redirection storms.
