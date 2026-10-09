"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/register-app-modal.tsx
 * @description 3-step registration wizard orchestrator for onboarding new microservices into DevLab.
 * Fully built with @yuva-devlab/ui Dialog and Button components.
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
} from "@yuva-devlab/ui";
import { logger } from "@/lib/logger";
import { UI_COPY } from "@/lib/ui-copy";
import { AppEnvironment } from "@/lib/constants";
import { WizardStepIdentity } from "./wizard-step-identity";
import { WizardStepSecurity } from "./wizard-step-security";
import { WizardStepCredentials } from "./wizard-step-credentials";
import type { RegisterWizardFormState, CreateAppPayload } from "@/features/apps/types";

interface RegisterAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAppPayload) => Promise<{ clientSecret: string }>;
  onSuccess: () => void;
}

export const RegisterAppModal: React.FC<RegisterAppModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSecret, setGeneratedSecret] = useState<string>("");

  const [form, setForm] = useState<RegisterWizardFormState>({
    name: "",
    appId: "",
    slug: "",
    description: "",
    environment: AppEnvironment.LOCAL_DEV,
    originUrl: "",
    healthUrl: "",
    callbackUrls: "",
  });

  const handleFieldChange = (fields: Partial<RegisterWizardFormState>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = async () => {
    // Transition from step 1 to step 2 after basic input validation
    if (currentStep === 1) {
      if (!form.name || !form.appId || !form.originUrl) {
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Submit payload to create app and advance to step 3 reveal
    if (currentStep === 2) {
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
        });

        setGeneratedSecret(result.clientSecret);
        setCurrentStep(3);
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
    setForm({
      name: "",
      appId: "",
      slug: "",
      description: "",
      environment: AppEnvironment.LOCAL_DEV,
      originUrl: "",
      healthUrl: "",
      callbackUrls: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                {UI_COPY.APPS.WIZARD.MODAL_TITLE}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                {currentStep === 1 && UI_COPY.APPS.WIZARD.STEP_1_TITLE}
                {currentStep === 2 && UI_COPY.APPS.WIZARD.STEP_2_TITLE}
                {currentStep === 3 && UI_COPY.APPS.WIZARD.STEP_3_TITLE}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step dots */}
        <div className="border-border/50 flex items-center justify-center gap-2 border-b py-2.5">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? "bg-primary w-8"
                  : currentStep > step
                    ? "bg-success w-4"
                    : "bg-border w-4"
              }`}
            />
          ))}
        </div>

        {/* Form Body View */}
        <DialogBody className="py-4">
          {currentStep === 1 && <WizardStepIdentity form={form} onChange={handleFieldChange} />}
          {currentStep === 2 && <WizardStepSecurity form={form} onChange={handleFieldChange} />}
          {currentStep === 3 && (
            <WizardStepCredentials appId={form.appId} clientSecret={generatedSecret} />
          )}
        </DialogBody>

        {/* Wizard Footer Navigation */}
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {currentStep === 2 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="h-9 text-xs"
            >
              <ArrowLeft className="mr-1 size-3.5" />
              {UI_COPY.COMMON.ACTIONS.BACK}
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {currentStep < 3 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="h-9 text-xs"
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
                  className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
                >
                  {isSubmitting ? (
                    "Registering..."
                  ) : currentStep === 2 ? (
                    <>
                      {UI_COPY.COMMON.ACTIONS.REGISTER}
                      <Check className="ml-1 size-3.5" />
                    </>
                  ) : (
                    <>
                      {UI_COPY.COMMON.ACTIONS.NEXT}
                      <ArrowRight className="ml-1 size-3.5" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleClose}
                className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
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
