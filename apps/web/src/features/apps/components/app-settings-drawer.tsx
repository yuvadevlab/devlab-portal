/**
 * @file apps/web/src/features/apps/components/app-settings-drawer.tsx
 * @description Slide-over settings panel for configuring origin URLs, OAuth callbacks, and health endpoints.
 * @module @devlab/portal-web/features/apps/components/app-settings-drawer
 */

import React, { useState, useEffect } from "react";
import { X, Save, Sliders, CheckCircle2 } from "lucide-react";
import { Button, Input, Textarea } from "@yuva-devlab/ui";
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
      console.error("Failed to update app settings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="flex h-full w-full max-w-lg flex-col justify-between border-l border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/15 text-[var(--primary)]">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[var(--foreground)]">
                  {UI_COPY.APPS.DRAWER.TITLE}
                </h3>
                <p className="font-mono text-xs text-[var(--muted-foreground)]">{app.appId}</p>
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

          {/* Settings Form Body */}
          <form
            id="app-settings-form"
            onSubmit={handleSubmit}
            className="mt-5 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] pr-1"
          >
            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{UI_COPY.APPS.DRAWER.SUCCESS_ALERT}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                {UI_COPY.APPS.DRAWER.NAME_LABEL}
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[var(--background)] border-[var(--border)] text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                {UI_COPY.APPS.DRAWER.DESC_LABEL}
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)] text-xs h-9"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                {UI_COPY.APPS.DRAWER.ORIGIN_LABEL}
              </label>
              <Input
                value={originUrl}
                onChange={(e) => setOriginUrl(e.target.value)}
                required
                className="bg-[var(--background)] border-[var(--border)] text-xs h-9 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                {UI_COPY.APPS.DRAWER.HEALTH_LABEL}
              </label>
              <Input
                value={healthUrl}
                onChange={(e) => setHealthUrl(e.target.value)}
                required
                className="bg-[var(--background)] border-[var(--border)] text-xs h-9 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                {UI_COPY.APPS.DRAWER.CALLBACKS_LABEL}
              </label>
              <Textarea
                rows={4}
                value={callbackUrls}
                onChange={(e) => setCallbackUrls(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)] text-xs font-mono resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
                {UI_COPY.APPS.DRAWER.NOTE_LABEL}
              </label>
              <Input
                value={maintenanceNote}
                onChange={(e) => setMaintenanceNote(e.target.value)}
                placeholder={UI_COPY.APPS.KILL_SWITCH.REASON_PLACEHOLDER}
                className="bg-[var(--background)] border-[var(--border)] text-xs h-9"
              />
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 border-[var(--border)]"
          >
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>
          <Button
            type="submit"
            form="app-settings-form"
            disabled={isSubmitting}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs h-9 font-medium"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {UI_COPY.APPS.DRAWER.SAVE_BTN}
          </Button>
        </div>
      </div>
    </div>
  );
};
