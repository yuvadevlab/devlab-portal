"use client";

/**
 * @file apps/web/src/features/apps/components/kill-switch-modal.tsx
 * @description Confirmation modal for severing or restoring microservice routing and tokens.
 * Fully built with @devlab-portal/ui Dialog, Label, Textarea, and Button components.
 * @module @devlab/portal-web/features/apps/components/kill-switch-modal
 */

import React, { useState } from "react";
import { AlertTriangle, Power, Zap } from "lucide-react";
import {
  Button,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@devlab-portal/ui";
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <div className="kill-switch-header-group">
            <div className={`kill-switch-icon-box ${app.isActive ? "danger" : "success"}`}>
              {app.isActive ? (
                <AlertTriangle className="modal-header-icon" />
              ) : (
                <Zap className="modal-header-icon" />
              )}
            </div>
            <div>
              <DialogTitle className="modal-title-bold">
                {app.isActive
                  ? UI_COPY.APPS.KILL_SWITCH.TITLE_TRIGGER
                  : UI_COPY.APPS.KILL_SWITCH.TITLE_RESTORE}
              </DialogTitle>
              <DialogDescription className="modal-desc-mono">
                {app.name} ({app.appId})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="kill-switch-body">
          {/* Warning Callout Banner */}
          <div className={`kill-switch-banner ${app.isActive ? "danger" : "success"}`}>
            {app.isActive
              ? UI_COPY.APPS.KILL_SWITCH.WARNING_TRIGGER
              : UI_COPY.APPS.KILL_SWITCH.WARNING_RESTORE}
          </div>

          {/* Optional Incident / Maintenance Note input */}
          {app.isActive && (
            <div className="form-field-group">
              <Label htmlFor="kill-switch-reason" className="form-field-label">
                {UI_COPY.APPS.KILL_SWITCH.REASON_LABEL}
              </Label>
              <Textarea
                id="kill-switch-reason"
                rows={3}
                value={maintenanceNote}
                onChange={(e) => setMaintenanceNote(e.target.value)}
                placeholder={UI_COPY.APPS.KILL_SWITCH.REASON_PLACEHOLDER}
                className="kill-switch-textarea"
              />
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="modal-footer-btn">
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>

          <Button
            type="button"
            onClick={handleAction}
            disabled={isSubmitting}
            variant={app.isActive ? "destructive" : "default"}
            className={`modal-footer-btn ${
              app.isActive ? "kill-switch-btn-danger" : "kill-switch-btn-success"
            }`}
          >
            {app.isActive ? (
              <>
                <Power className="button-icon-prefix" />
                {UI_COPY.APPS.KILL_SWITCH.CONFIRM_TRIGGER}
              </>
            ) : (
              <>
                <Zap className="button-icon-prefix" />
                {UI_COPY.APPS.KILL_SWITCH.CONFIRM_RESTORE}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
