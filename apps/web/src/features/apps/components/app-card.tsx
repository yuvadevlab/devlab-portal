/**
 * @file apps/web/src/features/apps/components/app-card.tsx
 * @description Application catalog tile with real-time health indicator, latency, and kill-switch trigger.
 * @module @devlab/portal-web/features/apps/components/app-card
 */

import React from "react";
import { ExternalLink, Settings, Power, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge, Button, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { AppStatus } from "../../../lib/constants/enums";
import type { RegisteredApp } from "../types";

interface AppCardProps {
  app: RegisteredApp;
  onOpenSettings: (app: RegisteredApp) => void;
  onToggleKillSwitch: (app: RegisteredApp) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onOpenSettings, onToggleKillSwitch }) => {
  // Determine if application is actively serving traffic
  const isRoutingActive = app.isActive;
  // Compute health display state from latency and backend probe status
  const isHealthy = isRoutingActive && app.healthStatus === AppStatus.HEALTHY;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 bg-[var(--card)] ${
        isRoutingActive
          ? "border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/5"
          : "border-red-500/30 bg-red-950/10"
      }`}
    >
      <div>
        {/* Header: Monogram, Name & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-base transition-colors ${
                isRoutingActive
                  ? "bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {app.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-base text-[var(--foreground)] tracking-tight leading-tight">
                {app.name}
              </h3>
              <p className="font-mono text-xs text-[var(--muted-foreground)]">{app.appId}</p>
            </div>
          </div>

          <Badge
            variant={app.environment === "production" ? "default" : "outline"}
            className="text-[10px] font-mono uppercase"
          >
            {app.environment}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-4 leading-relaxed">
          {app.description || "Federated micro-frontend service in DevLab swarm."}
        </p>

        {/* Operational Status & Latency Metrics */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-2.5 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)] text-[11px]">
              {UI_COPY.APPS.CARD.HEALTH_LABEL}:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {isHealthy ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-emerald-400">
                    {UI_COPY.COMMON.STATUS.HEALTHY}
                    {app.latencyMs && app.latencyMs > 0
                      ? ` (${app.latencyMs}${UI_COPY.APPS.CARD.LATENCY_SUFFIX})`
                      : ""}
                  </span>
                </>
              ) : isRoutingActive ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {UI_COPY.COMMON.STATUS.UNREACHABLE}
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <Power className="h-3 w-3" />
                  {UI_COPY.COMMON.STATUS.MAINTENANCE}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border)]/50">
            <span className="text-[var(--muted-foreground)] text-[11px]">
              {UI_COPY.APPS.CARD.CLIENT_ID_LABEL}:
            </span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[var(--foreground)]">
              <span>{app.appId}</span>
              <CopyButton textToCopy={app.appId} />
            </div>
          </div>
        </div>

        {/* Maintenance Note if kill-switched */}
        {!isRoutingActive && app.maintenanceNote && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2 mb-4 text-[11px] text-red-300">
            <span className="font-semibold">{UI_COPY.APPS.DRAWER.NOTE_LABEL}: </span>
            {app.maintenanceNote}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenSettings(app)}
            className="h-8 px-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            title={UI_COPY.APPS.CARD.SETTINGS_TOOLTIP}
          >
            <Settings className="h-3.5 w-3.5 mr-1" />
            {UI_COPY.COMMON.ACTIONS.SETTINGS}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(app.originUrl, "_blank")}
            className="h-8 px-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            title={UI_COPY.APPS.CARD.LAUNCH_TOOLTIP}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            {UI_COPY.COMMON.ACTIONS.LAUNCH}
          </Button>
        </div>

        {/* Kill Switch Toggle Button */}
        <Button
          variant={isRoutingActive ? "destructive" : "default"}
          size="sm"
          onClick={() => onToggleKillSwitch(app)}
          className={`h-8 px-2.5 text-xs font-semibold ${
            isRoutingActive
              ? "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90"
              : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
        >
          {isRoutingActive ? (
            <>
              <Power className="h-3.5 w-3.5 mr-1" />
              {UI_COPY.APPS.CARD.DEACTIVATE_BTN}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {UI_COPY.APPS.CARD.ACTIVATE_BTN}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
