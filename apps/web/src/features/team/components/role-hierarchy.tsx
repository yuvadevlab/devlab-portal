"use client";

/**
 * @file apps/web/src/features/team/components/role-hierarchy.tsx
 * @description Role hierarchy overview showing permission privileges and operational scopes.
 * @module @devlab/portal-web/features/team/components/role-hierarchy
 */

import React from "react";
import { ShieldCheck } from "lucide-react";
import { UI_COPY } from "@/lib/ui-copy";

/**
 * Visual overview rendering the six RBAC role tiers (from super_admin down to member),
 * detailing their respective permissions, privileges, and application scopes.
 *
 * @returns React element rendering the role hierarchy banner
 */
export const RoleHierarchy: React.FC = () => {
  const roles = [
    {
      index: UI_COPY.TEAM.HIERARCHY.R01_INDEX,
      role: UI_COPY.TEAM.HIERARCHY.R01_ROLE,
      description: UI_COPY.TEAM.HIERARCHY.R01_DESC,
    },
    {
      index: UI_COPY.TEAM.HIERARCHY.R02_INDEX,
      role: UI_COPY.TEAM.HIERARCHY.R02_ROLE,
      description: UI_COPY.TEAM.HIERARCHY.R02_DESC,
    },
    {
      index: UI_COPY.TEAM.HIERARCHY.R03_INDEX,
      role: UI_COPY.TEAM.HIERARCHY.R03_ROLE,
      description: UI_COPY.TEAM.HIERARCHY.R03_DESC,
    },
    {
      index: UI_COPY.TEAM.HIERARCHY.R04_INDEX,
      role: UI_COPY.TEAM.HIERARCHY.R04_ROLE,
      description: UI_COPY.TEAM.HIERARCHY.R04_DESC,
    },
    {
      index: UI_COPY.TEAM.HIERARCHY.R05_INDEX,
      role: UI_COPY.TEAM.HIERARCHY.R05_ROLE,
      description: UI_COPY.TEAM.HIERARCHY.R05_DESC,
    },
    {
      index: UI_COPY.TEAM.HIERARCHY.R06_INDEX,
      role: UI_COPY.TEAM.HIERARCHY.R06_ROLE,
      description: UI_COPY.TEAM.HIERARCHY.R06_DESC,
    },
  ];

  return (
    <div className="role-hierarchy-section">
      <div className="role-hierarchy-header">
        <ShieldCheck className="role-hierarchy-icon" />
        {UI_COPY.TEAM.HIERARCHY.TITLE}
      </div>
      <div className="role-hierarchy-grid">
        {roles.map((item) => (
          <div key={item.role}>
            <div className="role-item-header">
              <span className="role-item-index">{item.index}</span>
              <span className="role-item-name">{item.role}</span>
            </div>
            <p className="role-item-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
