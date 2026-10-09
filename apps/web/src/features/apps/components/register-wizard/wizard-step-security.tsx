"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-security.tsx
 * @description Step 2 of App Registration Wizard: OAuth2 redirect URIs, CORS origins, and scope grants.
 * Fully built with @yuva-devlab/ui Label, Textarea, and Checkbox components.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step2
 */

import React from "react";
import { Label, Textarea, Checkbox } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { ApiKeyScope } from "@/lib/constants";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepSecurityProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepSecurity: React.FC<WizardStepSecurityProps> = ({ form, onChange }) => {
  const commonScopes = [
    {
      id: ApiKeyScope.ORCHESTRAI_READ,
      label: "orchestrai:read",
      desc: UI_COPY.APPS.WIZARD.SCOPES.ORCHESTRAI_READ_DESC,
    },
    {
      id: ApiKeyScope.ORCHESTRAI_EXECUTE,
      label: "orchestrai:executions:create",
      desc: UI_COPY.APPS.WIZARD.SCOPES.ORCHESTRAI_EXECUTE_DESC,
    },
    {
      id: ApiKeyScope.FINAI_READ,
      label: "finai:read",
      desc: UI_COPY.APPS.WIZARD.SCOPES.FINAI_READ_DESC,
    },
    {
      id: ApiKeyScope.LOGS_INGEST,
      label: "logs:ingest",
      desc: UI_COPY.APPS.WIZARD.SCOPES.LOGS_INGEST_DESC,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="callback-urls" className="text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_URLS} *
        </Label>
        <p className="text-muted-foreground text-[11px]">
          {UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_HELP}
        </p>
        <Textarea
          id="callback-urls"
          rows={3}
          value={form.callbackUrls}
          onChange={(e) => onChange({ callbackUrls: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_PLACEHOLDER}
          required
          className="resize-none font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">{UI_COPY.APPS.WIZARD.FIELDS.SCOPES_TITLE}</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {commonScopes.map((scope) => (
            <div
              key={scope.id}
              className="border-border bg-card flex items-start gap-2.5 rounded-lg border p-2.5"
            >
              <Checkbox id={scope.id} defaultChecked={true} className="mt-0.5" />
              <div>
                <Label
                  htmlFor={scope.id}
                  className="text-foreground cursor-pointer font-mono text-xs font-medium"
                >
                  {scope.label}
                </Label>
                <p className="text-muted-foreground mt-0.5 text-[10px] leading-tight">
                  {scope.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
