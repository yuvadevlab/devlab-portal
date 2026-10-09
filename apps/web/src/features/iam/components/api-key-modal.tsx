/**
 * @file apps/web/src/features/iam/components/api-key-modal.tsx
 * @description Modal dialog generating cryptographically random API keys with SecretRevealCard.
 * @module @devlab/portal-web/features/iam/components/api-key-modal
 */

import React, { useState } from "react";
import { Key, X, AlertTriangle } from "lucide-react";
import { Button, Input, SecretRevealCard } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { ApiKeyScope } from "../../../lib/constants/enums";
import { api, RegisteredApp } from "../../../lib/api-client";

interface ApiKeyModalProps {
  apps: RegisteredApp[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ apps, isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [appId, setAppId] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([ApiKeyScope.ORCHESTRAI_READ]);
  const [rateLimit, setRateLimit] = useState(600);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const scopeOptions = [
    { id: ApiKeyScope.ORCHESTRAI_READ, label: "orchestrai:read" },
    { id: ApiKeyScope.ORCHESTRAI_WRITE, label: "orchestrai:write" },
    { id: ApiKeyScope.ORCHESTRAI_EXECUTE, label: "orchestrai:executions:create" },
    { id: ApiKeyScope.FINAI_READ, label: "finai:read" },
    { id: ApiKeyScope.FINAI_WRITE, label: "finai:write" },
    { id: ApiKeyScope.LOGS_INGEST, label: "logs:ingest" },
  ];

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId],
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!appId && apps.length > 0)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const targetAppId = appId || (apps[0]?.id ?? "");
      const res = await api.createApiKey({
        name,
        appId: targetAppId,
        scopes: selectedScopes,
        rateLimitRpm: rateLimit,
      });

      setGeneratedKey(res.rawKey);
      onSuccess();
    } catch (err) {
      console.error("Failed to generate API key:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setAppId("");
    setSelectedScopes([ApiKeyScope.ORCHESTRAI_READ]);
    setRateLimit(600);
    setGeneratedKey(null);
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="border-border bg-card flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border p-6 shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">{UI_COPY.IAM.MODAL.TITLE}</h3>
              <p className="text-muted-foreground text-xs">{UI_COPY.IAM.MODAL.DESCRIPTION}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:bg-background hover:text-foreground rounded-lg p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1">
          {generatedKey ? (
            /* Reveal Mode */
            <div className="space-y-4">
              <SecretRevealCard
                secret={generatedKey}
                warningMessage={UI_COPY.IAM.MODAL.SECRET_WARNING}
                copyLabel={UI_COPY.COMMON.ACTIONS.COPY}
              />
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-[11px] leading-relaxed">{UI_COPY.IAM.MODAL.SECRET_WARNING}</p>
              </div>
            </div>
          ) : (
            /* Form Mode */
            <form id="api-key-form" onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  {UI_COPY.IAM.MODAL.NAME_LABEL} *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={UI_COPY.IAM.MODAL.NAME_PLACEHOLDER}
                  required
                  className="bg-background border-border h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  {UI_COPY.IAM.MODAL.APP_LABEL} *
                </label>
                <select
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="border-border bg-background text-foreground focus:ring-primary h-9 w-full rounded-md border px-3 py-1.5 text-xs focus:ring-1"
                >
                  <option value="">Select target application...</option>
                  {apps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.appId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-foreground mb-1.5 block text-xs font-semibold">
                  {UI_COPY.IAM.MODAL.SCOPES_LABEL}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {scopeOptions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleToggleScope(s.id)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2 transition-colors ${
                        selectedScopes.includes(s.id)
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(s.id)}
                        onChange={() => {}}
                        className="border-border text-primary rounded"
                      />
                      <span className="font-mono text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-foreground mb-1 block text-xs font-semibold">
                  {UI_COPY.IAM.MODAL.RATE_LIMIT_LABEL}
                </label>
                <Input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  min={60}
                  max={10000}
                  className="bg-background border-border h-9 font-mono text-xs"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="border-border mt-2 flex items-center justify-end gap-3 border-t pt-4">
          {generatedKey ? (
            <Button
              type="button"
              onClick={handleClose}
              className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
            >
              {UI_COPY.COMMON.ACTIONS.CLOSE}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-border h-9 text-xs"
              >
                {UI_COPY.COMMON.ACTIONS.CANCEL}
              </Button>
              <Button
                type="submit"
                form="api-key-form"
                disabled={isSubmitting || !name}
                className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
              >
                {isSubmitting ? "Generating..." : UI_COPY.COMMON.ACTIONS.GENERATE}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
