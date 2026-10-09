/**
 * @file apps/web/src/features/apps/components/register-wizard/register-app-modal.tsx
 * @description 3-step registration wizard orchestrator for onboarding new microservices into DevLab.
 * @module @devlab/portal-web/features/apps/components/register-wizard
 */

import React, { useState } from "react";
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../../lib/ui-copy/index";
import { AppEnvironment } from "../../../../lib/constants/enums";
import { WizardStepIdentity } from "./wizard-step-identity";
import { WizardStepSecurity } from "./wizard-step-security";
import { WizardStepCredentials } from "./wizard-step-credentials";
import type { RegisterWizardFormState, CreateAppPayload } from "../../types";

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

  if (!isOpen) {
    return null;
  }

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
        console.error("Failed to register app:", err);
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
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="border-border bg-card flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border p-6 shadow-2xl">
        {/* Header & Step progress indicator */}
        <div className="border-border flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">
                {UI_COPY.APPS.WIZARD.MODAL_TITLE}
              </h3>
              <p className="text-muted-foreground text-xs">
                {currentStep === 1 && UI_COPY.APPS.WIZARD.STEP_1_TITLE}
                {currentStep === 2 && UI_COPY.APPS.WIZARD.STEP_2_TITLE}
                {currentStep === 3 && UI_COPY.APPS.WIZARD.STEP_3_TITLE}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:bg-background hover:text-foreground rounded-lg p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step dots */}
        <div className="border-border/50 flex items-center justify-center gap-2 border-b py-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? "bg-primary w-8"
                  : currentStep > step
                    ? "w-4 bg-emerald-500"
                    : "bg-border w-4"
              }`}
            />
          ))}
        </div>

        {/* Form Body View */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          {currentStep === 1 && <WizardStepIdentity form={form} onChange={handleFieldChange} />}
          {currentStep === 2 && <WizardStepSecurity form={form} onChange={handleFieldChange} />}
          {currentStep === 3 && (
            <WizardStepCredentials appId={form.appId} clientSecret={generatedSecret} />
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="border-border mt-2 flex items-center justify-between border-t pt-4">
          {currentStep === 2 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="border-border h-9 text-xs"
            >
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
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
                  className="border-border h-9 text-xs"
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
                      <Check className="ml-1 h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      {UI_COPY.COMMON.ACTIONS.NEXT}
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
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
        </div>
      </div>
    </div>
  );
};
