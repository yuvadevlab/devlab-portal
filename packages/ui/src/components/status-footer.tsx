"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

export interface StatusFooterProps {
  statusLabel: string;
  statusClass: "healthy" | "warning" | "error";
  apiLabel: string;
  redisLabel: string;
  activeApps?: number;
  totalApps?: number;
  appsActiveLabel: string;
  versionLabel: string;
  environmentLabel: string;
  docsUrl?: string;
  docsLabel?: string;
}

/**
 * Displays service health, environment metadata, and a documentation link in the app footer.
 */
export function StatusFooter({
  statusLabel,
  statusClass,
  apiLabel,
  redisLabel,
  activeApps,
  totalApps,
  appsActiveLabel,
  versionLabel,
  environmentLabel,
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
        <span>·</span>
        <span>{apiLabel}</span>
        <span>·</span>
        <span>{redisLabel}</span>
        {totalApps !== undefined && (
          <>
            <span>·</span>
            <span>
              {activeApps ?? 0}/{totalApps} {appsActiveLabel}
            </span>
          </>
        )}
      </span>

      <span className="flex items-center gap-5">
        <span>{versionLabel}</span>
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
