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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header & Step progress indicator */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                {UI_COPY.APPS.WIZARD.MODAL_TITLE}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {currentStep === 1 && UI_COPY.APPS.WIZARD.STEP_1_TITLE}
                {currentStep === 2 && UI_COPY.APPS.WIZARD.STEP_2_TITLE}
                {currentStep === 3 && UI_COPY.APPS.WIZARD.STEP_3_TITLE}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 py-3 border-b border-[var(--border)]/50">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? "w-8 bg-[var(--primary)]"
                  : currentStep > step
                    ? "w-4 bg-emerald-500"
                    : "w-4 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        {/* Form Body View */}
        <div className="py-4 overflow-y-auto flex-1 pr-1">
          {currentStep === 1 && <WizardStepIdentity form={form} onChange={handleFieldChange} />}
          {currentStep === 2 && <WizardStepSecurity form={form} onChange={handleFieldChange} />}
          {currentStep === 3 && (
            <WizardStepCredentials appId={form.appId} clientSecret={generatedSecret} />
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-2">
          {currentStep === 2 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="text-xs h-9 border-[var(--border)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
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
                  className="text-xs h-9 border-[var(--border)]"
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
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs h-9 font-medium"
                >
                  {isSubmitting ? (
                    "Registering..."
                  ) : currentStep === 2 ? (
                    <>
                      {UI_COPY.COMMON.ACTIONS.REGISTER}
                      <Check className="h-3.5 w-3.5 ml-1" />
                    </>
                  ) : (
                    <>
                      {UI_COPY.COMMON.ACTIONS.NEXT}
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleClose}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs h-9 font-medium"
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
