/**
 * @file apps/web/src/features/iam/components/api-key-modal.tsx
 * @description Modal dialog for configuring and provisioning scoped API credentials.
 * Adheres strictly to Sonner promise toast standard across FinAI and OrchestrAI.
 * @module @devlab/portal-web/features/iam/components/api-key-modal
 */

import React, { useState } from "react";
import { Key } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  toast,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { ApiKeyScope, buildScope } from "@/lib/constants";
import type { RegisteredApp } from "@/lib/api-client";
import { useCreateApiKey } from "@/features/iam/api";
import { ApiKeyRevealPane } from "./api-key-reveal-pane";
import { ApiKeyForm } from "./api-key-form";

interface ApiKeyModalProps {
  apps: RegisteredApp[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ apps, isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [appId, setAppId] = useState("");
  const [rateLimit, setRateLimit] = useState(600);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const createApiKeyMutation = useCreateApiKey();

  const selectedApp = apps.find((a) => a.id === appId || a.appId === appId) || apps[0];
  const appSlug = selectedApp?.slug || selectedApp?.appId || "app";

  const scopeOptions = React.useMemo(
    () => [
      { id: buildScope(appSlug, ApiKeyScope.READ), label: `${appSlug}:read` },
      { id: buildScope(appSlug, ApiKeyScope.WRITE), label: `${appSlug}:write` },
      { id: buildScope(appSlug, ApiKeyScope.EXECUTE), label: `${appSlug}:executions:create` },
      { id: buildScope(appSlug, ApiKeyScope.EVENTS), label: `${appSlug}:events:publish` },
    ],
    [appSlug],
  );

  const defaultScope = buildScope(apps[0]?.slug || apps[0]?.appId || "app", ApiKeyScope.READ);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  React.useEffect(() => {
    if (selectedScopes.length === 0 && defaultScope) {
      setSelectedScopes([defaultScope]);
    }
  }, [defaultScope, selectedScopes.length]);

  const handleAppChange = (newAppId: string) => {
    setAppId(newAppId);
    const target = apps.find((a) => a.id === newAppId || a.appId === newAppId);
    const targetSlug = target?.slug || target?.appId || "app";
    setSelectedScopes([buildScope(targetSlug, ApiKeyScope.READ)]);
  };

  const handleToggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId],
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!appId && apps.length > 0)) {
      return;
    }

    const targetAppId = appId || (apps[0]?.id ?? "");
    const promise = createApiKeyMutation.mutateAsync({
      name,
      appId: targetAppId,
      scopes: selectedScopes,
      rateLimitRpm: rateLimit,
    });

    toast.promise(promise, {
      loading: `Generating API key "${name}"...`,
      success: (res) => {
        setGeneratedKey(res.rawKey);
        onSuccess();
        return `API key "${name}" generated successfully`;
      },
      error: (err: unknown) => (err instanceof Error ? err.message : "Failed to generate API key"),
    });
  };

  const handleClose = () => {
    setName("");
    setAppId("");
    setSelectedScopes([defaultScope]);
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
            <ApiKeyRevealPane generatedKey={generatedKey} />
          ) : (
            <ApiKeyForm
              name={name}
              setName={setName}
              appId={appId}
              onAppChange={handleAppChange}
              apps={apps}
              scopeOptions={scopeOptions}
              selectedScopes={selectedScopes}
              onToggleScope={handleToggleScope}
              rateLimit={rateLimit}
              setRateLimit={setRateLimit}
              onSubmit={handleCreate}
            />
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
                {createApiKeyMutation.isPending
                  ? UI_COPY.COMMON.ACTIONS.GENERATING
                  : UI_COPY.COMMON.ACTIONS.GENERATE}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
