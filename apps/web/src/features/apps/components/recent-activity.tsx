"use client";

/**
 * @file apps/web/src/features/apps/components/recent-activity.tsx
 * @description Recent operational activity feed section with event icons, app identifier resolution, and live relative timestamps.
 * @module @devlab/portal-web/features/apps/components/recent-activity
 */

import React, { useMemo, useState } from "react";
import { Activity, ArrowUpRight, KeyRound, ShieldAlert, Plus, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@devlab-portal/ui";
import { TabKey, AuditAction } from "@/lib/constants/enums";
import { UI_COPY } from "@/lib/ui-copy";
import { AuditInspectorDrawer } from "@/features/audit/components/audit-inspector-drawer";
import type { AuditLog } from "@/features/audit/types";
import type { RegisteredApp } from "@/features/apps/types";

interface RecentActivityProps {
  auditLogs: AuditLog[];
  apps?: RegisteredApp[];
  onNavigateTab: (tab: TabKey) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  auditLogs,
  apps = [],
  onNavigateTab,
}) => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const getEventIcon = (action: string) => {
    switch (action.toUpperCase().replace(/[\s.-]+/g, "_")) {
      case AuditAction.API_KEY_CREATED:
      case AuditAction.API_KEY_REVOKED:
        return <KeyRound className="activity-event-icon" />;
      case AuditAction.APP_ACTIVATED:
      case AuditAction.APP_DEACTIVATED:
      case AuditAction.STATUS_UPDATED:
        return <ShieldAlert className="activity-event-icon" />;
      default:
        return <Plus className="activity-event-icon" />;
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

  const resolveTargetLabel = (event: AuditLog): string => {
    const meta = event.metadata as Record<string, unknown> | null | undefined;
    if (typeof meta?.appId === "string" && meta.appId.trim()) {
      return meta.appId.trim();
    }
    if (typeof meta?.name === "string" && meta.name.trim()) {
      return meta.name.trim();
    }

    if (apps && apps.length > 0) {
      const matched = apps.find(
        (a) => a.id === event.targetId || a.appId === event.targetId || a.slug === event.targetId,
      );
      if (matched) {
        return matched.appId || matched.name;
      }
    }

    return event.targetId;
  };

  const getRelativeTime = (timestamp?: string): string => {
    if (!timestamp) return UI_COPY.COMMON.TIME.JUST_NOW;
    try {
      const date = new Date(timestamp);
      const timeMs = date.getTime();
      if (Number.isNaN(timeMs)) return UI_COPY.COMMON.TIME.JUST_NOW;

      const diffMs = Date.now() - timeMs;
      // If event happened within 45 seconds (or slight negative clock skew), show "just now"
      if (diffMs < 45000 && diffMs > -15000) {
        return UI_COPY.COMMON.TIME.JUST_NOW;
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return UI_COPY.COMMON.TIME.JUST_NOW;
    }
  };

  const latestLogs = useMemo(() => {
    return [...auditLogs]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [auditLogs]);

  return (
    <section className="activity-section">
      <div className="section-heading">
        <h2>
          <Activity className="section-heading-icon" />
          {UI_COPY.APPS.RECENT_ACTIVITY.TITLE}
          <span className="tag tag-compact">{UI_COPY.APPS.RECENT_ACTIVITY.LIVE_BADGE}</span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="view-ledger-btn"
          onClick={() => onNavigateTab(TabKey.AUDIT)}
        >
          {UI_COPY.APPS.RECENT_ACTIVITY.VIEW_LEDGER}
          <ArrowUpRight className="activity-arrow" />
        </Button>
      </div>

      <div className="activity-list">
        {latestLogs.map((event) => (
          <div
            className="activity-row"
            key={event.id}
            role="button"
            tabIndex={0}
            title={UI_COPY.APPS.RECENT_ACTIVITY.INSPECT_TOOLTIP}
            onClick={() => setSelectedLog(event)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedLog(event);
              }
            }}
          >
            <span className="activity-icon-wrap">{getEventIcon(event.action)}</span>
            <span>
              <span className="activity-actor">
                {event.actor?.name ||
                  event.actor?.email ||
                  event.actorId ||
                  UI_COPY.COMMON.MEMBER.SYSTEM}
              </span>{" "}
              <span className="activity-action-label">{formatEventAction(event.action)}</span>{" "}
              <span className="activity-target">{resolveTargetLabel(event)}</span>
            </span>
            <span className="tag tag-responsive">{event.action}</span>
            <time dateTime={event.createdAt} suppressHydrationWarning>
              {getRelativeTime(event.createdAt)}
            </time>
            <ChevronRight className="activity-arrow" />
          </div>
        ))}

        {latestLogs.length === 0 && (
          <div className="activity-empty">{UI_COPY.APPS.RECENT_ACTIVITY.EMPTY}</div>
        )}
      </div>

      <AuditInspectorDrawer
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </section>
  );
};
