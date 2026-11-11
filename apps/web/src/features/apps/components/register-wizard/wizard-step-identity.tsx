"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-identity.tsx
 * @description Step 1 of App Registration Wizard: Identity, names, environment, and base origins.
 * Fully built with @devlab-portal/ui Label, Input, Select, and Textarea components.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step1
 */

import React from "react";
import {
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
} from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppEnvironment } from "@/lib/constants";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepIdentityProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepIdentity: React.FC<WizardStepIdentityProps> = ({ form, onChange }) => {
  return (
    <div className="wizard-step-container">
      <div className="form-field-group">
        <Label htmlFor="app-name" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.NAME}
        </Label>
        <Input
          id="app-name"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.NAME_PLACEHOLDER}
          required
          className="form-field-input"
        />
      </div>

      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="app-id" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.APP_ID}
          </Label>
          <Input
            id="app-id"
            value={form.appId}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
              onChange({
                appId: val,
                slug: form.slug === form.appId || !form.slug ? val : form.slug,
              });
            }}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.APP_ID_PLACEHOLDER}
            required
            className="form-field-input-mono"
          />
        </div>

        <div className="form-field-group">
          <Label htmlFor="app-slug" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.URL_SLUG}
          </Label>
          <Input
            id="app-slug"
            value={form.slug}
            onChange={(e) =>
              onChange({
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
              })
            }
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.APP_ID_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      <div className="form-field-group">
        <Label htmlFor="app-env" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.ENVIRONMENT}
        </Label>
        <Select
          value={form.environment}
          onValueChange={(val) => onChange({ environment: val as AppEnvironment })}
        >
          <SelectTrigger id="app-env" className="form-field-select">
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
        <Label htmlFor="app-desc" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION}
        </Label>
        <Textarea
          id="app-desc"
          rows={3}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION_PLACEHOLDER}
          className="form-field-textarea"
        />
      </div>
    </div>
  );
};
