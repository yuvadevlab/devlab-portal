"use client";

/**
 * @file apps/web/src/features/apps/components/app-card.tsx
 * @description Application catalog tile with real-time health indicator, latency, and kill-switch trigger.
 * @module @devlab/portal-web/features/apps/components/app-card
 */

import React from "react";
import { ExternalLink, Settings, Power, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Badge, Button, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppStatus } from "@/lib/constants";
import type { RegisteredApp } from "@/features/apps/types";

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
    <div className="border-border bg-card hover:border-primary/40 flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all">
      {/* Top Bar: Icon, Name, App ID */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {app.iconUrl ? (
              <img
                src={app.iconUrl}
                alt={app.name}
                className="border-border size-10 rounded-lg border object-cover"
              />
            ) : (
              <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-lg text-sm font-bold">
                {app.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-foreground text-sm font-bold">{app.name}</h3>
              <span className="text-muted-foreground font-mono text-xs">{app.appId}</span>
            </div>
          </div>

          {/* Environment Tag */}
          <Badge variant="outline" className="border-border font-mono text-[10px] uppercase">
            {app.environment}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mt-3 line-clamp-2 text-xs">
          {app.description || UI_COPY.COMMON.EMPTY.NO_DATA}
        </p>

        {/* Telemetry and Endpoints */}
        <div className="border-border mt-4 space-y-2 border-t pt-3 font-mono">
          {/* Origin URL */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              {UI_COPY.APPS.CARD.ORIGIN_LABEL}:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-foreground max-w-35 truncate font-mono text-[11px]">
                {app.originUrl}
              </span>
              <CopyButton textToCopy={app.originUrl} />
            </div>
          </div>

          {/* Health & Live Telemetry */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">
              {UI_COPY.APPS.CARD.HEALTH_LABEL}:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {isHealthy ? (
                <>
                  <span className="relative flex size-2">
                    <span className="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-75" />
                    <span className="bg-success relative inline-flex size-2 rounded-full" />
                  </span>
                  <span className="text-success">
                    {UI_COPY.COMMON.STATUS.HEALTHY}
                    {app.latencyMs && app.latencyMs > 0
                      ? ` (${app.latencyMs}${UI_COPY.APPS.CARD.LATENCY_SUFFIX})`
                      : ""}
                  </span>
                </>
              ) : isRoutingActive ? (
                <span className="text-warning flex items-center gap-1">
                  <ShieldAlert className="size-3" />
                  {UI_COPY.COMMON.STATUS.UNREACHABLE}
                </span>
              ) : (
                <span className="text-destructive flex items-center gap-1">
                  <Power className="size-3" />
                  {UI_COPY.APPS.CARD.STATUS_KILLED}
                </span>
              )}
            </div>
          </div>

          {/* Maintenance Note if kill-switch engaged */}
          {!isRoutingActive && app.maintenanceNote && (
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded p-2 text-[10px]">
              {app.maintenanceNote}
            </div>
          )}
        </div>
      </div>

      {/* Action Footers */}
      <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
        {/* Quick Launch & Configure */}
        <div className="flex items-center gap-2">
          {isRoutingActive ? (
            <a
              href={app.originUrl}
              target="_blank"
              rel="noreferrer"
              className="border-border text-foreground hover:bg-background/80 inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium shadow-xs transition-colors"
            >
              <ExternalLink className="mr-1 size-3.5" />
              {UI_COPY.COMMON.ACTIONS.LAUNCH}
            </a>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-border h-8 px-2.5 text-xs opacity-50"
            >
              <ExternalLink className="mr-1 size-3.5" />
              {UI_COPY.COMMON.ACTIONS.LAUNCH}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenSettings(app)}
            className="border-border h-8 px-2.5 text-xs"
          >
            <Settings className="size-3.5" />
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
              : "bg-success text-success-foreground hover:opacity-90"
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
