/**
 * @file apps/web/src/features/iam/api/index.ts
 * @description Centralized barrel exporting TanStack Query hooks for IAM.
 * @module @devlab/portal-web/features/iam/api
 */

export { apiKeysQueryKey, useApiKeysQuery, prefetchApiKeys } from "./get-api-keys";
export { useCreateApiKeyMutation, useCreateApiKey } from "./create-api-key";
export { useRevokeApiKeyMutation, useRevokeApiKey } from "./revoke-api-key";
