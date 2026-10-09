"use client";

/**
 * @file apps/web/src/features/audit/components/audit-inspector-drawer.tsx
 * @description Slide-over inspection drawer for deep forensic analysis of raw JSON event payloads.
 * Fully built with @yuva-devlab/ui Sheet, Label, CopyButton, and Button primitives.
 * @module @devlab/portal-web/features/audit/components/audit-inspector-drawer
 */

import React from "react";
import { ShieldCheck } from "lucide-react";
import {
  Button,
  CopyButton,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { AuditLog } from "@/features/audit/types";

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
  if (!log) {
    return null;
  }

  const jsonFormatted = JSON.stringify(log, null, 2);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">{UI_COPY.AUDIT.DRAWER.TITLE}</SheetTitle>
              <SheetDescription className="text-muted-foreground font-mono text-xs">
                {log.action}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {/* Key Facts Summary */}
          <div className="border-border bg-card space-y-2 rounded-xl border p-3.5 text-xs">
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
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">{UI_COPY.AUDIT.DRAWER.PAYLOAD_JSON}</Label>
              <CopyButton textToCopy={jsonFormatted} />
            </div>
            <pre className="border-border bg-card text-foreground max-h-[calc(100vh-280px)] overflow-auto rounded-lg border p-3 font-mono text-[11px]">
              {jsonFormatted}
            </pre>
          </div>
        </div>

        <SheetFooter className="border-border border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs">
            {UI_COPY.COMMON.ACTIONS.CLOSE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
