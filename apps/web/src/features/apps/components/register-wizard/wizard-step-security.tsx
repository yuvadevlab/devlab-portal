/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-security.tsx
 * @description Step 2 of App Registration Wizard: OAuth2 redirect URIs, CORS origins, and scope grants.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step2
 */

import React from "react";
import { Textarea } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../../lib/ui-copy/index";
import { ApiKeyScope } from "../../../../lib/constants/enums";
import type { RegisterWizardFormState } from "../../types";

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
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
          {UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_URLS} *
        </label>
        <p className="text-[11px] text-[var(--muted-foreground)] mb-2">
          Authorized OIDC redirect targets for OAuth2 authorization code flows. One per line.
        </p>
        <Textarea
          rows={3}
          value={form.callbackUrls}
          onChange={(e) => onChange({ callbackUrls: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.CALLBACK_PLACEHOLDER}
          required
          className="bg-[var(--background)] border-[var(--border)] text-xs font-mono resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
          Ecosystem Permission Scopes
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {commonScopes.map((scope) => (
            <div
              key={scope.id}
              className="flex items-start gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] p-2.5"
            >
              <input
                type="checkbox"
                id={scope.id}
                defaultChecked={true}
                className="mt-0.5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <div>
                <label
                  htmlFor={scope.id}
                  className="text-xs font-mono font-medium text-[var(--foreground)] cursor-pointer"
                >
                  {scope.label}
                </label>
                <p className="text-[10px] text-[var(--muted-foreground)] leading-tight mt-0.5">
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
