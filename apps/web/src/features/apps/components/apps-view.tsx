"use client";

/**
 * @file apps/web/src/features/apps/components/apps-view.tsx
 * @description Dedicated client view component for Ecosystem Apps catalog and routing telemetry.
 * @module @devlab/portal-web/features/apps/components
 */

import React from "react";
import { AppMetrics } from "./app-metrics";
import { AppGrid } from "./app-grid";
import { useAppsQuery } from "@/features/apps/api";
import { useAuditLogsQuery } from "@/features/audit/api";
import { useDashboardModals } from "@/features/dashboard/context";

export function AppsView(): React.JSX.Element {
  const { data: apps = [] } = useAppsQuery();
  const { data: auditLogs = [] } = useAuditLogsQuery();
  const { openRegisterModal, openSettings, openKillSwitch, onNavigateTab } = useDashboardModals();

  return (
    <>
      <AppMetrics apps={apps} />
      <AppGrid
        apps={apps}
        auditLogs={auditLogs}
        onOpenRegisterModal={openRegisterModal}
        onOpenSettings={openSettings}
        onToggleKillSwitch={openKillSwitch}
        onNavigateTab={(tab) => onNavigateTab(tab)}
      />
    </>
  );
}
