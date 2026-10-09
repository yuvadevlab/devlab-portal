/**
 * @file apps/web/src/features/audit/components/audit-inspector-drawer.tsx
 * @description Slide-over inspection drawer for deep forensic analysis of raw JSON event payloads.
 * Consumes @yuva-devlab/ui CopyButton and Button primitives.
 * @module @devlab/portal-web/features/audit/components/audit-inspector-drawer
 */

import React from "react";
import { X, ShieldCheck } from "lucide-react";
import { Button, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import type { AuditLog } from "../types";

interface AuditInspectorDrawerProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditInspectorDrawer: React.FC<AuditInspectorDrawerProps> = ({
  log,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !log) {
    return null;
  }

  const jsonFormatted = JSON.stringify(log, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="flex h-full w-full max-w-lg flex-col justify-between border-l border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary)]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  {UI_COPY.AUDIT.DRAWER.TITLE}
                </h3>
                <p className="font-mono text-xs text-[var(--muted-foreground)]">{log.action}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Key Facts Summary */}
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">
                {UI_COPY.AUDIT.DRAWER.EVENT_ID}:
              </span>
              <span className="font-mono text-[var(--foreground)]">{log.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">{UI_COPY.AUDIT.DRAWER.ACTOR}:</span>
              <span className="font-mono text-[var(--foreground)]">
                {log.actor?.email || log.actorId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">
                {UI_COPY.AUDIT.DRAWER.TARGET_TYPE}:
              </span>
              <span className="font-mono text-[var(--foreground)]">{log.targetType}</span>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                {UI_COPY.AUDIT.DRAWER.PAYLOAD_JSON}
              </label>
              <CopyButton textToCopy={jsonFormatted} />
            </div>
            <pre className="max-h-[calc(100vh-280px)] overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-[11px] text-slate-200">
              {jsonFormatted}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[var(--border)] pt-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 border-[var(--border)]"
          >
            {UI_COPY.COMMON.ACTIONS.CLOSE}
          </Button>
        </div>
      </div>
    </div>
  );
};
