"use client";

/**
 * @file apps/web/src/features/apps/components/settings-drawer/settings-runtime-section.tsx
 * @description Settings section for process execution commands, working directory, and dependency configuration.
 * @module @devlab/portal-web/features/apps/components/settings-drawer/runtime
 */

import React, { useEffect } from "react";
import { Input, Label, Button } from "@devlab-portal/ui";
import { FolderCheck, FolderX } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import { STACK_PRESETS, type StackPreset } from "../../constants/stack-presets";
import { useValidatePathMutation } from "../../api/supervisor";

interface SettingsRuntimeSectionProps {
  workingDir: string;
  devCommand: string;
  buildCommand: string;
  startCommand: string;
  dependsOn: string[];
  onChangeWorkingDir: (val: string) => void;
  onChangeDevCommand: (val: string) => void;
  onChangeBuildCommand: (val: string) => void;
  onChangeStartCommand: (val: string) => void;
  onChangeDependsOn: (val: string[]) => void;
}

export const SettingsRuntimeSection: React.FC<SettingsRuntimeSectionProps> = ({
  workingDir,
  devCommand,
  buildCommand,
  startCommand,
  dependsOn,
  onChangeWorkingDir,
  onChangeDevCommand,
  onChangeBuildCommand,
  onChangeStartCommand,
  onChangeDependsOn,
}) => {
  const validateMutation = useValidatePathMutation();

  const handleBlurWorkingDir = () => {
    if (workingDir?.trim()) {
      validateMutation.mutate({ path: workingDir.trim() });
    }
  };

  useEffect(() => {
    if (workingDir?.trim()) {
      validateMutation.mutate({ path: workingDir.trim() });
    }
  }, [workingDir]);

  const handleApplyPreset = (preset: StackPreset) => {
    onChangeDevCommand(preset.devCommand);
    onChangeBuildCommand(preset.buildCommand);
    onChangeStartCommand(preset.startCommand);
  };

  const handleDependsOnChange = (raw: string) => {
    const list = raw
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    onChangeDependsOn(list);
  };

  return (
    <div className="settings-field-stack">
      {/* Preset quick fill */}
      <div className="form-field-group">
        <Label className="settings-field-label">Quick Presets</Label>
        <div className="runtime-preset-row">
          {STACK_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleApplyPreset(preset)}
              className="runtime-preset-btn"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Working Directory */}
      <div className="form-field-group">
        <div className="runtime-label-with-status">
          <Label htmlFor="settings-working-dir" className="settings-field-label">
            {UI_COPY.APPS.DRAWER.WORKING_DIR_LABEL}
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
          id="settings-working-dir"
          value={workingDir}
          onChange={(e) => onChangeWorkingDir(e.target.value)}
          onBlur={handleBlurWorkingDir}
          placeholder={UI_COPY.APPS.DRAWER.WORKING_DIR_PLACEHOLDER}
          className="settings-field-input-mono"
        />
      </div>

      {/* Dev & Start commands */}
      <div className="settings-field-grid">
        <div className="form-field-group">
          <Label htmlFor="settings-dev-cmd" className="settings-field-label">
            {UI_COPY.APPS.DRAWER.DEV_CMD_LABEL}
          </Label>
          <Input
            id="settings-dev-cmd"
            value={devCommand}
            onChange={(e) => onChangeDevCommand(e.target.value)}
            placeholder={UI_COPY.APPS.DRAWER.DEV_CMD_PLACEHOLDER}
            className="settings-field-input-mono"
          />
        </div>
        <div className="form-field-group">
          <Label htmlFor="settings-start-cmd" className="settings-field-label">
            {UI_COPY.APPS.DRAWER.START_CMD_LABEL}
          </Label>
          <Input
            id="settings-start-cmd"
            value={startCommand}
            onChange={(e) => onChangeStartCommand(e.target.value)}
            placeholder={UI_COPY.APPS.DRAWER.START_CMD_PLACEHOLDER}
            className="settings-field-input-mono"
          />
        </div>
      </div>

      {/* Build Command */}
      <div className="form-field-group">
        <Label htmlFor="settings-build-cmd" className="settings-field-label">
          {UI_COPY.APPS.DRAWER.BUILD_CMD_LABEL}
        </Label>
        <Input
          id="settings-build-cmd"
          value={buildCommand}
          onChange={(e) => onChangeBuildCommand(e.target.value)}
          placeholder={UI_COPY.APPS.DRAWER.BUILD_CMD_PLACEHOLDER}
          className="settings-field-input-mono"
        />
      </div>

      {/* Depends on */}
      <div className="form-field-group">
        <Label htmlFor="settings-depends-on" className="settings-field-label">
          {UI_COPY.APPS.DRAWER.DEPENDS_ON_LABEL}
        </Label>
        <Input
          id="settings-depends-on"
          value={dependsOn.join(", ")}
          onChange={(e) => handleDependsOnChange(e.target.value)}
          placeholder={UI_COPY.APPS.DRAWER.DEPENDS_ON_PLACEHOLDER}
          className="settings-field-input-mono"
        />
        <p className="settings-field-hint">Comma-separated app IDs that must run first.</p>
      </div>
    </div>
  );
};
