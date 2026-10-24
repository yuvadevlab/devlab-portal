"use client";

/**
 * @file apps/web/src/features/apps/components/recent-activity.tsx
 * @description Recent operational activity feed section with event icons and timestamp telemetry.
 * @module @devlab/portal-web/features/apps/components/recent-activity
 */

import React from "react";
import { Activity, ArrowUpRight, KeyRound, ShieldAlert, Plus, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@devlab-portal/ui";
import { TabKey, AuditAction } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

interface RecentActivityProps {
  auditLogs: AuditLog[];
  onNavigateTab: (tab: TabKey) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ auditLogs, onNavigateTab }) => {
  const getEventIcon = (action: string) => {
    switch (action.toUpperCase().replace(/[\s.-]+/g, "_")) {
      case AuditAction.API_KEY_CREATED:
      case AuditAction.API_KEY_REVOKED:
        return <KeyRound className="size-3.5" />;
      case AuditAction.APP_ACTIVATED:
      case AuditAction.APP_DEACTIVATED:
      case AuditAction.STATUS_UPDATED:
        return <ShieldAlert className="size-3.5" />;
      default:
        return <Plus className="size-3.5" />;
    }
  };

  const formatEventAction = (action: string): string => {
    switch (action.toUpperCase().replace(/[\s.-]+/g, "_")) {
      case AuditAction.API_KEY_CREATED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.KEY_CREATED;
      case AuditAction.API_KEY_REVOKED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.KEY_REVOKED;
      case AuditAction.APP_REGISTERED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.APP_REGISTERED;
      case AuditAction.APP_UPDATED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.APP_UPDATED;
      case AuditAction.APP_ACTIVATED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.APP_ACTIVATED;
      case AuditAction.APP_DEACTIVATED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.APP_DEACTIVATED;
      case AuditAction.STATUS_UPDATED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.STATUS_UPDATED;
      case AuditAction.USER_INVITED:
        return UI_COPY.APPS.RECENT_ACTIVITY.ACTIONS.USER_INVITED;
      default:
        return action.replaceAll(".", " ").replaceAll("_", " ").toLowerCase();
    }
  };

  const getRelativeTime = (timestamp?: string) => {
    if (!timestamp) return UI_COPY.COMMON.TIME.JUST_NOW;
    try {
      const date = new Date(timestamp);
      if (Number.isNaN(date.getTime())) return UI_COPY.COMMON.TIME.JUST_NOW;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return UI_COPY.COMMON.TIME.JUST_NOW;
    }
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
        {auditLogs.slice(0, 3).map((event) => (
          <div className="activity-row" key={event.id}>
            <span className="text-muted-foreground">{getEventIcon(event.action)}</span>
            <span>
              <span className="text-foreground font-medium">
                {event.actor?.name ||
                  event.actor?.email ||
                  event.actorId ||
                  UI_COPY.COMMON.MEMBER.SYSTEM}
              </span>{" "}
              <span className="text-muted-foreground">{formatEventAction(event.action)}</span>{" "}
              <span className="text-foreground font-semibold">{event.targetId}</span>
            </span>
            <span className="tag hidden sm:inline-flex">{event.action}</span>
            <time dateTime={event.createdAt} suppressHydrationWarning>
              {getRelativeTime(event.createdAt)}
            </time>
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
