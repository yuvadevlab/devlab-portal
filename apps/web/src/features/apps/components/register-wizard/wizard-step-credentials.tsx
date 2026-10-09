/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-credentials.tsx
 * @description Step 3 of App Registration Wizard: Reveal generated Client ID and one-time secret.
 * Consumes @yuva-devlab/ui SecretRevealCard and CopyButton primitives.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step3
 */

import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { SecretRevealCard, CopyButton } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../../lib/ui-copy/index";

interface WizardStepCredentialsProps {
  appId: string;
  clientSecret: string;
}

export const WizardStepCredentials: React.FC<WizardStepCredentialsProps> = ({
  appId,
  clientSecret,
}) => {
  return (
    <div className="space-y-5">
      {/* Success banner */}
      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-400">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold text-xs leading-none">Application Registered Successfully</p>
          <p className="text-[11px] text-emerald-300/80 mt-1">
            Client credentials have been generated and cryptographic hashes recorded.
          </p>
        </div>
      </div>

      {/* Client ID field */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
          {UI_COPY.APPS.WIZARD.CREDENTIALS.CLIENT_ID}
        </label>
        <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2">
          <span className="font-mono text-xs text-[var(--foreground)]">{appId}</span>
          <CopyButton textToCopy={appId} />
        </div>
      </div>

      {/* Secret Reveal Card */}
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
          {UI_COPY.APPS.WIZARD.CREDENTIALS.CLIENT_SECRET}
        </label>
        <SecretRevealCard
          secret={clientSecret}
          warningMessage={UI_COPY.APPS.WIZARD.CREDENTIALS.WARNING_COPY}
          copyLabel={UI_COPY.COMMON.ACTIONS.COPY}
        />
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {UI_COPY.APPS.WIZARD.CREDENTIALS.WARNING_COPY}
        </p>
      </div>
    </div>
  );
};
