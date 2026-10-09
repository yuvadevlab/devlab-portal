/**
 * @file apps/web/src/lib/ui-copy/audit.ts
 * @description Localized string catalog for security audit ledger and inspector drawer.
 * @module @devlab/portal-web/ui-copy/audit
 */

export const AUDIT_COPY = {
  HEADER: {
    TITLE: "Security & Governance Audit Ledger",
    DESCRIPTION:
      "Tamper-evident trace of all operational events, kill-switch toggles, and token activities.",
  },
  TABLE: {
    TIMESTAMP: "Timestamp",
    ACTION: "Action / Event",
    ACTOR: "Actor",
    TARGET: "Target Entity",
    DETAILS: "Metadata Preview",
    ACTIONS: "Inspect",
    EMPTY_TEXT: "No audit events recorded in this timeframe.",
  },
  DRAWER: {
    TITLE: "Audit Event Inspector",
    SUBTITLE: "Cryptographic event receipt and full metadata payload.",
    EVENT_ID: "Log ID",
    ACTION: "Action",
    ACTOR: "Actor ID",
    TARGET_TYPE: "Target Type",
    TARGET_ID: "Target ID",
    PAYLOAD_JSON: "Raw Event Payload (JSON)",
  },
} as const;
