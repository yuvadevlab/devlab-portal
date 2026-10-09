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
        <span>API :3015</span>
        <span>·</span>
        <span>Redis PubSub active</span>
      </span>

      <span className="flex items-center gap-5">
        <span>DevLab Portal v2.0.0</span>
        <span className="tag text-[9px]!">Demo workspace</span>
        <Button
          variant="link"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto gap-1 p-0 text-xs"
          onClick={() => window.open("https://docs.devlab.io", "_blank", "noopener,noreferrer")}
        >
          Documentation
          <ArrowUpRight className="size-3" />
        </Button>
      </span>
    </footer>
  );
};
