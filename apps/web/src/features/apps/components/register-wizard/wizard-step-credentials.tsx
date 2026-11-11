"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-credentials.tsx
 * @description Step 3 of App Registration Wizard: Reveal generated Client ID and one-time secret.
 * Fully built with @devlab-portal/ui SecretRevealCard, Label, and CopyButton primitives.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step3
 */

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { SecretRevealCard, CopyButton, Label } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface WizardStepCredentialsProps {
  appId: string;
  clientSecret: string;
}

export const WizardStepCredentials: React.FC<WizardStepCredentialsProps> = ({
  appId,
  clientSecret,
}) => {
  return (
    <div className="wizard-step-container">
      {/* Success banner */}
      <div className="credentials-success-banner">
        <CheckCircle2 className="banner-icon-success" />
        <div>
          <p className="banner-title">{UI_COPY.APPS.WIZARD.CREDENTIALS.SUCCESS_TITLE}</p>
          <p className="banner-subtitle">{UI_COPY.APPS.WIZARD.CREDENTIALS.SUCCESS_SUBTITLE}</p>
        </div>
      </div>

      {/* Client ID field */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.APPS.WIZARD.CREDENTIALS.CLIENT_ID}</Label>
        <div className="credentials-id-box">
          <span className="credentials-id-text">{appId}</span>
          <CopyButton textToCopy={appId} />
        </div>
      </div>

      {/* Secret Reveal Card */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.APPS.WIZARD.CREDENTIALS.CLIENT_SECRET}</Label>
        <SecretRevealCard
          secret={clientSecret}
          warningMessage={UI_COPY.APPS.WIZARD.CREDENTIALS.WARNING_COPY}
          copyLabel={UI_COPY.COMMON.ACTIONS.COPY}
        />
      </div>
    </div>
  );
};
