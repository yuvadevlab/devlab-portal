"use client";

/**
 * @file apps/web/src/components/layout/heading.tsx
 * @description Standardized page heading layout featuring workspace eyebrow, title, and action controls.
 * @module @devlab/portal-web/components/layout/heading
 */

import React, { type ReactNode } from "react";
import { Box } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";

interface HeadingProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, children }) => {
  return (
    <>
      <div className="eyebrow">
        <Box className="size-3" />
        <span>{UI_COPY.COMMON.HEADER.WORKSPACE}</span>
        <span>/</span>
        <span className="text-foreground font-medium">{title}</span>
      </div>

      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </>
  );
};
