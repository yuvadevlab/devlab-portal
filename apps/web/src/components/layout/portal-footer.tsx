"use client";

/**
 * @file apps/web/src/components/layout/portal-footer.tsx
 * @description Master portal footer displaying live cluster telemetry, API endpoints, and version metadata.
 * Subscribes to real-time background polling intervals.
 * @module @devlab/portal-web/components/layout/portal-footer
 */

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { useTelemetryQuery } from "@/features/dashboard";

export const PortalFooter: React.FC = () => {
  const { data: telemetry } = useTelemetryQuery();

  const isHealthy = telemetry?.isRedisHealthy !== false && telemetry?.isDbHealthy !== false;
  const isDegraded = telemetry?.status === "degraded";
  const statusClass = isHealthy ? "healthy" : isDegraded ? "warning" : "error";

  const statusLabel = telemetry?.statusText || UI_COPY.COMMON.STATUS.HEALTHY;
  const apiLabel = telemetry?.apiLabel || "API :3015";
  const redisLabel = telemetry?.redisStatus || "Redis active";
  const versionLabel = telemetry?.version || UI_COPY.COMMON.BRAND.VERSION;
  const envLabel = telemetry?.environmentLabel || "Workspace";
  const docsUrl = telemetry?.docsUrl || "https://docs.devlab.io";
  const docsLabel = telemetry?.docsLabel || "Docs";

  return (
    <footer className="footer">
      <span className="flex items-center gap-2">
        <span className="status text-[10px]">
          <span className={`status-dot ${statusClass}`} />
          {statusLabel}
        </span>
        <span>·</span>
        <span>{apiLabel}</span>
        <span>·</span>
        <span>{redisLabel}</span>
        {telemetry?.totalApps !== undefined && (
          <>
            <span>·</span>
            <span>
              {telemetry.activeApps ?? 0}/{telemetry.totalApps} Apps Active
            </span>
          </>
        )}
      </span>

      <span className="flex items-center gap-5">
        <span>{versionLabel}</span>
        <span className="tag text-[9px]!">{envLabel}</span>
        <Button
          variant="link"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto gap-1 p-0 text-xs"
          onClick={() => window.open(docsUrl, "_blank", "noopener,noreferrer")}
        >
          {docsLabel}
          <ArrowUpRight className="size-3" />
        </Button>
      </span>
    </footer>
  );
};
