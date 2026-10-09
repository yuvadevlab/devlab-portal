/**
 * @file apps/web/src/features/apps/components/kill-switch-modal.tsx
 * @description Confirmation modal for severing or restoring microservice routing and tokens.
 * @module @devlab/portal-web/features/apps/components/kill-switch-modal
 */

import React, { useState } from "react";
import { AlertTriangle, Power, CheckCircle, X } from "lucide-react";
import { Button, Textarea } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import type { RegisteredApp } from "../types";

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
      console.error("Failed to toggle kill switch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                app.isActive
                  ? "bg-red-500/15 text-red-400 border border-red-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {app.isActive ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                {app.isActive
                  ? UI_COPY.APPS.KILL_SWITCH.TITLE_TRIGGER
                  : UI_COPY.APPS.KILL_SWITCH.TITLE_RESTORE}
              </h3>
              <p className="font-mono text-xs text-[var(--muted-foreground)]">
                {app.name} ({app.appId})
              </p>
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

        {/* Warning Callout Banner */}
        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs leading-relaxed ${
            app.isActive
              ? "border-red-500/30 bg-red-500/10 text-red-200"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {app.isActive
            ? UI_COPY.APPS.KILL_SWITCH.WARNING_TRIGGER
            : UI_COPY.APPS.KILL_SWITCH.WARNING_RESTORE}
        </div>

        {/* Optional Incident / Maintenance Note input */}
        {app.isActive && (
          <div className="mt-4">
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
              {UI_COPY.APPS.KILL_SWITCH.REASON_LABEL}
            </label>
            <Textarea
              rows={3}
              value={maintenanceNote}
              onChange={(e) => setMaintenanceNote(e.target.value)}
              placeholder={UI_COPY.APPS.KILL_SWITCH.REASON_PLACEHOLDER}
              className="bg-[var(--background)] border-[var(--border)] text-xs resize-none"
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 border-[var(--border)]"
          >
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>

          <Button
            type="button"
            onClick={handleAction}
            disabled={isSubmitting}
            variant={app.isActive ? "destructive" : "default"}
            className={`text-xs h-9 font-semibold ${
              app.isActive
                ? "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {app.isActive ? (
              <>
                <Power className="h-3.5 w-3.5 mr-1.5" />
                {UI_COPY.APPS.KILL_SWITCH.CONFIRM_TRIGGER}
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                {UI_COPY.APPS.KILL_SWITCH.CONFIRM_RESTORE}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
