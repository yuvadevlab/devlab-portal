/**
 * @file apps/web/src/features/iam/types.ts
 * @description Types and contracts for IAM & API Key credentials.
 * @module @devlab/portal-web/features/iam/types
 */

import type { ApiKey, RegisteredApp } from "../../lib/api-client";

export type { ApiKey, RegisteredApp };

export interface CreateApiKeyFormState {
  name: string;
  appId: string;
  scopes: string[];
  rateLimitRpm: number;
}
