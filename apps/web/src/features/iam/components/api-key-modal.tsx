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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                {UI_COPY.IAM.MODAL.TITLE}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {UI_COPY.IAM.MODAL.DESCRIPTION}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 overflow-y-auto flex-1 pr-1">
          {generatedKey ? (
            /* Reveal Mode */
            <div className="space-y-4">
              <SecretRevealCard
                secret={generatedKey}
                warningMessage={UI_COPY.IAM.MODAL.SECRET_WARNING}
                copyLabel={UI_COPY.COMMON.ACTIONS.COPY}
              />
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <p className="text-[11px] leading-relaxed">{UI_COPY.IAM.MODAL.SECRET_WARNING}</p>
              </div>
            </div>
          ) : (
            /* Form Mode */
            <form id="api-key-form" onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {UI_COPY.IAM.MODAL.NAME_LABEL} *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={UI_COPY.IAM.MODAL.NAME_PLACEHOLDER}
                  required
                  className="bg-[var(--background)] border-[var(--border)] text-xs h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {UI_COPY.IAM.MODAL.APP_LABEL} *
                </label>
                <select
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] h-9 focus:ring-1 focus:ring-[var(--primary)]"
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
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                  {UI_COPY.IAM.MODAL.SCOPES_LABEL}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {scopeOptions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleToggleScope(s.id)}
                      className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-colors ${
                        selectedScopes.includes(s.id)
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]"
                          : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(s.id)}
                        onChange={() => {}}
                        className="rounded border-[var(--border)] text-[var(--primary)]"
                      />
                      <span className="font-mono text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {UI_COPY.IAM.MODAL.RATE_LIMIT_LABEL}
                </label>
                <Input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  min={60}
                  max={10000}
                  className="bg-[var(--background)] border-[var(--border)] text-xs h-9 font-mono"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4 mt-2">
          {generatedKey ? (
            <Button
              type="button"
              onClick={handleClose}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs h-9 font-medium"
            >
              {UI_COPY.COMMON.ACTIONS.CLOSE}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="text-xs h-9 border-[var(--border)]"
              >
                {UI_COPY.COMMON.ACTIONS.CANCEL}
              </Button>
              <Button
                type="submit"
                form="api-key-form"
                disabled={isSubmitting || !name}
                className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs h-9 font-medium"
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
