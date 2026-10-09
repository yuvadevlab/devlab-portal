/**
 * @file apps/web/src/features/apps/components/app-settings-drawer.tsx
 * @description Slide-over settings panel for configuring origin URLs, OAuth callbacks, and health endpoints.
 * @module @devlab/portal-web/features/apps/components/app-settings-drawer
 */

import React, { useState, useEffect } from "react";
import { X, Save, Sliders, CheckCircle2 } from "lucide-react";
import { Button, Input, Textarea } from "@yuva-devlab/ui";
import { logger } from "../../../lib/logger";
import { UI_COPY } from "../../../lib/ui-copy/index";
import type { RegisteredApp, UpdateAppSettingsPayload } from "../types";

interface AppSettingsDrawerProps {
  app: RegisteredApp | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, payload: UpdateAppSettingsPayload) => Promise<void>;
}

export const AppSettingsDrawer: React.FC<AppSettingsDrawerProps> = ({
  app,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originUrl, setOriginUrl] = useState("");
  const [healthUrl, setHealthUrl] = useState("");
  const [callbackUrls, setCallbackUrls] = useState("");
  const [maintenanceNote, setMaintenanceNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever selected app changes
  useEffect(() => {
    if (app) {
      setName(app.name);
      setDescription(app.description || "");
      setOriginUrl(app.originUrl);
      setHealthUrl(app.healthUrl);
      setCallbackUrls((app.callbackUrls || []).join("\n"));
      setMaintenanceNote(app.maintenanceNote || "");
      setSavedSuccess(false);
    }
  }, [app]);

  if (!isOpen || !app) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const urls = callbackUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);

      await onSave(app.id, {
        name,
        description,
        originUrl,
        healthUrl,
        callbackUrls: urls,
        maintenanceNote: maintenanceNote || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      logger.error("Failed to update app settings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="border-border bg-card flex size-full max-w-lg flex-col justify-between border-l p-6 shadow-2xl">
        {/* Drawer Header */}
        <div>
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
                <Sliders className="size-4" />
              </div>
              <div>
                <h3 className="text-foreground text-base font-bold">{UI_COPY.APPS.DRAWER.TITLE}</h3>
                <p className="text-muted-foreground font-mono text-xs">{app.appId}</p>
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

          {/* Settings Form Body */}
          <form
            id="app-settings-form"
            onSubmit={handleSubmit}
            className="mt-5 max-h-[calc(100vh-180px)] space-y-4 overflow-y-auto pr-1"
          >
            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{UI_COPY.APPS.DRAWER.SUCCESS_ALERT}</span>
              </div>
            )}

            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                {UI_COPY.APPS.DRAWER.NAME_LABEL}
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background border-border h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                {UI_COPY.APPS.DRAWER.DESC_LABEL}
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background border-border h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                {UI_COPY.APPS.DRAWER.ORIGIN_LABEL}
              </label>
              <Input
                value={originUrl}
                onChange={(e) => setOriginUrl(e.target.value)}
                required
                className="bg-background border-border h-9 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                {UI_COPY.APPS.DRAWER.HEALTH_LABEL}
              </label>
              <Input
                value={healthUrl}
                onChange={(e) => setHealthUrl(e.target.value)}
                required
                className="bg-background border-border h-9 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                {UI_COPY.APPS.DRAWER.CALLBACKS_LABEL}
              </label>
              <Textarea
                rows={4}
                value={callbackUrls}
                onChange={(e) => setCallbackUrls(e.target.value)}
                className="bg-background border-border resize-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-foreground mb-1.5 block text-xs font-semibold">
                {UI_COPY.APPS.DRAWER.NOTE_LABEL}
              </label>
              <Input
                value={maintenanceNote}
                onChange={(e) => setMaintenanceNote(e.target.value)}
                placeholder={UI_COPY.APPS.KILL_SWITCH.REASON_PLACEHOLDER}
                className="bg-background border-border h-9 text-xs"
              />
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="border-border mt-4 flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border h-9 text-xs"
          >
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>
          <Button
            type="submit"
            form="app-settings-form"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
          >
            <Save className="mr-1.5 size-3.5" />
            {UI_COPY.APPS.DRAWER.SAVE_BTN}
          </Button>
        </div>
      </div>
    </div>
  );
};
