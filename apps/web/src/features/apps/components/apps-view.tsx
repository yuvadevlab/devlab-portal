"use client";

/**
 * @file apps/web/src/features/apps/components/apps-view.tsx
 * @description Dedicated client view component for Ecosystem Apps catalog and routing telemetry.
 * @module @devlab/portal-web/features/apps/components
 */

import React, { useState, useMemo } from "react";
import { AppMetrics } from "./app-metrics";
import { AppGrid } from "./app-grid";
import { ProcessSupervisorDrawer } from "./process-supervisor-drawer";
import { useAppsQuery, useSupervisorStatusesQuery } from "@/features/apps/api";
import { useAuditLogsQuery } from "@/features/audit/api";
import { useDashboardModals } from "@/features/dashboard/context";
import { AppStatus } from "@/lib/constants/enums";
import { ProcessState, type RegisteredApp } from "@/features/apps/types";

export function AppsView(): React.JSX.Element {
  const { data: apps = [] } = useAppsQuery();
  const { data: supervisorStatuses = [] } = useSupervisorStatusesQuery();
  const { data: auditLogs = [] } = useAuditLogsQuery();
  const { openRegisterModal, openSettings, openKillSwitch, onNavigateTab } = useDashboardModals();
  const [selectedSupervisorApp, setSelectedSupervisorApp] = useState<RegisteredApp | null>(null);

  const enrichedApps = useMemo(() => {
    if (!supervisorStatuses.length) return apps;
    const statusMap = new Map(supervisorStatuses.map((s) => [s.appId, s]));
    return apps.map((app) => {
      const sup = statusMap.get(app.appId);
      if (sup?.state === ProcessState.RUNNING && app.healthStatus !== AppStatus.HEALTHY) {
        return {
          ...app,
          healthStatus: AppStatus.HEALTHY,
        };
      }
      return app;
    });
  }, [apps, supervisorStatuses]);

  return (
    <>
      <AppMetrics apps={enrichedApps} />
      <AppGrid
        apps={enrichedApps}
        auditLogs={auditLogs}
        onOpenRegisterModal={openRegisterModal}
        onOpenSettings={openSettings}
        onToggleKillSwitch={openKillSwitch}
        onOpenSupervisor={(app) => setSelectedSupervisorApp(app)}
        onNavigateTab={(tab) => onNavigateTab(tab)}
      />
      <ProcessSupervisorDrawer
        app={selectedSupervisorApp}
        isOpen={Boolean(selectedSupervisorApp)}
        onClose={() => setSelectedSupervisorApp(null)}
      />
    </>
  );
}
