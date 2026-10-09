/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-identity.tsx
 * @description Step 1 of App Registration Wizard: Identity, names, environment, and base origins.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step1
 */

import React from "react";
import { Input, Textarea } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../../lib/ui-copy/index";
import { AppEnvironment } from "../../../../lib/constants/enums";
import type { RegisterWizardFormState } from "../../types";

interface WizardStepIdentityProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepIdentity: React.FC<WizardStepIdentityProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.FIELDS.NAME} *
        </label>
        <Input
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            // Auto-generate slug/appId from name if appId was unchanged
            const autoId = name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
            onChange({
              name,
              appId: form.appId ? form.appId : autoId,
              slug: form.slug ? form.slug : autoId,
            });
          }}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.NAME_PLACEHOLDER}
          required
          className="bg-background border-border h-9 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.APP_ID} *
          </label>
          <Input
            value={form.appId}
            onChange={(e) =>
              onChange({
                appId: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
              })
            }
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.APP_ID_PLACEHOLDER}
            required
            className="bg-background border-border h-9 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.ENVIRONMENT}
          </label>
          <select
            value={form.environment}
            onChange={(e) => onChange({ environment: e.target.value as AppEnvironment })}
            className="border-border bg-background text-foreground focus:ring-primary h-9 w-full rounded-md border px-3 py-1.5 text-xs focus:ring-1"
          >
            <option value={AppEnvironment.LOCAL_DEV}>
              {UI_COPY.COMMON.ENVIRONMENTS.LOCAL_DEV}
            </option>
            <option value={AppEnvironment.STAGING}>{UI_COPY.COMMON.ENVIRONMENTS.STAGING}</option>
            <option value={AppEnvironment.PRODUCTION}>
              {UI_COPY.COMMON.ENVIRONMENTS.PRODUCTION}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-foreground mb-1 block text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION}
        </label>
        <Textarea
          rows={2}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION_PLACEHOLDER}
          className="bg-background border-border resize-none text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.ORIGIN_URL} *
          </label>
          <Input
            value={form.originUrl}
            onChange={(e) => {
              const origin = e.target.value;
              onChange({
                originUrl: origin,
                healthUrl: form.healthUrl ? form.healthUrl : `${origin}/api/health`,
                callbackUrls: form.callbackUrls ? form.callbackUrls : `${origin}/api/auth/callback`,
              });
            }}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.ORIGIN_PLACEHOLDER}
            required
            className="bg-background border-border h-9 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-foreground mb-1 block text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.HEALTH_URL} *
          </label>
          <Input
            value={form.healthUrl}
            onChange={(e) => onChange({ healthUrl: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.HEALTH_PLACEHOLDER}
            required
            className="bg-background border-border h-9 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};
