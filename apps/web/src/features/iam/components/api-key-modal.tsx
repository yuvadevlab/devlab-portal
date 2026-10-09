"use client";

/**
 * @file apps/web/src/features/iam/components/api-key-modal.tsx
 * @description Modal dialog generating cryptographically random API keys with SecretRevealCard.
 * Fully built with @yuva-devlab/ui Dialog, Input, Label, Select, and Checkbox components.
 * @module @devlab/portal-web/features/iam/components/api-key-modal
 */

import React, { useState } from "react";
import { Key, AlertTriangle } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  SecretRevealCard,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { ApiKeyScope } from "@/lib/constants";
import { logger } from "@/lib/logger";
import type { RegisteredApp } from "@/lib/api-client";
import { useCreateApiKey } from "@/features/iam/api";

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

  const createApiKeyMutation = useCreateApiKey();

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

    try {
      const targetAppId = appId || (apps[0]?.id ?? "");
      const res = await createApiKeyMutation.mutateAsync({
        name,
        appId: targetAppId,
        scopes: selectedScopes,
        rateLimitRpm: rateLimit,
      });

      setGeneratedKey(res.rawKey);
      onSuccess();
    } catch (err) {
      logger.error("Failed to generate API key:", err);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <Key className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">{UI_COPY.IAM.MODAL.TITLE}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                {UI_COPY.IAM.MODAL.DESCRIPTION}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4 py-3">
          {generatedKey ? (
            <div className="space-y-4">
              <SecretRevealCard
                secret={generatedKey}
                warningMessage={UI_COPY.IAM.MODAL.SECRET_WARNING}
                copyLabel={UI_COPY.COMMON.ACTIONS.COPY}
              />
              <div className="border-warning/20 bg-warning/10 text-warning flex items-start gap-2 rounded-lg border p-3 text-xs">
                <AlertTriangle className="text-warning mt-0.5 size-4 shrink-0" />
                <p className="text-[11px] leading-relaxed">{UI_COPY.IAM.MODAL.SECRET_WARNING}</p>
              </div>
            </div>
          ) : (
            <form id="api-key-form" onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="api-key-name" className="text-xs font-semibold">
                  {UI_COPY.IAM.MODAL.NAME_LABEL} *
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
                  {UI_COPY.IAM.MODAL.APP_LABEL} *
                </Label>
                <Select value={appId} onValueChange={setAppId}>
                  <SelectTrigger id="api-key-app" className="h-9 w-full text-xs">
                    <SelectValue placeholder="Select target application..." />
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
                      onClick={() => handleToggleScope(s.id)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 transition-colors ${
                        selectedScopes.includes(s.id)
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <Checkbox
                        id={`scope-${s.id}`}
                        checked={selectedScopes.includes(s.id)}
                        onCheckedChange={() => handleToggleScope(s.id)}
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
          )}
        </DialogBody>

        <DialogFooter>
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
              <Button type="button" variant="outline" onClick={handleClose} className="h-9 text-xs">
                {UI_COPY.COMMON.ACTIONS.CANCEL}
              </Button>
              <Button
                type="submit"
                form="api-key-form"
                disabled={createApiKeyMutation.isPending || !name}
                className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
              >
                {createApiKeyMutation.isPending ? "Generating..." : UI_COPY.COMMON.ACTIONS.GENERATE}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
