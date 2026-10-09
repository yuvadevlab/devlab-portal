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
    <div className="animate-in fade-in fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="border-border bg-card flex size-full max-w-lg flex-col justify-between border-l p-6 shadow-2xl">
        {/* Drawer Header */}
        <div>
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <h3 className="text-foreground text-base font-bold">
                  {UI_COPY.AUDIT.DRAWER.TITLE}
                </h3>
                <p className="text-muted-foreground font-mono text-xs">{log.action}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:bg-background hover:text-foreground rounded-lg p-1.5"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Key Facts Summary */}
          <div className="border-border bg-background/60 mt-4 space-y-2 rounded-xl border p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{UI_COPY.AUDIT.DRAWER.EVENT_ID}:</span>
              <span className="text-foreground font-mono">{log.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{UI_COPY.AUDIT.DRAWER.ACTOR}:</span>
              <span className="text-foreground font-mono">{log.actor?.email || log.actorId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{UI_COPY.AUDIT.DRAWER.TARGET_TYPE}:</span>
              <span className="text-foreground font-mono">{log.targetType}</span>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-foreground text-xs font-semibold">
                {UI_COPY.AUDIT.DRAWER.PAYLOAD_JSON}
              </label>
              <CopyButton textToCopy={jsonFormatted} />
            </div>
            <pre className="border-border bg-background max-h-[calc(100vh-280px)] overflow-auto rounded-lg border p-3 font-mono text-[11px] text-slate-200">
              {jsonFormatted}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-border mt-4 flex justify-end border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border h-9 text-xs"
          >
            {UI_COPY.COMMON.ACTIONS.CLOSE}
          </Button>
        </div>
      </div>
    </div>
  );
};
