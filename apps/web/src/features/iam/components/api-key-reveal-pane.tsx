"use client";

/**
 * @file apps/web/src/features/iam/components/api-key-reveal-pane.tsx
 * @description Reveal card presenting generated API key secret with security warning.
 * @module @devlab/portal-web/features/iam/components/api-key-reveal-pane
 */

import React from "react";
import { AlertTriangle } from "lucide-react";
import { SecretRevealCard } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";

interface ApiKeyRevealPaneProps {
  generatedKey: string;
}

export const ApiKeyRevealPane: React.FC<ApiKeyRevealPaneProps> = ({ generatedKey }) => {
  return (
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
  );
};
