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
      className={`group bg-card relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
        isRoutingActive
          ? "border-border hover:border-primary/50 hover:shadow-primary/5 hover:shadow-lg"
          : "border-red-500/30 bg-red-950/10"
      }`}
    >
      <div>
        {/* Header: Monogram, Name & Badges */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 items-center justify-center rounded-xl text-base font-bold transition-colors ${
                isRoutingActive
                  ? "bg-primary/15 text-primary border-primary/30 border"
                  : "border border-red-500/30 bg-red-500/20 text-red-400"
              }`}
            >
              {app.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-foreground text-base leading-tight font-semibold tracking-tight">
                {app.name}
              </h3>
              <p className="text-muted-foreground font-mono text-xs">{app.appId}</p>
            </div>
          </div>

          <Badge
            variant={app.environment === "production" ? "default" : "outline"}
            className="font-mono text-[10px] uppercase"
          >
            {app.environment}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-xs leading-relaxed">
          {app.description || "Federated micro-frontend service in DevLab swarm."}
        </p>

        {/* Operational Status & Latency Metrics */}
        <div className="border-border bg-background/60 mb-4 space-y-2 rounded-lg border p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              {UI_COPY.APPS.CARD.HEALTH_LABEL}:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {isHealthy ? (
                <>
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-emerald-400">
                    {UI_COPY.COMMON.STATUS.HEALTHY}
                    {app.latencyMs && app.latencyMs > 0
                      ? ` (${app.latencyMs}${UI_COPY.APPS.CARD.LATENCY_SUFFIX})`
                      : ""}
                  </span>
                </>
              ) : isRoutingActive ? (
                <span className="flex items-center gap-1 text-amber-400">
                  <ShieldAlert className="size-3" />
                  {UI_COPY.COMMON.STATUS.UNREACHABLE}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400">
                  <Power className="size-3" />
                  {UI_COPY.COMMON.STATUS.MAINTENANCE}
                </span>
              )}
            </div>
          </div>

          <div className="border-border/50 flex items-center justify-between border-t pt-1 text-xs">
            <span className="text-muted-foreground text-[11px]">
              {UI_COPY.APPS.CARD.CLIENT_ID_LABEL}:
            </span>
            <div className="text-foreground flex items-center gap-1 font-mono text-[11px]">
              <span>{app.appId}</span>
              <CopyButton textToCopy={app.appId} />
            </div>
          </div>
        </div>

        {/* Maintenance Note if kill-switched */}
        {!isRoutingActive && app.maintenanceNote && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-[11px] text-red-300">
            <span className="font-semibold">{UI_COPY.APPS.DRAWER.NOTE_LABEL}: </span>
            {app.maintenanceNote}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-border flex items-center justify-between gap-2 border-t pt-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenSettings(app)}
            className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
            title={UI_COPY.APPS.CARD.SETTINGS_TOOLTIP}
          >
            <Settings className="mr-1 size-3.5" />
            {UI_COPY.COMMON.ACTIONS.SETTINGS}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(app.originUrl, "_blank")}
            className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
            title={UI_COPY.APPS.CARD.LAUNCH_TOOLTIP}
          >
            <ExternalLink className="mr-1 size-3.5" />
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
              ? "bg-destructive text-destructive-foreground hover:opacity-90"
              : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
        >
          {isRoutingActive ? (
            <>
              <Power className="mr-1 size-3.5" />
              {UI_COPY.APPS.CARD.DEACTIVATE_BTN}
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-1 size-3.5" />
              {UI_COPY.APPS.CARD.ACTIVATE_BTN}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
