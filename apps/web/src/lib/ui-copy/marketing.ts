/**
 * @file apps/web/src/lib/ui-copy/marketing.ts
 * @description Master UI copy catalog for DevLab Portal public marketing and capability landing pages.
 * Eliminates all raw string literals across public layouts, heroes, cards, and footers.
 * @module @devlab/portal-web/ui-copy/marketing
 */

import { MARKETING_FAQS } from "./marketing-faq";

export const MARKETING_COPY = {
  BADGES: {
    CONTROL_PLANE: "Ecosystem Control Plane",
    SECURITY: "Zero-Trust Security",
    ARCHITECTURE: "Sub-Millisecond Event Bus",
    FLEET: "Connected Applications",
    OPEN_SOURCE: "Enterprise Ready",
    FAQ: "Frequently Asked Questions",
    STATUS_LIVE: "Live Production",
  },
  HERO: {
    HEADLINE_PREFIX: "The Unified Control Plane for",
    HEADLINE_ACCENT: "Autonomous AI & Micro-Frontends",
    SUBTITLE:
      "Centralized RS256 OIDC authority, sub-millisecond Redis kill-switch propagation, multi-tenant RBAC, and governance across the DevLab multi-repo ecosystem.",
    CTA_CONSOLE: "Launch Control Plane",
    CTA_ECOSYSTEM: "Explore Fleet",
    TRUST_1: "RS256 OIDC & JWKS Token Issuance",
    TRUST_2: "<1ms Sub-Millisecond Redis Revocation",
    TRUST_3: "Multi-Tenant RBAC & Organization Isolation",
  },
  FLEET: {
    SECTION_BADGE: "Application Fleet",
    SECTION_TITLE: "One Identity. One Control Plane. Six Unified Platforms.",
    SECTION_SUB:
      "Every tool in the DevLab ecosystem coordinates through the Portal for cryptographic credentials, telemetry, and security.",
    ACTION: "Explore capability",
  },
  ARCHITECTURE: {
    SECTION_BADGE: "System Topology",
    SECTION_TITLE: "Engineered for High-Frequency Identity & Event Governance",
    SECTION_SUB:
      "A distributed security bus that eliminates decentralized token validation and slow database lookups.",
    STEP_1_NUM: "01",
    STEP_1_TITLE: "Register & Onboard Service",
    STEP_1_DESC:
      "Register apps with dedicated callbacks, origins, health probes, and process supervisor commands.",
    STEP_2_NUM: "02",
    STEP_2_TITLE: "Issue Cryptographic Tokens",
    STEP_2_DESC:
      "Generate prefixed API keys (dl_live_ / dl_test_) and RS256 signed OIDC JSON Web Tokens verified via JWKS.",
    STEP_3_NUM: "03",
    STEP_3_TITLE: "Instant Sub-Millisecond Revocation",
    STEP_3_DESC:
      "Publish revocation signals across Redis Pub/Sub, evicting compromised credentials in under 1 millisecond.",
  },
  SECURITY: {
    SECTION_BADGE: "Security & Trust",
    SECTION_TITLE: "Zero-Trust Identity with Cryptographic Guarantees",
    SECTION_SUB:
      "Hardened security posture designed for enterprise compliance and distributed microservice workloads.",
    CARD_1_TITLE: "RS256 Asymmetric Cryptography",
    CARD_1_DESC:
      "All sessions and service-to-service communications are validated against public keys discovered at /.well-known/jwks.json.",
    CARD_2_TITLE: "Redis Kill-Switch Bus",
    CARD_2_DESC:
      "Instant key rotation and tenant eviction with sub-millisecond propagation across all running workers.",
    CARD_3_TITLE: "Immutable Security Audit Ledger",
    CARD_3_DESC:
      "Cryptographically signed audit logs for all administrative operations, permission changes, and access grants.",
  },
  FAQ: {
    SECTION_BADGE: "Knowledge Base",
    SECTION_TITLE: "Frequently Asked Questions",
    ITEMS: MARKETING_FAQS,
  },
  CTA_BANNER: {
    TITLE: "Ready to Unify Your Distributed AI Infrastructure?",
    SUBTITLE: "Access the DevLab Control Plane or integrate with the OIDC authority today.",
    ACTION_PRIMARY: "Sign In to Console",
    ACTION_SECONDARY: "View Architecture",
  },
  NAV: {
    ARIA_NAV: "Public navigation menu",
    ARIA_DRAWER: "Mobile navigation drawer",
    ECOSYSTEM: "Ecosystem",
    ARCHITECTURE: "Architecture",
    DEVELOPERS: "Developers",
    ABOUT: "About",
    SIGN_IN: "Sign In",
    CONSOLE: "Console",
  },
  FOOTER: {
    DESC: "DevLab Portal is the centralized identity authority, API key lifecycle manager, and governance control plane for the DevLab ecosystem.",
    COL_PRODUCT: "Product Fleet",
    COL_PLATFORM: "Platform & Specs",
    COL_LEGAL: "Legal & Trust",
    DISCLAIMER: "DevLab Portal is engineered by Yuva DevLab. All rights reserved.",
    COPYRIGHT: "© 2026 Yuva DevLab. MIT Licensed.",
  },
} as const;
