"use client";

/**
 * @file apps/web/src/features/apps/components/app-settings-drawer.tsx
 * @description Slide-over settings panel matching Lovable console with Textarea for description,
 * dynamic callback URLs list with individual row actions, and zero raw HTML.
 * @module @devlab/portal-web/features/apps/components/app-settings-drawer
 */

import React, { useState, useEffect } from "react";
import { Check, Sliders, CheckCircle2, Plus, X } from "lucide-react";
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
} from "@devlab-portal/ui";
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
  const [apiUrl, setApiUrl] = useState("");
  const [healthUrl, setHealthUrl] = useState("");
  const [callbacks, setCallbacks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (app) {
      setName(app.name);
      setDescription(app.description || "");
      setOriginUrl(app.originUrl);
      setApiUrl(app.apiUrl || "");
      setHealthUrl(app.healthUrl);
      setCallbacks(app.callbackUrls || []);
      setSavedSuccess(false);
    }
  }, [app]);

  if (!app) {
    return null;
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const filteredCallbacks = callbacks.map((u) => u.trim()).filter(Boolean);
      await onSave(app.id, {
        name,
        description,
        originUrl,
        apiUrl: apiUrl.trim() || undefined,
        healthUrl,
        callbackUrls: filteredCallbacks,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      logger.error("Failed to update app settings:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCallback = (index: number, val: string) => {
    const next = [...callbacks];
    next[index] = val;
    setCallbacks(next);
  };

  const handleRemoveCallback = (index: number) => {
    setCallbacks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <Sliders className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">{UI_COPY.APPS.DRAWER.TITLE}</SheetTitle>
              <SheetDescription className="text-muted-foreground font-mono text-xs">
                {app.name} · {app.appId}
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
            <Label htmlFor="drawer-app-desc" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.DESC_LABEL}
            </Label>
            <Textarea
              id="drawer-app-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none font-sans text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-origin" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.ORIGIN_LABEL}
            </Label>
            <Input
              id="drawer-app-origin"
              type="url"
              value={originUrl}
              onChange={(e) => setOriginUrl(e.target.value)}
              required
              className="h-9 font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="drawer-app-api" className="text-xs font-semibold">
              {UI_COPY.APPS.DRAWER.API_LABEL}
            </Label>
            <Input
              id="drawer-app-api"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder={UI_COPY.APPS.DRAWER.API_PLACEHOLDER}
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

          <div className="space-y-2">
            <Label className="text-xs font-semibold">{UI_COPY.APPS.DRAWER.CALLBACKS_LABEL}</Label>
            <div className="space-y-2">
              {callbacks.map((c, i) => (
                <div className="flex items-center gap-2" key={i}>
                  <Input
                    type="url"
                    value={c}
                    onChange={(e) => handleUpdateCallback(i, e.target.value)}
                    required
                    className="h-9 flex-1 font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={UI_COPY.APPS.DRAWER.REMOVE_CALLBACK_ARIA}
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleRemoveCallback(i)}
                  >
                    <X className="text-destructive size-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCallbacks((prev) => [...prev, ""])}
              className="h-8 text-xs"
            >
              <Plus className="mr-1 size-3.5" />
              {UI_COPY.APPS.DRAWER.ADD_CALLBACK_BTN}
            </Button>
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
            <Check className="mr-1.5 size-3.5" />
            {UI_COPY.APPS.DRAWER.SAVE_BTN}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
