"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-network.tsx
 * @description Step 3 of App Registration Wizard: Networking, APIs, Health Probes, and OAuth Callbacks.
 * Matches Drawer Networking and Callbacks sections.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step3-network
 */

import React from "react";
import { Input, Label, Textarea } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepNetworkProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepNetwork: React.FC<WizardStepNetworkProps> = ({ form, onChange }) => {
  return (
    <div className="wizard-step-container">
      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="app-origin" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.ORIGIN_URL}
          </Label>
          <Input
            id="app-origin"
            type="url"
            value={form.originUrl}
            onChange={(e) => onChange({ originUrl: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.ORIGIN_PLACEHOLDER}
            required
            className="form-field-input-mono"
          />
        </div>

        <div className="form-field-group">
          <Label htmlFor="app-api" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.API_URL}
          </Label>
          <Input
            id="app-api"
            type="url"
            value={form.apiUrl}
            onChange={(e) => onChange({ apiUrl: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.API_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      <div className="form-field-group">
        <Label htmlFor="app-health" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.HEALTH_URL}
        </Label>
        <Input
          id="app-health"
          type="url"
          value={form.healthUrl}
          onChange={(e) => onChange({ healthUrl: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.HEALTH_PLACEHOLDER}
          className="form-field-input-mono"
        />
      </div>

      <div className="form-field-group">
        <Label htmlFor="callback-urls" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_URLS}
        </Label>
        <Textarea
          id="callback-urls"
          rows={3}
          value={form.callbackUrls}
          onChange={(e) => onChange({ callbackUrls: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_PLACEHOLDER}
          className="form-field-textarea-mono"
        />
        <p className="form-field-hint">{UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_HELP}</p>
      </div>
    </div>
  );
};
