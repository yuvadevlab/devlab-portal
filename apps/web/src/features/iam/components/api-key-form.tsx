"use client";

/**
 * @file apps/web/src/features/iam/components/api-key-form.tsx
 * @description Scoped form inputs for API key creation modal.
 * @module @devlab/portal-web/features/iam/components/api-key-form
 */

import React from "react";
import {
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { RegisteredApp } from "@/lib/api-client";

export interface ApiKeyFormProps {
  name: string;
  setName: (val: string) => void;
  appId: string;
  onAppChange: (val: string) => void;
  apps: RegisteredApp[];
  scopeOptions: Array<{ id: string; label: string }>;
  selectedScopes: string[];
  onToggleScope: (id: string) => void;
  rateLimit: number;
  setRateLimit: (val: number) => void;
  onSubmit: (e: React.SubmitEvent) => void;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  name,
  setName,
  appId,
  onAppChange,
  apps,
  scopeOptions,
  selectedScopes,
  onToggleScope,
  rateLimit,
  setRateLimit,
  onSubmit,
}) => {
  return (
    <form id="api-key-form" onSubmit={onSubmit} className="settings-form-stack">
      <div className="form-field-group">
        <Label htmlFor="api-key-name" className="form-field-label">
          {UI_COPY.IAM.MODAL.NAME_LABEL}
        </Label>
        <Input
          id="api-key-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={UI_COPY.IAM.MODAL.NAME_PLACEHOLDER}
          required
          className="form-field-input"
        />
      </div>

      <div className="form-field-group">
        <Label htmlFor="api-key-app" className="form-field-label">
          {UI_COPY.IAM.MODAL.APP_LABEL}
        </Label>
        <Select value={appId} onValueChange={onAppChange}>
          <SelectTrigger id="api-key-app" className="form-field-select">
            <SelectValue placeholder={UI_COPY.IAM.MODAL.APP_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            {apps.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name} ({a.appId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.IAM.MODAL.SCOPES_LABEL}</Label>
        <div className="form-grid-2">
          {scopeOptions.map((s) => (
            <div
              key={s.id}
              onClick={() => onToggleScope(s.id)}
              className={`scope-toggle-card ${selectedScopes.includes(s.id) ? "selected" : ""}`}
            >
              <Checkbox
                id={`scope-${s.id}`}
                checked={selectedScopes.includes(s.id)}
                onCheckedChange={() => onToggleScope(s.id)}
              />
              <span className="scope-toggle-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-field-group">
        <Label htmlFor="api-key-rate-limit" className="form-field-label">
          {UI_COPY.IAM.MODAL.RATE_LIMIT_LABEL}
        </Label>
        <Input
          id="api-key-rate-limit"
          type="number"
          value={rateLimit}
          onChange={(e) => setRateLimit(Number(e.target.value))}
          min={60}
          max={10000}
          className="form-field-input-mono"
        />
      </div>
    </form>
  );
};
