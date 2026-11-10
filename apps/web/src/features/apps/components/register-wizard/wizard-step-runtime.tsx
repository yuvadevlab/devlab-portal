"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-runtime.tsx
 * @description Step 2 of App Registration Wizard: Polyglot working directory and execution commands.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step2-runtime
 */

import React, { useState, useEffect } from "react";
import { Input, Label, Button } from "@devlab-portal/ui";
import { CheckCircle2, AlertCircle, FolderCheck, FolderX } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import { STACK_PRESETS, type StackPreset } from "../../constants/stack-presets";
import { useValidatePathMutation } from "../../api/supervisor";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepRuntimeProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepRuntime: React.FC<WizardStepRuntimeProps> = ({ form, onChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const validateMutation = useValidatePathMutation();

  const handleApplyPreset = (preset: StackPreset) => {
    setSelectedPreset(preset.id);
    onChange({
      devCommand: preset.devCommand,
      buildCommand: preset.buildCommand,
      startCommand: preset.startCommand,
    });
  };

  const handleBlurWorkingDir = () => {
    if (form.workingDir?.trim()) {
      validateMutation.mutate({ path: form.workingDir.trim() });
    }
  };

  useEffect(() => {
    if (form.workingDir?.trim()) {
      validateMutation.mutate({ path: form.workingDir.trim() });
    }
  }, []);

  const handleDependsOnToggle = (depAppId: string) => {
    const current = form.dependsOn || [];
    if (current.includes(depAppId)) {
      onChange({ dependsOn: current.filter((id) => id !== depAppId) });
    } else {
      onChange({ dependsOn: [...current, depAppId] });
    }
  };

  return (
    <div className="wizard-step-container">
      {/* Stack Preset Selection */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.APPS.WIZARD.FIELDS.STACK_PRESET}</Label>
        <div className="runtime-preset-row">
          {STACK_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant={selectedPreset === preset.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleApplyPreset(preset)}
              className="runtime-preset-btn"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Host Working Directory */}
      <div className="form-field-group">
        <div className="runtime-label-with-status">
          <Label htmlFor="app-working-dir" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.WORKING_DIR}
          </Label>
          {validateMutation.data && (
            <span
              className={`runtime-path-badge ${
                validateMutation.data.exists && validateMutation.data.isDirectory
                  ? "valid"
                  : "invalid"
              }`}
            >
              {validateMutation.data.exists && validateMutation.data.isDirectory ? (
                <>
                  <FolderCheck className="badge-icon" /> Valid directory
                </>
              ) : (
                <>
                  <FolderX className="badge-icon" /> Path not found
                </>
              )}
            </span>
          )}
        </div>
        <Input
          id="app-working-dir"
          value={form.workingDir || ""}
          onChange={(e) => onChange({ workingDir: e.target.value })}
          onBlur={handleBlurWorkingDir}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.WORKING_DIR_PLACEHOLDER}
          className="form-field-input-mono"
        />
        <p className="form-field-hint">
          Absolute path or home relative path (~/...) to repository root on the host machine.
        </p>
      </div>

      {/* Dev & Start Commands */}
      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="app-dev-cmd" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.DEV_CMD}
          </Label>
          <Input
            id="app-dev-cmd"
            value={form.devCommand || ""}
            onChange={(e) => onChange({ devCommand: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.DEV_CMD_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>

        <div className="form-field-group">
          <Label htmlFor="app-start-cmd" className="form-field-label">
            {UI_COPY.APPS.WIZARD.FIELDS.START_CMD}
          </Label>
          <Input
            id="app-start-cmd"
            value={form.startCommand || ""}
            onChange={(e) => onChange({ startCommand: e.target.value })}
            placeholder={UI_COPY.APPS.WIZARD.FIELDS.START_CMD_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      {/* Build Command */}
      <div className="form-field-group">
        <Label htmlFor="app-build-cmd" className="form-field-label">
          {UI_COPY.APPS.WIZARD.FIELDS.BUILD_CMD}
        </Label>
        <Input
          id="app-build-cmd"
          value={form.buildCommand || ""}
          onChange={(e) => onChange({ buildCommand: e.target.value })}
          placeholder={UI_COPY.APPS.WIZARD.FIELDS.BUILD_CMD_PLACEHOLDER}
          className="form-field-input-mono"
        />
      </div>

      {/* Prerequisite Dependencies */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.APPS.WIZARD.FIELDS.DEPENDS_ON}</Label>
        <div className="runtime-dep-pills">
          <Button
            type="button"
            variant={(form.dependsOn || []).includes("devlab-portal") ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleDependsOnToggle("devlab-portal")}
            className="runtime-dep-btn"
          >
            {(form.dependsOn || []).includes("devlab-portal") ? (
              <CheckCircle2 className="button-icon-prefix text-success" />
            ) : (
              <AlertCircle className="button-icon-prefix text-muted" />
            )}
            devlab-portal (Core Auth & Gateway)
          </Button>
        </div>
        <p className="form-field-hint">
          Ecosystem services that should be verified running before booting this app.
        </p>
      </div>
    </div>
  );
};
