"use client";

/**
 * @file apps/web/src/components/layout/portal-footer.tsx
 * @description Master portal footer displaying operational cluster statuses, API endpoints, and version metadata.
 * @module @devlab/portal-web/components/layout/portal-footer
 */

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";

export const PortalFooter: React.FC = () => {
  return (
    <footer className="footer">
      <span className="flex items-center gap-2">
        <span className="status text-[10px]">
          <span className="status-dot" />
          {UI_COPY.COMMON.STATUS.HEALTHY}
        </span>
        <span>·</span>
        <span>{UI_COPY.COMMON.FOOTER.API_PORT}</span>
        <span>·</span>
        <span>{UI_COPY.COMMON.FOOTER.REDIS_PUBSUB}</span>
      </span>

      <span className="flex items-center gap-5">
        <span>{UI_COPY.COMMON.FOOTER.VERSION}</span>
        <span className="tag text-[9px]!">{UI_COPY.COMMON.FOOTER.DEMO_WORKSPACE}</span>
        <Button
          variant="link"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto gap-1 p-0 text-xs"
          onClick={() => window.open("https://docs.devlab.io", "_blank", "noopener,noreferrer")}
        >
          {UI_COPY.COMMON.FOOTER.DOCS}
          <ArrowUpRight className="size-3" />
        </Button>
      </span>
    </footer>
  );
};
