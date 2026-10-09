"use client";

/**
 * @file apps/web/src/features/apps/components/app-settings-drawer.tsx
 * @description Slide-over settings panel for configuring origin URLs, OAuth callbacks, and health endpoints.
 * Fully built with @yuva-devlab/ui Sheet, Label, Input, Textarea, and Button components.
 * @module @devlab/portal-web/features/apps/components/app-settings-drawer
 */

import React, { useState, useEffect } from "react";
import { Save, Sliders, CheckCircle2 } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@yuva-devlab/ui";
import { logger } from "@/lib/logger";
import { UI_COPY } from "@/lib/ui-copy";
import type { RegisteredApp, UpdateAppSettingsPayload } from "@/features/apps/types";

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

  if (!app) {
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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <Sliders className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">{UI_COPY.APPS.DRAWER.TITLE}</SheetTitle>
              <SheetDescription className="text-muted-foreground font-mono text-xs">
                {app.appId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          id="app-settings-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto py-4 pr-1"
        >
          {savedSuccess && (
            <div className="border-success/20 bg-success/10 text-success flex items-center gap-2 rounded-lg border p-3 text-xs">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{UI_COPY.APPS.DRAWER.SUCCESS_ALERT}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-name" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.NAME_LABEL}
            </Label>
            <Input
              id="drawer-app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-desc" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.DESC_LABEL}
            </Label>
            <Input
              id="drawer-app-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-origin" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.ORIGIN_LABEL}
            </Label>
            <Input
              id="drawer-app-origin"
              value={originUrl}
              onChange={(e) => setOriginUrl(e.target.value)}
              required
              className="h-9 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-health" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.HEALTH_LABEL}
            </Label>
            <Input
              id="drawer-app-health"
              value={healthUrl}
              onChange={(e) => setHealthUrl(e.target.value)}
              required
              className="h-9 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-callbacks" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.CALLBACKS_LABEL}
            </Label>
            <Textarea
              id="drawer-app-callbacks"
              rows={4}
              value={callbackUrls}
              onChange={(e) => setCallbackUrls(e.target.value)}
              className="resize-none font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-note" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.NOTE_LABEL}
            </Label>
            <Input
              id="drawer-app-note"
              value={maintenanceNote}
              onChange={(e) => setMaintenanceNote(e.target.value)}
              placeholder={UI_COPY.APPS.KILL_SWITCH.REASON_PLACEHOLDER}
              className="h-9 text-xs"
            />
          </div>
        </form>

        <SheetFooter className="border-border border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 text-xs">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
