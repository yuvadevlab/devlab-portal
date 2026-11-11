"use client";

/**
 * @file apps/web/src/features/apps/components/settings-drawer/settings-advanced-section.tsx
 * @description Advanced application properties: Theme Color, Icon URL, and Maintenance Note.
 * @module @devlab/portal-web/features/apps/components/settings-drawer
 */

import React from "react";
import { Input, Label } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface SettingsAdvancedSectionProps {
  themeColor: string;
  iconUrl: string;
  maintenanceNote: string;
  onChangeThemeColor: (val: string) => void;
  onChangeIconUrl: (val: string) => void;
  onChangeMaintenanceNote: (val: string) => void;
}

export const SettingsAdvancedSection: React.FC<SettingsAdvancedSectionProps> = ({
  themeColor,
  iconUrl,
  maintenanceNote,
  onChangeThemeColor,
  onChangeIconUrl,
  onChangeMaintenanceNote,
}) => {
  return (
    <div className="settings-form-stack">
      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="drawer-app-color" className="form-field-label">
            {UI_COPY.APPS.DRAWER.THEME_COLOR_LABEL}
          </Label>
          <Input
            id="drawer-app-color"
            value={themeColor}
            onChange={(e) => onChangeThemeColor(e.target.value)}
            placeholder={UI_COPY.APPS.DRAWER.THEME_COLOR_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>

        <div className="form-field-group">
          <Label htmlFor="drawer-app-icon" className="form-field-label">
            {UI_COPY.APPS.DRAWER.ICON_URL_LABEL}
          </Label>
          <Input
            id="drawer-app-icon"
            value={iconUrl}
            onChange={(e) => onChangeIconUrl(e.target.value)}
            placeholder={UI_COPY.APPS.DRAWER.ICON_URL_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      <div className="form-field-group">
        <Label htmlFor="drawer-app-note" className="form-field-label">
          {UI_COPY.APPS.DRAWER.NOTE_LABEL}
        </Label>
        <Input
          id="drawer-app-note"
          value={maintenanceNote}
          onChange={(e) => onChangeMaintenanceNote(e.target.value)}
          placeholder={UI_COPY.APPS.DRAWER.NOTE_PLACEHOLDER}
          className="form-field-input"
        />
      </div>
    </div>
  );
};
