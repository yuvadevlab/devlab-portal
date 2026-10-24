/**
 * @file apps/web/src/lib/ui-copy/audit.ts
 * @description Localized string catalog for security audit ledger and inspector drawer.
 * @module @devlab/portal-web/ui-copy/audit
 */

export const AUDIT_COPY = {
  HEADER: {
    TITLE: "Security & Audit Ledger",
    DESCRIPTION: "Every action, accounted for. A complete record of your ecosystem’s security.",
    EXPORT_BTN: "Export ledger",
    EXPORT_FILENAME: "devlab-audit-ledger.json",
  },
  METRICS: {
    RECORDED: "Recorded events",
    RECORDED_NOTE: "Complete workspace history",
    CRITICAL: "Critical events",
    CRITICAL_NOTE: "Emergency actions recorded",
    TODAYS_EVENTS: "Today's events",
    TODAYS_NOTE: "Recorded in current 24h cycle",
    UNIQUE_ACTORS: "Unique operators",
    UNIQUE_ACTORS_NOTE: "Active workspace actors",
  },
  TOOLBAR: {
    SEARCH_PLACEHOLDER: "Search actor or target…",
    ALL_ACTIONS: "All action types",
    DATE_ARIA: "Filter event date",
    ACTION_ARIA: "Filter action type",
  },
  TABLE: {
    TIMESTAMP: "Timestamp",
    ACTION: "Action",
    ACTOR: "Actor",
    TARGET_ENTITY: "Target entity",
    IP_ADDRESS: "IP address",
    INSPECT: "Inspect",
    EMPTY_TEXT: "No events match your filters.",
  },
  DRAWER: {
    TITLE: "Event inspection",
    PAYLOAD: "Event payload",
    RECORDED_NOTE: "Event recorded in sample audit ledger",
    SUBTITLE: "Cryptographic event receipt and full metadata payload.",
    EVENT_ID: "Log ID",
    ACTION: "Action",
    ACTOR: "Actor ID",
    TARGET_TYPE: "Target Type",
    TARGET_ID: "Target ID",
    PAYLOAD_JSON: "Raw Event Payload (JSON)",
  },
} as const;
