"use client";

/**
 * @file apps/web/src/features/apps/components/process-mode-toggle.tsx
 * @description Segmented control for toggling process execution between Dev and Production modes.
 * @module @devlab/portal-web/features/apps/components/process-mode-toggle
 */

import React from "react";
import { Zap, PackageCheck } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";
import type { ExecutionMode } from "../types";

interface ProcessModeToggleProps {
  mode: ExecutionMode;
  onChangeMode: (mode: ExecutionMode) => void;
  disabled?: boolean;
}

export const ProcessModeToggle: React.FC<ProcessModeToggleProps> = ({
  mode,
  onChangeMode,
  disabled = false,
}) => {
  return (
    <div className="process-mode-toggle-group">
      <span className="process-mode-label">{UI_COPY.APPS.SUPERVISOR.MODE_LABEL}</span>
      <div className="process-mode-segmented">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeMode("dev")}
          className={`process-mode-btn ${mode === "dev" ? "active" : ""}`}
        >
          <Zap className="mode-btn-icon" />
          <span>{UI_COPY.APPS.SUPERVISOR.MODE_DEV}</span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeMode("prod")}
          className={`process-mode-btn ${mode === "prod" ? "active" : ""}`}
        >
          <PackageCheck className="mode-btn-icon" />
          <span>{UI_COPY.APPS.SUPERVISOR.MODE_PROD}</span>
        </button>
      </div>
    </div>
  );
};
