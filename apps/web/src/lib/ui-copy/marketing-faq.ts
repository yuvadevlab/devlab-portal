/**
 * @file apps/web/src/lib/ui-copy/marketing-faq.ts
 * @description Centralized FAQ question-and-answer pairs for DevLab Portal public marketing pages.
 * @module @devlab/portal-web/ui-copy/marketing-faq
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const MARKETING_FAQS: readonly FaqItem[] = [
  {
    question: "What is DevLab Portal?",
    answer:
      "DevLab Portal is the centralized identity provider, cryptographic API key lifecycle authority, and governance control plane for the entire DevLab multi-repo ecosystem, including FinAI, OrchestrAI, DevLab Guard, DevLab Logs, and IncidentAI.",
  },
  {
    question: "How does the Sub-Millisecond Redis Kill-Switch work?",
    answer:
      "When an API key, tenant membership, or user session is revoked, the portal emits an instant 'app.state.changed' event across a distributed Redis Pub/Sub bus. All connected microservices and edge workers reject revoked credentials in less than 1 millisecond without requiring process restarts.",
  },
  {
    question: "How does Single Sign-On (SSO) work across DevLab applications?",
    answer:
      "DevLab Portal acts as an OpenID Connect (OIDC) authority issuing RS256 signed JWTs. Micro-frontend applications verify tokens cryptographically via the portal's public JWKS endpoint (/.well-known/jwks.json), enabling seamless session handoff across web and API domains.",
  },
  {
    question: "Is DevLab Portal multi-tenant?",
    answer:
      "Yes. The platform provides complete tenant isolation with fine-grained role-based access control (super_admin, admin, developer, operator, read_only, member), team invitations, and tenant-scoped quota enforcement.",
  },
  {
    question: "How do developers generate API keys?",
    answer:
      "Authenticated developers can self-serve cryptographically secure, prefixed API keys (dl_live_... for production, dl_test_... for sandboxes). Secret values are displayed exactly once with SHA-256 salted hashes stored in PostgreSQL.",
  },
] as const;
