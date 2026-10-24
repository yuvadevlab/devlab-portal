"use client";

/**
 * @file packages/ui/src/components/heading.tsx
 * @description Standardized page heading layout featuring an eyebrow, title, and action controls.
 * @module @devlab-portal/ui/components/heading
 */

import React, { type ReactNode } from "react";
import { Box } from "lucide-react";

interface HeadingProps {
  title: string;
  description: string;
  eyebrowLabel: string;
  children?: ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, eyebrowLabel, children }) => {
  return (
    <>
      <div className="eyebrow">
        <Box className="size-3" />
        <span>{eyebrowLabel}</span>
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
