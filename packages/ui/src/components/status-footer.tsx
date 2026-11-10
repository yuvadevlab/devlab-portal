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
      <span className="footer-left">
        <span className="status status-pill">
          <span className={`status-dot ${statusClass}`} />
          {statusLabel}
        </span>

        {latencyMs !== undefined && (
          <>
            <span className="footer-sep">·</span>
            <span className="footer-latency">
              <Zap className="footer-latency-icon" />
              {latencyMs}ms latency
            </span>
          </>
        )}

        {statusClass !== "healthy" && redisLabel && (
          <>
            <span className="footer-sep">·</span>
            <span className="footer-redis-warning">{redisLabel}</span>
          </>
        )}

        {apiLabel && !latencyMs && (
          <>
            <span className="footer-sep">·</span>
            <span className="footer-api-label">{apiLabel}</span>
          </>
        )}

        {totalApps !== undefined && appsActiveLabel && (
          <>
            <span className="footer-sep">·</span>
            <span className="footer-apps-stat">
              {activeApps ?? 0}/{totalApps} {appsActiveLabel}
            </span>
          </>
        )}
      </span>

      <span className="footer-right">
        {commandHint && <span className="footer-hint">{commandHint}</span>}
        <span className="footer-version">{versionLabel}</span>
        <span className="tag tag-mini">{environmentLabel}</span>
        {docsUrl ? (
          <Button
            variant="link"
            size="sm"
            className="footer-docs-link"
            onClick={() => window.open(docsUrl, "_blank", "noopener,noreferrer")}
          >
            {docsLabel}
            <ArrowUpRight className="footer-docs-icon" />
          </Button>
        ) : null}
      </span>
    </footer>
  );
}
