"use client";

/**
 * @file apps/web/src/features/apps/components/process-dependencies-card.tsx
 * @description Card rendering health and readiness status of prerequisite services.
 * @module @devlab/portal-web/features/apps/components/process-dependencies-card
 */

import React from "react";
import { CheckCircle2, AlertTriangle, Play, ShieldAlert } from "lucide-react";
import { Button } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { DependencyStatus } from "../types";

interface ProcessDependenciesCardProps {
  dependencies: readonly DependencyStatus[];
  onStartPrerequisites: () => void;
  isStarting?: boolean;
}

export const ProcessDependenciesCard: React.FC<ProcessDependenciesCardProps> = ({
  dependencies,
  onStartPrerequisites,
  isStarting = false,
}) => {
  if (!dependencies || dependencies.length === 0) {
    return null;
  }

  const allHealthy = dependencies.every((dep) => dep.running && dep.healthy);

  return (
    <div className={`process-deps-card ${allHealthy ? "healthy" : "warning"}`}>
      <div className="process-deps-header">
        <div className="process-deps-title-group">
          {allHealthy ? (
            <CheckCircle2 className="process-deps-icon healthy" />
          ) : (
            <ShieldAlert className="process-deps-icon warning" />
          )}
          <span className="process-deps-title">{UI_COPY.APPS.SUPERVISOR.DEPS_TITLE}</span>
        </div>
        {!allHealthy && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isStarting}
            onClick={onStartPrerequisites}
            className="process-deps-start-btn"
          >
            <Play className="btn-icon" />
            {UI_COPY.APPS.SUPERVISOR.ACTION_START_DEPS}
          </Button>
        )}
      </div>

      <div className="process-deps-list">
        {dependencies.map((dep) => (
          <div key={dep.appId} className="process-dep-item">
            <span className="process-dep-name">{dep.name || dep.appId}</span>
            <div className="process-dep-status">
              {dep.running ? (
                <span className="process-dep-badge running">
                  <span className="dep-dot" />
                  Running
                </span>
              ) : (
                <span className="process-dep-badge stopped">
                  <AlertTriangle className="dep-icon" />
                  Stopped
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
