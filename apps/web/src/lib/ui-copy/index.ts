/**
 * @file apps/web/src/lib/ui-copy/index.ts
 * @description Master catalog aggregating all localized UI copy dictionaries.
 * Eliminates all raw string literals and hardcoded text across components.
 * @module @devlab/portal-web/ui-copy
 */

import { COMMON_COPY } from "./common";
import { APPS_COPY } from "./apps";
import { IAM_COPY } from "./iam";
import { AUDIT_COPY } from "./audit";
import { TEAM_COPY } from "./team";
import { SETTINGS_COPY } from "./settings";
import { AUTH_COPY } from "./auth";
import { DASHBOARD_COPY } from "./dashboard";

export * from "./common";
export * from "./apps";
export * from "./iam";
export * from "./audit";
export * from "./team";
export * from "./settings";
export * from "./auth";
export * from "./dashboard";

/** Master dictionary of all user-facing UI text strings */
export const UI_COPY = {
  COMMON: COMMON_COPY,
  APPS: APPS_COPY,
  IAM: IAM_COPY,
  AUDIT: AUDIT_COPY,
  TEAM: TEAM_COPY,
  SETTINGS: SETTINGS_COPY,
  AUTH: AUTH_COPY,
  DASHBOARD: DASHBOARD_COPY,
} as const;

export type UiCopyCatalog = typeof UI_COPY;
