"use client";

/**
 * @file apps/web/src/features/apps/components/settings-drawer/settings-runtime-section.tsx
 * @description Settings section for process execution commands, working directory, and dependency configuration.
 * @module @devlab/portal-web/features/apps/components/settings-drawer/runtime
 */

import React, { useEffect, useState, useMemo } from "react";
import { Input, Label, Button, cn } from "@devlab-portal/ui";
import { FolderCheck, FolderX } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import { STACK_PRESETS, type StackPreset } from "../../constants/stack-presets";
import { useValidatePathMutation } from "../../api/supervisor";
import { AppDependencySelector } from "../app-dependency-selector";

interface SettingsRuntimeSectionProps {
  workingDir: string;
  devCommand: string;
  buildCommand: string;
  startCommand: string;
  dependsOn: string[];
  currentAppId?: string;
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
  currentAppId,
  onChangeWorkingDir,
  onChangeDevCommand,
  onChangeBuildCommand,
  onChangeStartCommand,
  onChangeDependsOn,
}) => {
  const [clickedPresetId, setClickedPresetId] = useState<string | null>(null);
  const validateMutation = useValidatePathMutation();

  const activePresetId = useMemo(() => {
    const match = STACK_PRESETS.find(
      (p) =>
        p.devCommand.trim() === (devCommand || "").trim() &&
        p.buildCommand.trim() === (buildCommand || "").trim() &&
        p.startCommand.trim() === (startCommand || "").trim(),
    );
    if (match) return match.id;
    return clickedPresetId;
  }, [devCommand, buildCommand, startCommand, clickedPresetId]);

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
    setClickedPresetId(preset.id);
    onChangeDevCommand(preset.devCommand);
    onChangeBuildCommand(preset.buildCommand);
    onChangeStartCommand(preset.startCommand);
  };

  return (
    <div className="settings-form-stack">
      {/* Preset quick fill */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.APPS.DRAWER.PRESETS_LABEL}</Label>
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

      {/* Working Directory */}
      <div className="form-field-group">
        <div className="runtime-label-with-status">
          <Label htmlFor="settings-working-dir" className="form-field-label">
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
          id="settings-working-dir"
          value={workingDir}
          onChange={(e) => onChangeWorkingDir(e.target.value)}
          onBlur={handleBlurWorkingDir}
          placeholder={UI_COPY.APPS.DRAWER.WORKING_DIR_PLACEHOLDER}
          className="form-field-input-mono"
        />
        <p className="form-field-hint">{UI_COPY.APPS.DRAWER.WORKING_DIR_HINT}</p>
      </div>

      {/* Dev & Start commands */}
      <div className="form-grid-2">
        <div className="form-field-group">
          <Label htmlFor="settings-dev-cmd" className="form-field-label">
            {UI_COPY.APPS.DRAWER.DEV_CMD_LABEL}
          </Label>
          <Input
            id="settings-dev-cmd"
            value={devCommand}
            onChange={(e) => {
              setClickedPresetId(null);
              onChangeDevCommand(e.target.value);
            }}
            placeholder={UI_COPY.APPS.DRAWER.DEV_CMD_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
        <div className="form-field-group">
          <Label htmlFor="settings-start-cmd" className="form-field-label">
            {UI_COPY.APPS.DRAWER.START_CMD_LABEL}
          </Label>
          <Input
            id="settings-start-cmd"
            value={startCommand}
            onChange={(e) => {
              setClickedPresetId(null);
              onChangeStartCommand(e.target.value);
            }}
            placeholder={UI_COPY.APPS.DRAWER.START_CMD_PLACEHOLDER}
            className="form-field-input-mono"
          />
        </div>
      </div>

      {/* Build Command */}
      <div className="form-field-group">
        <Label htmlFor="settings-build-cmd" className="form-field-label">
          {UI_COPY.APPS.DRAWER.BUILD_CMD_LABEL}
        </Label>
        <Input
          id="settings-build-cmd"
          value={buildCommand}
          onChange={(e) => {
            setClickedPresetId(null);
            onChangeBuildCommand(e.target.value);
          }}
          placeholder={UI_COPY.APPS.DRAWER.BUILD_CMD_PLACEHOLDER}
          className="form-field-input-mono"
        />
      </div>

      {/* Depends on */}
      <AppDependencySelector
        value={dependsOn}
        onChange={onChangeDependsOn}
        currentAppId={currentAppId}
      />
    </div>
  );
};
