"use client";

/**
 * @file apps/web/src/features/audit/components/audit-inspector-drawer.tsx
 * @description Slide-over inspection drawer for deep forensic analysis of raw JSON event payloads.
 * Fully built with @devlab-portal/ui Sheet, Label, CopyButton, and Button primitives.
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
} from "@devlab-portal/ui";
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
      <SheetContent side="right" className="audit-drawer-content">
        <SheetHeader>
          <div className="audit-drawer-header-row">
            <div className="audit-drawer-icon-box">
              <ShieldCheck className="audit-drawer-icon" />
            </div>
            <div>
              <SheetTitle className="audit-drawer-title">{UI_COPY.AUDIT.DRAWER.TITLE}</SheetTitle>
              <SheetDescription className="audit-drawer-subtitle">{log.action}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="audit-drawer-body">
          {/* Key Facts Summary */}
          <div className="audit-facts-card">
            <div className="audit-fact-row">
              <span className="audit-fact-label">{UI_COPY.AUDIT.DRAWER.EVENT_ID}:</span>
              <span className="audit-fact-value">{log.id}</span>
            </div>
            <div className="audit-fact-row">
              <span className="audit-fact-label">{UI_COPY.AUDIT.DRAWER.ACTOR}:</span>
              <span className="audit-fact-value">{log.actor?.email || log.actorId}</span>
            </div>
            <div className="audit-fact-row">
              <span className="audit-fact-label">{UI_COPY.AUDIT.DRAWER.TARGET_TYPE}:</span>
              <span className="audit-fact-value">{log.targetType}</span>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="form-field-group">
            <div className="audit-json-header">
              <Label className="form-field-label">{UI_COPY.AUDIT.DRAWER.PAYLOAD_JSON}</Label>
              <CopyButton textToCopy={jsonFormatted} />
            </div>
            <pre className="audit-json-viewer">{jsonFormatted}</pre>
          </div>
        </div>

        <SheetFooter className="audit-drawer-footer">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="audit-drawer-close-btn"
          >
            {UI_COPY.COMMON.ACTIONS.CLOSE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
