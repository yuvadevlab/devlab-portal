/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-payload.helper.ts
 * @description Helper functions to map RegisterWizardFormState to CreateAppPayload.
 * @module @devlab/portal-web/features/apps/components/register-wizard
 */

import type { RegisterWizardFormState, CreateAppPayload } from "@/features/apps/types";

/**
 * Transforms the registration wizard form state into the API creation payload.
 *
 * @param form - Wizard form state
 * @returns Cleaned and trimmed CreateAppPayload
 */
export function buildCreateAppPayload(form: RegisterWizardFormState): CreateAppPayload {
  const callbacks = form.callbackUrls
    .split(/\r?\n|,/)
    .map((u) => u.trim())
    .filter(Boolean);

  return {
    name: form.name.trim(),
    appId: form.appId.trim(),
    slug: form.slug.trim() || form.appId.trim(),
    description: form.description.trim() || undefined,
    originUrl: form.originUrl.trim(),
    apiUrl: form.apiUrl.trim() || undefined,
    healthUrl: form.healthUrl.trim() || undefined,
    callbackUrls: callbacks.length > 0 ? callbacks : [form.originUrl.trim()],
    environment: form.environment,
    themeColor: form.themeColor.trim() || undefined,
    iconUrl: form.iconUrl.trim() || undefined,
    maintenanceNote: form.maintenanceNote.trim() || undefined,
    workingDir: form.workingDir?.trim() || undefined,
    devCommand: form.devCommand?.trim() || undefined,
    buildCommand: form.buildCommand?.trim() || undefined,
    startCommand: form.startCommand?.trim() || undefined,
    dependsOn: form.dependsOn && form.dependsOn.length > 0 ? form.dependsOn : undefined,
  };
}
