"use client";

/**
 * @file apps/web/src/features/apps/components/recent-activity.tsx
 * @description Recent operational activity feed section with event icons and timestamp telemetry.
 * @module @devlab/portal-web/features/apps/components/recent-activity
 */

import React from "react";
import { Activity, ArrowUpRight, KeyRound, ShieldAlert, Plus, ChevronRight } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { TabKey } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

interface RecentActivityProps {
  auditLogs: AuditLog[];
  onNavigateTab: (tab: TabKey) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ auditLogs, onNavigateTab }) => {
  const getEventIcon = (action: string) => {
    if (action.includes("key")) return <KeyRound className="size-3.5" />;
    if (action.includes("kill") || action.includes("status") || action.includes("role")) {
      return <ShieldAlert className="size-3.5" />;
    }
    return <Plus className="size-3.5" />;
  };

  const getRelativeTime = (index: number) => {
    if (index === 0) return `5 ${UI_COPY.APPS.RECENT_ACTIVITY.MINUTES_AGO}`;
    if (index === 1) return `17 ${UI_COPY.APPS.RECENT_ACTIVITY.MINUTES_AGO}`;
    if (index === 2) return `28 ${UI_COPY.APPS.RECENT_ACTIVITY.MINUTES_AGO}`;
    return `${(index + 1) * 15} ${UI_COPY.APPS.RECENT_ACTIVITY.MINUTES_AGO}`;
  };

  return (
    <section className="activity-section">
      <div className="section-heading">
        <h2>
          <Activity className="text-muted-foreground size-4" />
          {UI_COPY.APPS.RECENT_ACTIVITY.TITLE}
          <span className="tag py-0!">{UI_COPY.APPS.RECENT_ACTIVITY.LIVE_BADGE}</span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-1 text-xs"
          onClick={() => onNavigateTab(TabKey.AUDIT)}
        >
          {UI_COPY.APPS.RECENT_ACTIVITY.VIEW_LEDGER}
          <ArrowUpRight className="size-3" />
        </Button>
      </div>

      <div className="activity-list">
        {auditLogs.slice(0, 3).map((event, i) => (
          <div className="activity-row" key={event.id}>
            <span className="text-muted-foreground">{getEventIcon(event.action)}</span>
            <span>
              <span className="text-foreground font-medium">{event.actorId || "System"}</span>{" "}
              <span className="text-muted-foreground">
                {event.action
                  .replaceAll(".", " ")
                  .replace("key created", "created an API key for")
                  .replace("app registered", "registered")
                  .replace("status updated", "updated kill-switch status for")}
              </span>{" "}
              <span className="text-foreground font-semibold">{event.targetId}</span>
            </span>
            <span className="tag hidden sm:inline-flex">{event.action}</span>
            <time>{getRelativeTime(i)}</time>
            <ChevronRight className="text-muted-foreground size-3" />
          </div>
        ))}

        {auditLogs.length === 0 && (
          <div className="text-muted-foreground p-4 text-center text-xs">
            {UI_COPY.APPS.RECENT_ACTIVITY.EMPTY}
          </div>
        )}
      </div>
    </section>
  );
};
