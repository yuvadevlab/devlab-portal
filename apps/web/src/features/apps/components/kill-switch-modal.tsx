"use client";

/**
 * @file apps/web/src/features/apps/components/kill-switch-modal.tsx
 * @description Confirmation modal for severing or restoring microservice routing and tokens.
 * @module @devlab/portal-web/features/apps/components/kill-switch-modal
 */

import React, { useState } from "react";
import { AlertTriangle, Power, CheckCircle, X } from "lucide-react";
import { Button, Textarea } from "@yuva-devlab/ui";
import { logger } from "@/lib/logger";
import { UI_COPY } from "@/lib/ui-copy";
import type { RegisteredApp } from "@/features/apps/types";

interface KillSwitchModalProps {
  app: RegisteredApp | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, nextState: boolean, maintenanceNote?: string) => Promise<void>;
}

export const KillSwitchModal: React.FC<KillSwitchModalProps> = ({
  app,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [maintenanceNote, setMaintenanceNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !app) {
    return null;
  }

  // Next target state: if currently active, next state is false (sever traffic)
  const nextIsActive = !app.isActive;

  const handleAction = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(app.id, nextIsActive, maintenanceNote || undefined);
      setMaintenanceNote("");
      onClose();
    } catch (err) {
      logger.error("Failed to toggle kill switch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="border-border bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 items-center justify-center rounded-xl ${
                app.isActive
                  ? "border-destructive/30 bg-destructive/15 text-destructive border"
                  : "border-success/30 bg-success/15 text-success border"
              }`}
            >
              {app.isActive ? (
                <AlertTriangle className="size-5" />
              ) : (
                <CheckCircle className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                {app.isActive
                  ? UI_COPY.APPS.KILL_SWITCH.TITLE_TRIGGER
                  : UI_COPY.APPS.KILL_SWITCH.TITLE_RESTORE}
              </h3>
              <p className="text-muted-foreground font-mono text-xs">
                {app.name} ({app.appId})
              </p>
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

        {/* Warning Callout Banner */}
        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs leading-relaxed ${
            app.isActive
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-success/30 bg-success/10 text-success"
          }`}
        >
          {app.isActive
            ? UI_COPY.APPS.KILL_SWITCH.WARNING_TRIGGER
            : UI_COPY.APPS.KILL_SWITCH.WARNING_RESTORE}
        </div>

        {/* Optional Incident / Maintenance Note input */}
        {app.isActive && (
          <div className="mt-4">
            <label className="text-foreground mb-1.5 block text-xs font-semibold">
              {UI_COPY.APPS.KILL_SWITCH.REASON_LABEL}
            </label>
            <Textarea
              rows={3}
              value={maintenanceNote}
              onChange={(e) => setMaintenanceNote(e.target.value)}
              placeholder={UI_COPY.APPS.KILL_SWITCH.REASON_PLACEHOLDER}
              className="bg-background border-border resize-none text-xs"
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="border-border mt-6 flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border h-9 text-xs"
          >
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>

          <Button
            type="button"
            onClick={handleAction}
            disabled={isSubmitting}
            variant={app.isActive ? "destructive" : "default"}
            className={`h-9 text-xs font-semibold ${
              app.isActive
                ? "bg-destructive text-destructive-foreground hover:opacity-90"
                : "bg-success text-success-foreground hover:opacity-90"
            }`}
          >
            {app.isActive ? (
              <>
                <Power className="mr-1.5 size-3.5" />
                {UI_COPY.APPS.KILL_SWITCH.CONFIRM_TRIGGER}
              </>
            ) : (
              <>
                <CheckCircle className="mr-1.5 size-3.5" />
                {UI_COPY.APPS.KILL_SWITCH.CONFIRM_RESTORE}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
