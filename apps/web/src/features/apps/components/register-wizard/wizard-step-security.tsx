"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-security.tsx
 * @description Step 2 of App Registration Wizard: OAuth2 redirect URIs, CORS origins, and scope grants.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step2
 */

import React from "react";
import { Textarea } from "@yuva-devlab/ui";
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
      desc: "Read-only access to agents and executions",
    },
    {
      id: ApiKeyScope.ORCHESTRAI_EXECUTE,
      label: "orchestrai:executions:create",
      desc: "Trigger autonomous swarm runs",
    },
    {
      id: ApiKeyScope.FINAI_READ,
      label: "finai:read",
      desc: "Read financial analytics and agent advice",
    },
    {
      id: ApiKeyScope.LOGS_INGEST,
      label: "logs:ingest",
      desc: "Direct telemetry and audit log ingestion",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_URLS} *
        </label>
        <p className="text-muted-foreground mb-2 text-[11px]">
          Authorized OIDC redirect targets for OAuth2 authorization code flows. One per line.
        </p>
        <Textarea
          rows={3}
          value={form.callbackUrls}
          onChange={(e) => onChange({ callbackUrls: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_PLACEHOLDER}
          required
          className="bg-background border-border resize-none font-mono text-xs"
        />
      </div>

      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
          Ecosystem Permission Scopes
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {commonScopes.map((scope) => (
            <div
              key={scope.id}
              className="border-border bg-background flex items-start gap-2.5 rounded-lg border p-2.5"
            >
              <input
                type="checkbox"
                id={scope.id}
                defaultChecked={true}
                className="border-border text-primary focus:ring-primary mt-0.5 rounded"
              />
              <div>
                <label
                  htmlFor={scope.id}
                  className="text-foreground cursor-pointer font-mono text-xs font-medium"
                >
                  {scope.label}
                </label>
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
