"use client";

/**
 * @file apps/web/src/features/apps/components/app-settings-drawer.tsx
 * @description Slide-over settings panel enabling modification of all application fields configured during registration.
 * @module @devlab/portal-web/features/apps/components/app-settings-drawer
 */

import React, { useState, useEffect } from "react";
import { Check, Sliders, CheckCircle2 } from "lucide-react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@devlab-portal/ui";
import { logger } from "@/lib/logger";
import { UI_COPY } from "@/lib/ui-copy";
import { AppEnvironment } from "@/lib/constants";
import { SettingsIdentitySection } from "./settings-drawer/settings-identity-section";
import { SettingsRuntimeSection } from "./settings-drawer/settings-runtime-section";
import { SettingsEndpointsSection } from "./settings-drawer/settings-endpoints-section";
import { SettingsCallbacksSection } from "./settings-drawer/settings-callbacks-section";
import { SettingsAdvancedSection } from "./settings-drawer/settings-advanced-section";
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
  const [appId, setAppId] = useState("");
  const [slug, setSlug] = useState("");
  const [environment, setEnvironment] = useState<string>(AppEnvironment.LOCAL_DEV);
  const [description, setDescription] = useState("");
  const [workingDir, setWorkingDir] = useState("");
  const [devCommand, setDevCommand] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [startCommand, setStartCommand] = useState("");
  const [dependsOn, setDependsOn] = useState<string[]>([]);
  const [originUrl, setOriginUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [healthUrl, setHealthUrl] = useState("");
  const [callbacks, setCallbacks] = useState<string[]>([]);
  const [themeColor, setThemeColor] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [maintenanceNote, setMaintenanceNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (app) {
      setName(app.name || "");
      setAppId(app.appId || "");
      setSlug(app.slug || "");
      setEnvironment(app.environment || AppEnvironment.LOCAL_DEV);
      setDescription(app.description || "");
      setWorkingDir(app.workingDir || "");
      setDevCommand(app.devCommand || "");
      setBuildCommand(app.buildCommand || "");
      setStartCommand(app.startCommand || "");
      setDependsOn(app.dependsOn || []);
      setOriginUrl(app.originUrl || "");
      setApiUrl(app.apiUrl || "");
      setHealthUrl(app.healthUrl || "");
      setCallbacks(app.callbackUrls || []);
      setThemeColor(app.themeColor || "");
      setIconUrl(app.iconUrl || "");
      setMaintenanceNote(app.maintenanceNote || "");
      setSavedSuccess(false);
    }
  }, [app]);

  if (!app) return null;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const filteredCallbacks = callbacks.map((u) => u.trim()).filter(Boolean);
      await onSave(app.id, {
        appId: appId.trim() || undefined,
        name: name.trim() || undefined,
        slug: slug.trim() || undefined,
        environment,
        description: description.trim() || undefined,
        workingDir: workingDir.trim() || undefined,
        devCommand: devCommand.trim() || undefined,
        buildCommand: buildCommand.trim() || undefined,
        startCommand: startCommand.trim() || undefined,
        dependsOn: dependsOn.length > 0 ? dependsOn : undefined,
        originUrl: originUrl.trim() || undefined,
        apiUrl: apiUrl.trim() || undefined,
        healthUrl: healthUrl.trim() || undefined,
        callbackUrls: filteredCallbacks,
        themeColor: themeColor.trim() || undefined,
        iconUrl: iconUrl.trim() || undefined,
        maintenanceNote: maintenanceNote.trim() || undefined,
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="app-drawer-content">
        <SheetHeader>
          <div className="app-drawer-header-row">
            <div className="app-drawer-icon-box">
              <Sliders className="app-drawer-icon" />
            </div>
            <div>
              <SheetTitle className="app-drawer-title">{UI_COPY.APPS.DRAWER.TITLE}</SheetTitle>
              <SheetDescription className="app-drawer-subtitle">
                {app.name} · {app.appId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form id="app-settings-form" onSubmit={handleSubmit} className="app-drawer-form">
          {savedSuccess && (
            <div className="app-drawer-success-alert">
              <CheckCircle2 className="alert-icon" />
              <span>{UI_COPY.APPS.DRAWER.SUCCESS_ALERT}</span>
            </div>
          )}

          <div className="app-drawer-section">
            <div className="app-drawer-section-label">{UI_COPY.APPS.DRAWER.SECTION_IDENTITY}</div>
            <SettingsIdentitySection
              name={name}
              appId={appId}
              slug={slug}
              environment={environment}
              description={description}
              onChangeName={setName}
              onChangeAppId={setAppId}
              onChangeSlug={setSlug}
              onChangeEnvironment={setEnvironment}
              onChangeDescription={setDescription}
            />
          </div>

          <div className="app-drawer-section app-drawer-section-divider">
            <div className="app-drawer-section-label">{UI_COPY.APPS.DRAWER.SECTION_RUNTIME}</div>
            <SettingsRuntimeSection
              workingDir={workingDir}
              devCommand={devCommand}
              buildCommand={buildCommand}
              startCommand={startCommand}
              dependsOn={dependsOn}
              currentAppId={app.appId}
              onChangeWorkingDir={setWorkingDir}
              onChangeDevCommand={setDevCommand}
              onChangeBuildCommand={setBuildCommand}
              onChangeStartCommand={setStartCommand}
              onChangeDependsOn={setDependsOn}
            />
          </div>

          <div className="app-drawer-section app-drawer-section-divider">
            <div className="app-drawer-section-label">{UI_COPY.APPS.DRAWER.SECTION_ENDPOINTS}</div>
            <SettingsEndpointsSection
              originUrl={originUrl}
              apiUrl={apiUrl}
              healthUrl={healthUrl}
              onChangeOriginUrl={setOriginUrl}
              onChangeApiUrl={setApiUrl}
              onChangeHealthUrl={setHealthUrl}
            />
          </div>

          <div className="app-drawer-section app-drawer-section-divider">
            <div className="app-drawer-section-label">{UI_COPY.APPS.DRAWER.SECTION_CALLBACKS}</div>
            <SettingsCallbacksSection
              callbacks={callbacks}
              onUpdateCallback={(i, val) => {
                const next = [...callbacks];
                next[i] = val;
                setCallbacks(next);
              }}
              onRemoveCallback={(i) => setCallbacks((prev) => prev.filter((_, idx) => idx !== i))}
              onAddCallback={() => setCallbacks((prev) => [...prev, ""])}
            />
          </div>

          <div className="app-drawer-section app-drawer-section-divider">
            <div className="app-drawer-section-label">{UI_COPY.APPS.DRAWER.SECTION_BRANDING}</div>
            <SettingsAdvancedSection
              themeColor={themeColor}
              iconUrl={iconUrl}
              maintenanceNote={maintenanceNote}
              onChangeThemeColor={setThemeColor}
              onChangeIconUrl={setIconUrl}
              onChangeMaintenanceNote={setMaintenanceNote}
            />
          </div>
        </form>

        <SheetFooter className="app-drawer-footer">
          <Button type="button" variant="outline" onClick={onClose} className="drawer-btn">
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>
          <Button
            type="submit"
            form="app-settings-form"
            disabled={isSubmitting}
            className="drawer-btn drawer-btn-primary"
          >
            <Check className="btn-icon" />
            {UI_COPY.APPS.DRAWER.SAVE_BTN}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
