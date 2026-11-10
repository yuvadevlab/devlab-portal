"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-security.tsx
 * @description Step 2 of App Registration Wizard: OAuth2 redirect URIs, CORS origins, and scope grants.
 * Fully built with @devlab-portal/ui Label, Textarea, and Checkbox components.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step2
 */

import React from "react";
import { Label, Textarea, Checkbox } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { ApiKeyScope, buildScope } from "@/lib/constants";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepSecurityProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepSecurity: React.FC<WizardStepSecurityProps> = ({ form, onChange }) => {
  const appSlug = form.slug || form.appId || "app";

  const commonScopes = [
    {
      id: buildScope(appSlug, ApiKeyScope.READ),
      label: `${appSlug}:read`,
      desc: UI_COPY.APPS.WIZARD.SCOPES.READ_DESC,
    },
    {
      id: buildScope(appSlug, ApiKeyScope.WRITE),
      label: `${appSlug}:write`,
      desc: UI_COPY.APPS.WIZARD.SCOPES.WRITE_DESC,
    },
    {
      id: buildScope(appSlug, ApiKeyScope.EXECUTE),
      label: `${appSlug}:executions:create`,
      desc: UI_COPY.APPS.WIZARD.SCOPES.EXECUTE_DESC,
    },
    {
      id: buildScope(appSlug, ApiKeyScope.EVENTS),
      label: `${appSlug}:events:publish`,
      desc: UI_COPY.APPS.WIZARD.SCOPES.EVENTS_DESC,
    },
  ];

  return (
    <div className="wizard-step-container">
      <div className="form-field-group">
        <Label htmlFor="callback-urls" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_URLS}
        </Label>
        <p className="form-field-hint">{UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_HELP}</p>
        <Textarea
          id="callback-urls"
          rows={3}
          value={form.callbackUrls}
          onChange={(e) => onChange({ callbackUrls: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_PLACEHOLDER}
          required
          className="form-field-textarea-mono"
        />
      </div>

      <div className="scope-selector-group">
        <Label className="form-field-label">{UI_COPY.APPS.WIZARD.FIELDS.SCOPES_TITLE}</Label>
        <div className="scope-grid">
          {commonScopes.map((scope) => (
            <div key={scope.id} className="scope-card">
              <Checkbox id={scope.id} defaultChecked={true} className="scope-checkbox" />
              <div>
                <Label htmlFor={scope.id} className="scope-label">
                  {scope.label}
                </Label>
                <p className="scope-desc">{scope.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
