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
    <form id="api-key-form" onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="api-key-name" className="text-xs font-semibold">
          {UI_COPY.IAM.MODAL.NAME_LABEL}
        </Label>
        <Input
          id="api-key-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={UI_COPY.IAM.MODAL.NAME_PLACEHOLDER}
          required
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="api-key-app" className="text-xs font-semibold">
          {UI_COPY.IAM.MODAL.APP_LABEL}
        </Label>
        <Select value={appId} onValueChange={onAppChange}>
          <SelectTrigger id="api-key-app" className="h-9 w-full text-xs">
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

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">{UI_COPY.IAM.MODAL.SCOPES_LABEL}</Label>
        <div className="grid grid-cols-2 gap-2">
          {scopeOptions.map((s) => (
            <div
              key={s.id}
              onClick={() => onToggleScope(s.id)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 transition-colors ${
                selectedScopes.includes(s.id)
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <Checkbox
                id={`scope-${s.id}`}
                checked={selectedScopes.includes(s.id)}
                onCheckedChange={() => onToggleScope(s.id)}
              />
              <span className="font-mono text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="api-key-rate-limit" className="text-xs font-semibold">
          {UI_COPY.IAM.MODAL.RATE_LIMIT_LABEL}
        </Label>
        <Input
          id="api-key-rate-limit"
          type="number"
          value={rateLimit}
          onChange={(e) => setRateLimit(Number(e.target.value))}
          min={60}
          max={10000}
          className="h-9 font-mono text-xs"
        />
      </div>
    </form>
  );
};
