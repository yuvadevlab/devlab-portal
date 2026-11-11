"use client";

/**
 * @file apps/web/src/features/apps/components/settings-drawer/settings-identity-section.tsx
 * @description Identity, ID, environment, and descriptive configuration for application settings.
 * @module @devlab/portal-web/features/apps/components/settings-drawer
 */

import React from "react";
import {
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppEnvironment } from "@/lib/constants";

interface SettingsIdentitySectionProps {
  name: string;
  appId: string;
  slug: string;
  environment: string;
  description: string;
  onChangeName: (val: string) => void;
  onChangeAppId: (val: string) => void;
  onChangeSlug: (val: string) => void;
  onChangeEnvironment: (val: string) => void;
  onChangeDescription: (val: string) => void;
}

export const SettingsIdentitySection: React.FC<SettingsIdentitySectionProps> = ({
  name,
  appId,
  slug,
  environment,
  description,
  onChangeName,
  onChangeAppId,
  onChangeSlug,
  onChangeEnvironment,
  onChangeDescription,
}) => {
  return (
    <div className="settings-form-stack">
      <div className="form-field-group">
        <Label htmlFor="drawer-app-name" className="form-field-label">
          {UI_COPY.APPS.DRAWER.NAME_LABEL}
        </Label>
        <Input
          id="drawer-app-name"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.NAME_PLACEHOLDER}
          required
          className="form-field-input"
        />
      </div>

      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="drawer-app-id" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.APP_ID}
          </Label>
          <Input
            id="drawer-app-id"
            value={appId}
            onChange={(e) =>
              onChangeAppId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"))
            }
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.APP_ID_PLACEHOLDER}
            required
            className="form-field-input-mono"
          />
        </div>

        <div className="form-field-group">
          <Label htmlFor="drawer-app-slug" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.URL_SLUG}
          </Label>
          <Input
            id="drawer-app-slug"
            value={slug}
            onChange={(e) =>
              onChangeSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"))
            }
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.APP_ID_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      <div className="form-field-group">
        <Label htmlFor="drawer-app-env" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.ENVIRONMENT}
        </Label>
        <Select value={environment} onValueChange={onChangeEnvironment}>
          <SelectTrigger id="drawer-app-env" className="form-field-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AppEnvironment.LOCAL_DEV}>
              {UI_COPY.COMMON.ENVIRONMENTS.LOCAL_DEV}
            </SelectItem>
            <SelectItem value={AppEnvironment.STAGING}>
              {UI_COPY.COMMON.ENVIRONMENTS.STAGING}
            </SelectItem>
            <SelectItem value={AppEnvironment.PRODUCTION}>
              {UI_COPY.COMMON.ENVIRONMENTS.PRODUCTION}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="form-field-group">
        <Label htmlFor="drawer-app-desc" className="form-field-label">
          {UI_COPY.APPS.DRAWER.DESC_LABEL}
        </Label>
        <Textarea
          id="drawer-app-desc"
          rows={3}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION_PLACEHOLDER}
          className="form-field-textarea"
        />
      </div>
    </div>
  );
};
