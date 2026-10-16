"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-identity.tsx
 * @description Step 1 of App Registration Wizard: Identity, names, environment, and base origins.
 * Fully built with @yuva-devlab/ui Label, Input, Select, and Textarea components.
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
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AppEnvironment } from "@/lib/constants";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepIdentityProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepIdentity: React.FC<WizardStepIdentityProps> = ({ form, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="app-name" className="text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.FIELDS.NAME}
        </Label>
        <Input
          id="app-name"
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
          className="h-9 text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="app-id" className="text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.APP_ID}
          </Label>
          <Input
            id="app-id"
            value={form.appId}
            onChange={(e) =>
              onChange({
                appId: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
              })
            }
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.APP_ID_PLACEHOLDER}
            required
            className="h-9 font-mono text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="app-env" className="text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.ENVIRONMENT}
          </Label>
          <Select
            value={form.environment}
            onValueChange={(val) => onChange({ environment: val as AppEnvironment })}
          >
            <SelectTrigger id="app-env" className="h-9 w-full text-xs">
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
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="app-desc" className="text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION}
        </Label>
        <Textarea
          id="app-desc"
          rows={2}
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.DESCRIPTION_PLACEHOLDER}
          className="resize-none text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="app-origin" className="text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.ORIGIN_URL}
          </Label>
          <Input
            id="app-origin"
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
            className="h-9 font-mono text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="app-health" className="text-xs font-semibold">
            {UI_COPY.APPS.WIZARD.FIELDS.HEALTH_URL}
          </Label>
          <Input
            id="app-health"
            value={form.healthUrl}
            onChange={(e) => onChange({ healthUrl: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.HEALTH_PLACEHOLDER}
            required
            className="h-9 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};
