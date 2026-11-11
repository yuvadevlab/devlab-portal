"use client";

/**
 * @file apps/web/src/features/apps/components/register-wizard/wizard-step-runtime.tsx
 * @description Step 2 of App Registration Wizard: Polyglot working directory and execution commands.
 * @module @devlab/portal-web/features/apps/components/register-wizard/step2-runtime
 */

import React, { useState, useEffect, useMemo } from "react";
import { Input, Label, Button, cn } from "@devlab-portal/ui";
import { FolderCheck, FolderX } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import { STACK_PRESETS, type StackPreset } from "../../constants/stack-presets";
import { useValidatePathMutation } from "../../api/supervisor";
import { AppDependencySelector } from "../app-dependency-selector";
import type { RegisterWizardFormState } from "@/features/apps/types";

interface WizardStepRuntimeProps {
  form: RegisterWizardFormState;
  onChange: (fields: Partial<RegisterWizardFormState>) => void;
}

export const WizardStepRuntime: React.FC<WizardStepRuntimeProps> = ({ form, onChange }) => {
  const [clickedPresetId, setClickedPresetId] = useState<string | null>(null);
  const validateMutation = useValidatePathMutation();

  const activePresetId = useMemo(() => {
    const match = STACK_PRESETS.find(
      (p) =>
        p.devCommand.trim() === (form.devCommand || "").trim() &&
        p.buildCommand.trim() === (form.buildCommand || "").trim() &&
        p.startCommand.trim() === (form.startCommand || "").trim(),
    );
    if (match) return match.id;
    return clickedPresetId;
  }, [form.devCommand, form.buildCommand, form.startCommand, clickedPresetId]);

  const handleApplyPreset = (preset: StackPreset) => {
    setClickedPresetId(preset.id);
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

  return (
    <div className="wizard-step-container">
      {/* Stack Preset Selection */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.APPS.WIZARD.FIELDS.STACK_PRESET}</Label>
        <div className="runtime-preset-row">
          {STACK_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <Button
                key={preset.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleApplyPreset(preset)}
                className={cn("runtime-preset-btn", isSelected && "selected")}
                data-selected={isSelected}
              >
                {preset.label}
              </Button>
            );
          })}
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
                  <FolderCheck className="badge-icon" /> {UI_COPY.APPS.DRAWER.PATH_VALID}
                </>
              ) : (
                <>
                  <FolderX className="badge-icon" /> {UI_COPY.APPS.DRAWER.PATH_INVALID}
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
      <AppDependencySelector
        value={form.dependsOn || []}
        onChange={(val) => onChange({ dependsOn: val })}
        currentAppId={form.appId}
      />
    </div>
  );
};
