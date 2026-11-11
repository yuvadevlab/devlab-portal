"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-branding.tsx
 * @description Step 4 of App Registration Wizard: Branding (Theme Color & Icon) and Maintenance Banner.
 * Matches Drawer Branding & Maintenance section.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step4-branding
 */

import React from "react";
import { Input, Label } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepBrandingProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepBranding: React.FC<WizardStepBrandingProps> = ({ form, onChange }) => {
  return (
    <div className="wizard-step-container">
      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="app-theme-color" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.THEME_COLOR}
          </Label>
          <Input
            id="app-theme-color"
            value={form.themeColor}
            onChange={(e) => onChange({ themeColor: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.THEME_COLOR_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>

        <div className="form-field-group">
          <Label htmlFor="app-icon-url" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.ICON_URL}
          </Label>
          <Input
            id="app-icon-url"
            value={form.iconUrl}
            onChange={(e) => onChange({ iconUrl: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.ICON_URL_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      <div className="form-field-group">
        <Label htmlFor="app-maintenance-note" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.MAINTENANCE_NOTE}
        </Label>
        <Input
          id="app-maintenance-note"
          value={form.maintenanceNote}
          onChange={(e) => onChange({ maintenanceNote: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.MAINTENANCE_NOTE_PLACEHOLDER}
          className="form-field-input"
        />
        <p className="form-field-hint">
          Optional banner message displayed across DevLab Portal when service is offline or in
          maintenance.
        </p>
      </div>
    </div>
  );
};
