"use client";

/**
 * @file apps/web/src/features/apps/components/process-telemetry-card.tsx
 * @description Telemetry card rendering process PID, PGID, uptime, and bound TCP ports.
 * @module @devlab/portal-web/features/apps/components
 */

import React from "react";
import { Cpu, Activity, RefreshCw } from "lucide-react";
import { Button } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { ProcessStatus } from "../types";

interface ProcessTelemetryCardProps {
  status?: ProcessStatus;
  onRefresh: () => void;
}

export const ProcessTelemetryCard: React.FC<ProcessTelemetryCardProps> = ({
  status,
  onRefresh,
}) => {
  const portStatuses = status?.portStatuses ?? [];
  const listeningCount = portStatuses.filter((p) => p.inUse).length;

  return (
    <div className="supervisor-telemetry-box">
      <div className="supervisor-telemetry-header">
        <span className="supervisor-telemetry-title">
          <Cpu className="telemetry-title-icon" /> {UI_COPY.APPS.SUPERVISOR.TELEMETRY_TITLE}
        </span>
        <Button size="sm" variant="ghost" className="supervisor-refresh-btn" onClick={onRefresh}>
          <RefreshCw className="refresh-btn-icon" /> {UI_COPY.APPS.SUPERVISOR.TELEMETRY_REFRESH}
        </Button>
      </div>

      <div className="supervisor-telemetry-grid">
        <div className="supervisor-stat-cell">
          <div className="supervisor-stat-label">{UI_COPY.APPS.SUPERVISOR.PID_LABEL}</div>
          <div className="supervisor-stat-val">{status?.pid ?? "—"}</div>
        </div>
        <div className="supervisor-stat-cell">
          <div className="supervisor-stat-label">{UI_COPY.APPS.SUPERVISOR.PGID_LABEL}</div>
          <div className="supervisor-stat-val">{status?.pgid ?? "—"}</div>
        </div>
        <div className="supervisor-stat-cell">
          <div className="supervisor-stat-label">{UI_COPY.APPS.SUPERVISOR.UPTIME_LABEL}</div>
          <div className="supervisor-stat-val">
            {status?.uptimeSeconds ? `${status.uptimeSeconds}s` : "—"}
          </div>
        </div>
      </div>

      {portStatuses.length > 0 && (
        <div className="supervisor-ports-section">
          <div className="supervisor-ports-header">
            <span className="supervisor-ports-title">
              <Activity className="ports-title-icon" /> {UI_COPY.APPS.SUPERVISOR.PORTS_TITLE}
            </span>
            <span className="supervisor-ports-badge">
              {listeningCount}/{portStatuses.length}{" "}
              {UI_COPY.APPS.SUPERVISOR.PORTS_LISTENING_SUFFIX}
            </span>
          </div>
          <div className="supervisor-ports-row">
            {portStatuses.map((p) => (
              <div key={p.port} className={`supervisor-port-pill ${p.inUse ? "active" : ""}`}>
                <span className="supervisor-port-dot" />
                <span className="supervisor-port-num">:{p.port}</span>
                <span className="supervisor-port-state">
                  {p.inUse
                    ? UI_COPY.APPS.SUPERVISOR.PORT_LISTENING
                    : UI_COPY.APPS.SUPERVISOR.PORT_CLOSED}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
