"use client";

/**
 * @file apps/web/src/features/apps/components/app-dependency-selector.tsx
 * @description Prerequisite microservice dependency multi-select dropdown with devlab-portal platform core pre-selected.
 * @module @devlab/portal-web/features/apps/components/app-dependency-selector
 */

import React, { useMemo } from "react";
import { Label, MultiSelect, type MultiSelectOption } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { useAppsQuery } from "@/features/apps/api";
import type { RegisteredApp } from "@/features/apps/types";

interface AppDependencySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  currentAppId?: string;
  apps?: RegisteredApp[];
}

export const AppDependencySelector: React.FC<AppDependencySelectorProps> = ({
  value = [],
  onChange,
  currentAppId,
  apps: propApps,
}) => {
  const { data: queriedApps = [] } = useAppsQuery();
  const availableApps = propApps && propApps.length > 0 ? propApps : queriedApps;

  const options: MultiSelectOption[] = useMemo(() => {
    const list: MultiSelectOption[] = [
      {
        label: `${UI_COPY.APPS.DEPENDENCY_SELECTOR.PORTAL_NAME} (${UI_COPY.APPS.DEPENDENCY_SELECTOR.CORE_BADGE})`,
        value: "devlab-portal",
      },
    ];

    const additionalApps = availableApps
      .filter((app) => app.appId !== currentAppId && app.appId !== "devlab-portal")
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const app of additionalApps) {
      list.push({
        label: `${app.name} (${app.appId})`,
        value: app.appId,
      });
    }

    return list;
  }, [availableApps, currentAppId]);

  return (
    <div className="form-field-group">
      <Label htmlFor="app-dependency-select" className="form-field-label">
        {UI_COPY.APPS.DEPENDENCY_SELECTOR.LABEL}
      </Label>
      <MultiSelect
        id="app-dependency-select"
        options={options}
        value={value}
        onChange={onChange}
        placeholder={UI_COPY.APPS.DEPENDENCY_SELECTOR.SELECT_PLACEHOLDER}
      />
      <p className="form-field-hint">{UI_COPY.APPS.DEPENDENCY_SELECTOR.HINT}</p>
    </div>
  );
};
