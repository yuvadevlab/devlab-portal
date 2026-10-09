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
          <p className="text-xs leading-none font-semibold">Application Registered Successfully</p>
          <p className="mt-1 text-[11px] text-emerald-300/80">
            Client credentials have been generated and cryptographic hashes recorded.
          </p>
        </div>
      </div>

      {/* Client ID field */}
      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
          {UI_COPY.APPS.WIZARD.CREDENTIALS.CLIENT_ID}
        </label>
        <div className="border-border bg-background flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="text-foreground font-mono text-xs">{appId}</span>
          <CopyButton textToCopy={appId} />
        </div>
      </div>

      {/* Secret Reveal Card */}
      <div>
        <label className="text-foreground mb-1.5 block text-xs font-semibold">
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
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-[11px] leading-relaxed">
          {UI_COPY.APPS.WIZARD.CREDENTIALS.WARNING_COPY}
        </p>
      </div>
    </div>
  );
};
