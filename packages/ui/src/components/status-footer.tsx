"use client";

import React from "react";
import { ArrowUpRight, Zap } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

export interface StatusFooterProps {
  statusLabel: string;
  statusClass: "healthy" | "warning" | "error";
  latencyMs?: number;
  apiLabel?: string;
  redisLabel?: string;
  activeApps?: number;
  totalApps?: number;
  appsActiveLabel?: string;
  versionLabel: string;
  environmentLabel: string;
  commandHint?: string;
  docsUrl?: string;
  docsLabel?: string;
}

/**
 * Displays service health, cluster latency, environment metadata, and shortcuts in the app footer.
 */
export function StatusFooter({
  statusLabel,
  statusClass,
  latencyMs,
  apiLabel,
  redisLabel,
  activeApps,
  totalApps,
  appsActiveLabel,
  versionLabel,
  environmentLabel,
  commandHint,
  docsUrl,
  docsLabel,
}: StatusFooterProps) {
  return (
    <footer className="footer">
      <span className="flex items-center gap-2">
        <span className="status text-[10px]">
          <span className={`status-dot ${statusClass}`} />
          {statusLabel}
        </span>

        {latencyMs !== undefined && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-muted-foreground inline-flex items-center gap-1 font-mono text-[10px]">
              <Zap className="size-2.5 text-amber-500" />
              {latencyMs}ms latency
            </span>
          </>
        )}

        {statusClass !== "healthy" && redisLabel && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-[10px] text-amber-500">{redisLabel}</span>
          </>
        )}

        {apiLabel && !latencyMs && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-[10px]">{apiLabel}</span>
          </>
        )}

        {totalApps !== undefined && appsActiveLabel && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-[10px]">
              {activeApps ?? 0}/{totalApps} {appsActiveLabel}
            </span>
          </>
        )}
      </span>

      <span className="flex items-center gap-4">
        {commandHint && (
          <span className="text-muted-foreground hidden text-[10px] md:inline">{commandHint}</span>
        )}
        <span className="text-muted-foreground text-[10px]">{versionLabel}</span>
        <span className="tag text-[9px]!">{environmentLabel}</span>
        {docsUrl ? (
          <Button
            variant="link"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-auto gap-1 p-0 text-xs"
            onClick={() => window.open(docsUrl, "_blank", "noopener,noreferrer")}
          >
            {docsLabel}
            <ArrowUpRight className="size-3" />
          </Button>
        ) : null}
      </span>
    </footer>
  );
}
