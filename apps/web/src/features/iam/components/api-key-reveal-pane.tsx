"use client";

/**
 * @file apps/web/src/features/iam/components/api-key-reveal-pane.tsx
 * @description Reveal card presenting generated API key secret with security warning.
 * @module @devlab/portal-web/features/iam/components/api-key-reveal-pane
 */

import React from "react";
import { SecretRevealCard } from "@devlab-portal/ui";
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
    </div>
  );
};
