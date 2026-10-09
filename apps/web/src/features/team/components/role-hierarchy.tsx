"use client";

/**
 * @file apps/web/src/features/team/components/role-hierarchy.tsx
 * @description Role hierarchy overview showing permission privileges and operational scopes.
 * @module @devlab/portal-web/features/team/components/role-hierarchy
 */

import React from "react";
import { ShieldCheck } from "lucide-react";

export const RoleHierarchy: React.FC = () => {
  const roles = [
    {
      index: "01",
      role: "super_admin",
      description: "Full ecosystem control and tenant ownership",
    },
    {
      index: "02",
      role: "admin",
      description: "Manage applications, keys, and team members",
    },
    {
      index: "03",
      role: "developer",
      description: "Build integrations and manage service credentials",
    },
    {
      index: "04",
      role: "operator",
      description: "Monitor services and respond to incidents",
    },
    {
      index: "05",
      role: "read_only",
      description: "View applications and audit records",
    },
  ];

  return (
    <div className="border-border mb-7 border-y py-6">
      <div className="text-foreground mb-5 flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck className="text-primary size-4" />
        Role hierarchy
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
        {roles.map((item) => (
          <div key={item.role}>
            <div className="flex items-center gap-2">
              <span className="text-primary font-mono text-[11px] font-bold">{item.index}</span>
              <span className="text-foreground text-xs font-semibold">{item.role}</span>
            </div>
            <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
