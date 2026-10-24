"use client";

/**
 * @file apps/web/src/features/iam/components/iam-view.tsx
 * @description Dedicated client view component for IAM API keys and credential credentials.
 * @module @devlab/portal-web/features/iam/components
 */

import React from "react";
import { ApiKeysTable } from "./api-keys-table";
import { useApiKeysQuery } from "@/features/iam/api";
import { useAppsQuery } from "@/features/apps/api";
import { useDashboardActions } from "@/features/dashboard/hooks/use-dashboard-actions";
import { useDashboardModals } from "@/features/dashboard/context";

export function IamView(): React.JSX.Element {
  const { data: apiKeys = [] } = useApiKeysQuery();
  const { data: apps = [] } = useAppsQuery();
  const { handleRevokeKey } = useDashboardActions(apps);
  const { openApiKeyModal } = useDashboardModals();

  return (
    <ApiKeysTable
      apiKeys={apiKeys}
      apps={apps}
      onOpenGenerateModal={openApiKeyModal}
      onRevokeKey={handleRevokeKey}
    />
  );
}
