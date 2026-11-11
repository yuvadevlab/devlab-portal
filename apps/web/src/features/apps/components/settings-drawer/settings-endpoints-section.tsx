"use client";

/**
 * @file apps/web/src/features/apps/components/settings-drawer/settings-endpoints-section.tsx
 * @description Networking endpoints configuration: Origin URL, API URL, and Health Check URL.
 * @module @devlab/portal-web/features/apps/components/settings-drawer
 */

import React from "react";
import { Input, Label } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface SettingsEndpointsSectionProps {
  originUrl: string;
  apiUrl: string;
  healthUrl: string;
  onChangeOriginUrl: (val: string) => void;
  onChangeApiUrl: (val: string) => void;
  onChangeHealthUrl: (val: string) => void;
}

export const SettingsEndpointsSection: React.FC<SettingsEndpointsSectionProps> = ({
  originUrl,
  apiUrl,
  healthUrl,
  onChangeOriginUrl,
  onChangeApiUrl,
  onChangeHealthUrl,
}) => {
  return (
    <div className="settings-form-stack">
      <div className="form-field-group">
        <Label htmlFor="drawer-app-origin" className="form-field-label">
          {UI_COPY.APPS.DRAWER.ORIGIN_LABEL}
        </Label>
        <Input
          id="drawer-app-origin"
          type="url"
          value={originUrl}
          onChange={(e) => onChangeOriginUrl(e.target.value)}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.ORIGIN_PLACEHOLDER}
          required
          className="form-field-input-mono"
        />
      </div>

      <div className="form-field-group">
        <Label htmlFor="drawer-app-api" className="form-field-label">
          {UI_COPY.APPS.DRAWER.API_LABEL}
        </Label>
        <Input
          id="drawer-app-api"
          type="url"
          value={apiUrl}
          onChange={(e) => onChangeApiUrl(e.target.value)}
          placeholder={UI_COPY.APPS.DRAWER.API_PLACEHOLDER}
          className="form-field-input-mono"
        />
      </div>

      <div className="form-field-group">
        <Label htmlFor="drawer-app-health" className="form-field-label">
          {UI_COPY.APPS.DRAWER.HEALTH_LABEL}
        </Label>
        <Input
          id="drawer-app-health"
          type="url"
          value={healthUrl}
          onChange={(e) => onChangeHealthUrl(e.target.value)}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.HEALTH_PLACEHOLDER}
          required
          className="form-field-input-mono"
        />
      </div>
    </div>
  );
};
