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
import { WizardStepSecurity } from "./wizard-step-security";
import { WizardStepCredentials } from "./wizard-step-credentials";
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
  healthUrl: "",
  callbackUrls: "",
  workingDir: "",
  devCommand: "",
  buildCommand: "",
  startCommand: "",
  dependsOn: [],
};

export const RegisterAppModal: React.FC<RegisterAppModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState<string>("");
  const [form, setForm] = useState<RegisterWizardFormState>(INITIAL_FORM);

  const handleFieldChange = (fields: Partial<RegisterWizardFormState>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!form.name || !form.appId || !form.originUrl) return;
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setIsSubmitting(true);
      try {
        const callbacks = form.callbackUrls
          .split(/\r?\n|,/)
          .map((u) => u.trim())
          .filter(Boolean);

        const result = await onSubmit({
          name: form.name,
          appId: form.appId,
          slug: form.slug || form.appId,
          description: form.description || undefined,
          originUrl: form.originUrl,
          healthUrl: form.healthUrl || undefined,
          callbackUrls: callbacks.length > 0 ? callbacks : [form.originUrl],
          environment: form.environment,
          workingDir: form.workingDir || undefined,
          devCommand: form.devCommand || undefined,
          buildCommand: form.buildCommand || undefined,
          startCommand: form.startCommand || undefined,
          dependsOn: form.dependsOn && form.dependsOn.length > 0 ? form.dependsOn : undefined,
        });

        setGeneratedSecret(result.clientSecret);
        setCurrentStep(4);
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
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="wizard-dots-row">
          {[1, 2, 3, 4].map((step) => (
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
          {currentStep === 3 && <WizardStepSecurity form={form} onChange={handleFieldChange} />}
          {currentStep === 4 && (
            <WizardStepCredentials appId={form.appId} clientSecret={generatedSecret} />
          )}
        </DialogBody>

        <DialogFooter className="wizard-dialog-footer">
          {currentStep > 1 && currentStep < 4 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((s) => (s - 1) as 1 | 2 | 3)}
              className="wizard-nav-btn"
            >
              <ArrowLeft className="button-icon-prefix" />
              {UI_COPY.COMMON.ACTIONS.BACK}
            </Button>
          ) : (
            <div />
          )}

          <div className="wizard-footer-actions">
            {currentStep < 4 ? (
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
                  disabled={
                    isSubmitting ||
                    (currentStep === 1 && (!form.name || !form.appId || !form.originUrl))
                  }
                  className="wizard-nav-btn wizard-nav-primary"
                >
                  {isSubmitting ? (
                    UI_COPY.COMMON.ACTIONS.REGISTERING
                  ) : currentStep === 3 ? (
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
