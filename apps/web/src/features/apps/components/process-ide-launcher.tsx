"use client";

/**
 * @file apps/web/src/features/apps/components/process-ide-launcher.tsx
 * @description Quick-action bar to open application repository in Google Antigravity IDE, VS Code, or Cursor.
 * @module @devlab/portal-web/features/apps/components/process-ide-launcher
 */

import React, { useState } from "react";
import { Code2, ExternalLink, Loader2 } from "lucide-react";
import { Button, toast } from "@devlab-portal/ui";
import { useOpenIdeMutation } from "../api/supervisor";
import type { SupportedIde } from "../types";

interface ProcessIdeLauncherProps {
  appId: string;
  tenantId?: string;
}

export const ProcessIdeLauncher: React.FC<ProcessIdeLauncherProps> = ({ appId, tenantId }) => {
  const [activeIde, setActiveIde] = useState<SupportedIde | null>(null);
  const openIdeMutation = useOpenIdeMutation();

  const handleLaunch = async (ide: SupportedIde) => {
    setActiveIde(ide);
    const ideDisplayName = ide === "antigravity" ? "Antigravity IDE" : "VS Code";

    const promise = openIdeMutation.mutateAsync({ appId, ide, tenantId });

    toast.promise(promise, {
      loading: `Opening ${ideDisplayName}...`,
      success: (result) => {
        if (!result.success && !result.launched) {
          throw new Error(result.message || result.error || `Could not open ${ideDisplayName}`);
        }
        // Fallback: If not spawned directly on host, trigger client browser protocol deep link
        if (!result.hostSpawned && (result.deepLinkUrl || result.deepLink)) {
          const url = result.deepLinkUrl || result.deepLink;
          if (url && typeof window !== "undefined") {
            window.location.assign(url);
          }
        }
        return result.message || `Opened in ${ideDisplayName}`;
      },
      error: (err) => (err as Error).message || `Failed to open ${ideDisplayName}`,
    });

    try {
      await promise;
    } catch {
      // Handled by toast.promise
    } finally {
      setActiveIde(null);
    }
  };

  return (
    <div className="process-ide-launcher-card">
      <div className="process-ide-title-row">
        <Code2 className="process-ide-icon" />
        <span className="process-ide-title">Open in Host IDE</span>
      </div>
      <div className="process-ide-btn-group">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={openIdeMutation.isPending}
          onClick={() => handleLaunch("antigravity")}
          className="process-ide-btn antigravity-btn"
          title="Open in Google Antigravity IDE"
        >
          <span>Antigravity</span>
          {activeIde === "antigravity" ? (
            <Loader2 className="ide-link-icon spin" />
          ) : (
            <ExternalLink className="ide-link-icon" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={openIdeMutation.isPending}
          onClick={() => handleLaunch("vscode")}
          className="process-ide-btn"
          title="Open in Visual Studio Code"
        >
          <span>VS Code</span>
          {activeIde === "vscode" ? (
            <Loader2 className="ide-link-icon spin" />
          ) : (
            <ExternalLink className="ide-link-icon" />
          )}
        </Button>
      </div>
    </div>
  );
};
