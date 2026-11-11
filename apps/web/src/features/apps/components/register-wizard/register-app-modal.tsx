"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/register-app-modal.tsx
 * @description 4-step registration wizard orchestrator for onboarding new microservices into DevLab.
 * Fully built with @devlab-portal/ui Dialog and Button components.
 * @module @devlab/portal-web/features/apps/components/register-wizard
 */

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@devlab-portal/ui";
import { logger } from "@/lib/logger";
import { UI_COPY } from "@/lib/ui-copy";
import { AppEnvironment } from "@/lib/constants";
import { WizardStepIdentity } from "./wizard-step-identity";
import { WizardStepRuntime } from "./wizard-step-runtime";
import { WizardStepNetwork } from "./wizard-step-network";
import { WizardStepBranding } from "./wizard-step-branding";
import { WizardStepCredentials } from "./wizard-step-credentials";
import { buildCreateAppPayload } from "./wizard-payload.helper";
import type { RegisterWizardFormState, CreateAppPayload } from "@/features/apps/types";

interface RegisterAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAppPayload) => Promise<{ clientSecret: string }>;
  onSuccess: () => void;
}

const INITIAL_FORM: RegisterWizardFormState = {
  name: "",
  appId: "",
  slug: "",
  description: "",
  environment: AppEnvironment.LOCAL_DEV,
  originUrl: "",
  apiUrl: "",
  healthUrl: "",
  callbackUrls: "",
  themeColor: "",
  iconUrl: "",
  maintenanceNote: "",
  workingDir: "",
  devCommand: "",
  buildCommand: "",
  startCommand: "",
  dependsOn: ["devlab-portal"],
};

export const RegisterAppModal: React.FC<RegisterAppModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState<string>("");
  const [form, setForm] = useState<RegisterWizardFormState>(INITIAL_FORM);

  const handleFieldChange = (fields: Partial<RegisterWizardFormState>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!form.name.trim() || !form.appId.trim()) return;
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      if (!form.originUrl.trim()) return;
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      setIsSubmitting(true);
      try {
        const payload = buildCreateAppPayload(form);
        const result = await onSubmit(payload);
        setGeneratedSecret(result.clientSecret);
        setCurrentStep(5);
        onSuccess();
      } catch (err) {
        logger.error("Failed to register app:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setGeneratedSecret("");
    setForm(INITIAL_FORM);
    onClose();
  };

  const isNextDisabled =
    isSubmitting ||
    (currentStep === 1 && (!form.name.trim() || !form.appId.trim())) ||
    (currentStep === 3 && !form.originUrl.trim());

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="xl">
        <DialogHeader>
          <div className="wizard-header-group">
            <div className="wizard-header-icon-box">
              <Sparkles className="wizard-header-icon" />
            </div>
            <div>
              <DialogTitle className="wizard-modal-title">
                {UI_COPY.APPS.WIZARD.MODAL_TITLE}
              </DialogTitle>
              <DialogDescription className="wizard-modal-desc">
                {currentStep === 1 && UI_COPY.APPS.WIZARD.STEP_1_TITLE}
                {currentStep === 2 && UI_COPY.APPS.WIZARD.STEP_2_TITLE}
                {currentStep === 3 && UI_COPY.APPS.WIZARD.STEP_3_TITLE}
                {currentStep === 4 && UI_COPY.APPS.WIZARD.STEP_4_TITLE}
                {currentStep === 5 && UI_COPY.APPS.WIZARD.STEP_5_TITLE}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="wizard-dots-row">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`wizard-dot ${
                currentStep === step ? "active" : currentStep > step ? "completed" : "pending"
              }`}
            />
          ))}
        </div>

        <DialogBody className="wizard-dialog-body">
          {currentStep === 1 && <WizardStepIdentity form={form} onChange={handleFieldChange} />}
          {currentStep === 2 && <WizardStepRuntime form={form} onChange={handleFieldChange} />}
          {currentStep === 3 && <WizardStepNetwork form={form} onChange={handleFieldChange} />}
          {currentStep === 4 && <WizardStepBranding form={form} onChange={handleFieldChange} />}
          {currentStep === 5 && (
            <WizardStepCredentials appId={form.appId} clientSecret={generatedSecret} />
          )}
        </DialogBody>

        <DialogFooter className="wizard-dialog-footer">
          {currentStep > 1 && currentStep < 5 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              className="wizard-nav-btn"
            >
              <ArrowLeft className="button-icon-prefix" />
              {UI_COPY.COMMON.ACTIONS.BACK}
            </Button>
          ) : (
            <div />
          )}

          <div className="wizard-footer-actions">
            {currentStep < 5 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="wizard-nav-btn"
                >
                  {UI_COPY.COMMON.ACTIONS.CANCEL}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className="wizard-nav-btn wizard-nav-primary"
                >
                  {isSubmitting ? (
                    UI_COPY.COMMON.ACTIONS.REGISTERING
                  ) : currentStep === 4 ? (
                    <>
                      {UI_COPY.COMMON.ACTIONS.REGISTER}
                      <Check className="button-icon-suffix" />
                    </>
                  ) : (
                    <>
                      {UI_COPY.COMMON.ACTIONS.NEXT}
                      <ArrowRight className="button-icon-suffix" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleClose}
                className="wizard-nav-btn wizard-nav-primary"
              >
                {UI_COPY.COMMON.ACTIONS.FINISH}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
