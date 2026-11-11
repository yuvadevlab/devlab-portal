"use client";

/**
 * @file apps/web/src/features/apps/components/process-supervisor-drawer.tsx
 * @description Slide-over drawer providing real-time process control, port inspection, IDE launch, and streaming logs.
 * @module @devlab/portal-web/features/apps/components/process-supervisor-drawer
 */

import React, { useState, useEffect } from "react";
import { Terminal, Play, Square, RotateCw, AlertCircle, Hammer } from "lucide-react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@devlab-portal/ui";
import {
  useSupervisorStatusQuery,
  useSupervisorLogsQuery,
  useSupervisorDependenciesQuery,
  useStartProcessMutation,
  useStopProcessMutation,
  useRestartProcessMutation,
  useBuildProcessMutation,
} from "../api/supervisor";
import { StorageKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import { ProcessTelemetryCard } from "./process-telemetry-card";
import { ProcessTerminal } from "./process-terminal";
import { ProcessModeToggle } from "./process-mode-toggle";
import { ProcessIdeLauncher } from "./process-ide-launcher";
import { ProcessDependenciesCard } from "./process-dependencies-card";
import type { RegisteredApp, ExecutionMode } from "../types";

interface ProcessSupervisorDrawerProps {
  app: RegisteredApp | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessSupervisorDrawer: React.FC<ProcessSupervisorDrawerProps> = ({
  app,
  isOpen,
  onClose,
}) => {
  const [tenantId, setTenantId] = useState<string | undefined>(undefined);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("dev");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(StorageKey.ACTIVE_TENANT_ID);
      if (stored) setTenantId(stored);
    }
  }, [isOpen]);

  const appId = app?.appId || "";
  const startMutation = useStartProcessMutation();
  const stopMutation = useStopProcessMutation();
  const restartMutation = useRestartProcessMutation();
  const buildMutation = useBuildProcessMutation();

  const isPending =
    startMutation.isPending ||
    stopMutation.isPending ||
    restartMutation.isPending ||
    buildMutation.isPending;

  const { data: status, refetch: refetchStatus } = useSupervisorStatusQuery(appId, tenantId, {
    enabled: isOpen && Boolean(appId),
    refetchInterval: false,
  });

  const { data: dependencies = [], refetch: refetchDeps } = useSupervisorDependenciesQuery(
    appId,
    tenantId,
    { enabled: isOpen && Boolean(appId) },
  );

  const state = status?.state || "STOPPED";
  const isRunning = state === "RUNNING" || state === "STARTING";
  const isDeactivated = app?.isActive === false;

  const { data: logs = [], refetch: refetchLogs } = useSupervisorLogsQuery(appId, 100, tenantId, {
    enabled: isOpen && Boolean(appId),
    refetchInterval: isRunning || buildMutation.isPending ? 2000 : false,
  });

  useEffect(() => {
    if (!isOpen || state !== "STARTING") return;
    const interval = setInterval(() => {
      refetchStatus();
      refetchDeps();
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen, state, refetchStatus, refetchDeps]);

  const renderStatusBadge = () => {
    const isStartingOrRunning = state === "RUNNING" || state === "STARTING";
    const isCrashed = state === "CRASHED";
    return (
      <span className={`supervisor-badge ${state.toLowerCase()}`}>
        {isCrashed ? (
          <AlertCircle className="supervisor-badge-icon" />
        ) : (
          <span className={`supervisor-badge-dot ${isStartingOrRunning ? "pulse" : ""}`} />
        )}
        {state}
      </span>
    );
  };

  const actionError =
    startMutation.error?.message ||
    stopMutation.error?.message ||
    restartMutation.error?.message ||
    buildMutation.error?.message;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="supervisor-drawer-content">
        <SheetHeader className="supervisor-header">
          <div className="supervisor-header-row">
            <div className="supervisor-title-group">
              <div className="supervisor-icon-box">
                <Terminal className="supervisor-header-icon" />
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="supervisor-title">
                  {app?.name} {UI_COPY.APPS.SUPERVISOR.DRAWER_TITLE_SUFFIX}
                </SheetTitle>
                <SheetDescription className="supervisor-subtitle">
                  {app?.appId} · {UI_COPY.APPS.SUPERVISOR.DRAWER_DESCRIPTION_SUFFIX}
                </SheetDescription>
              </div>
            </div>
            {renderStatusBadge()}
          </div>
        </SheetHeader>

        <div className="supervisor-body">
          <div className="supervisor-config-strip">
            <ProcessModeToggle
              mode={executionMode}
              onChangeMode={setExecutionMode}
              disabled={isRunning}
            />
            <ProcessIdeLauncher appId={appId} tenantId={tenantId} />
          </div>

          <ProcessDependenciesCard
            dependencies={dependencies}
            isStarting={startMutation.isPending}
            onStartPrerequisites={() =>
              startMutation.mutate({ appId, tenantId, mode: executionMode, cascade: true })
            }
          />

          <ProcessTelemetryCard
            status={status}
            onRefresh={() => {
              refetchStatus();
              refetchLogs();
              refetchDeps();
            }}
          />

          {actionError && (
            <div className="supervisor-action-error">
              {UI_COPY.APPS.SUPERVISOR.ACTION_FAILED_PREFIX} {actionError}
            </div>
          )}

          {isDeactivated && (
            <div className="supervisor-action-error" role="alert">
              <AlertCircle className="supervisor-action-icon" />
              <span>
                <strong>{UI_COPY.APPS.SUPERVISOR.DEACTIVATED_TITLE}</strong>{" "}
                {UI_COPY.APPS.SUPERVISOR.DEACTIVATED_BANNER}
              </span>
            </div>
          )}

          <div className="supervisor-actions-row">
            <Button
              size="sm"
              variant="default"
              className="supervisor-action-btn"
              disabled={isPending || state === "RUNNING" || isDeactivated}
              title={isDeactivated ? UI_COPY.APPS.SUPERVISOR.CANNOT_START_TOOLTIP : undefined}
              onClick={() =>
                startMutation.mutate({ appId, tenantId, mode: executionMode, cascade: true })
              }
            >
              <Play className="supervisor-action-icon" /> {UI_COPY.APPS.SUPERVISOR.ACTION_START}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="supervisor-action-btn"
              disabled={isPending}
              onClick={() => buildMutation.mutate({ appId, tenantId })}
            >
              <Hammer className="supervisor-action-icon" />
              {buildMutation.isPending
                ? UI_COPY.APPS.SUPERVISOR.ACTION_BUILDING
                : UI_COPY.APPS.SUPERVISOR.ACTION_BUILD}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="supervisor-action-btn"
              disabled={isPending || state === "STOPPED" || isDeactivated}
              title={isDeactivated ? UI_COPY.APPS.SUPERVISOR.CANNOT_RESTART_TOOLTIP : undefined}
              onClick={() => restartMutation.mutate({ appId, tenantId, mode: executionMode })}
            >
              <RotateCw className="supervisor-action-icon" />{" "}
              {UI_COPY.APPS.SUPERVISOR.ACTION_RESTART}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="supervisor-action-btn"
              disabled={isPending || state === "STOPPED"}
              onClick={() => stopMutation.mutate({ appId, tenantId })}
            >
              <Square className="supervisor-action-icon" /> {UI_COPY.APPS.SUPERVISOR.ACTION_STOP}
            </Button>
          </div>

          <ProcessTerminal logs={logs} />
        </div>

        <SheetFooter className="supervisor-footer">
          <Button variant="ghost" size="sm" onClick={onClose} className="supervisor-close-btn">
            {UI_COPY.APPS.SUPERVISOR.ACTION_CLOSE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
