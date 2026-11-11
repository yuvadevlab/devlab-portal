"use client";

/**
 * @file apps/web/src/features/team/components/invite-member-form.tsx
 * @description Form inputs for inviting and onboarding team members with RBAC roles and app access.
 * Enforces Zero Hardcoded Strings with role and application assignment.
 * @module @devlab/portal-web/features/team/components/invite-member-form
 */

import React from "react";
import {
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { UserRole } from "@/lib/constants/enums";
import type { RegisteredApp } from "@/lib/api-client";

/**
 * Properties required to render and manage state within the {@link InviteMemberForm}.
 */
export interface InviteMemberFormProps {
  /** Full name of the invitee */
  name: string;
  /** Dispatcher updating the invitee name state */
  setName: (val: string) => void;
  /** Corporate email address of the invitee */
  email: string;
  /** Dispatcher updating the invitee email state */
  setEmail: (val: string) => void;
  /** Primary RBAC role assigned to the new member */
  role: string;
  /** Dispatcher updating the role selection state */
  setRole: (val: string) => void;
  /** Registered applications catalog */
  apps: RegisteredApp[];
  /** Array of permitted platform application identifiers (empty by default) */
  allowedApps: string[];
  /** Dispatcher updating authorized application identifiers */
  setAllowedApps: (apps: string[]) => void;
  /** Form submission handler */
  onSubmit: (e: React.SubmitEvent) => void;
}

/**
 * Interactive form component rendering input controls for user onboarding,
 * RBAC role assignment, and platform application entitlement scoping.
 *
 * @param props - Component configuration satisfying {@link InviteMemberFormProps}
 * @returns React form element for team member invitation
 */
export const InviteMemberForm: React.FC<InviteMemberFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  apps,
  allowedApps,
  setAllowedApps,
  onSubmit,
}) => {
  /**
   * Toggles inclusion of an application identifier in the member entitlement list.
   *
   * @param appId - Target platform application identifier from the database
   * @param checked - Whether the application access checkbox is active
   */
  const toggleApp = (appId: string, checked: boolean) => {
    // If checked, append app identifier to allowed list if not already present
    if (checked) {
      if (!allowedApps.includes(appId)) {
        setAllowedApps([...allowedApps, appId]);
      }
    } else {
      // If unchecked, filter out the app identifier from allowed list
      setAllowedApps(allowedApps.filter((a) => a !== appId));
    }
  };

  return (
    <form id="invite-member-form" onSubmit={onSubmit} className="settings-form-stack">
      {/* Invitee Full Name */}
      <div className="form-field-group">
        <Label htmlFor="invite-name" className="form-field-label">
          {UI_COPY.TEAM.MODAL.NAME_LABEL}
        </Label>
        <Input
          id="invite-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={UI_COPY.TEAM.MODAL.NAME_PLACEHOLDER}
          required
          className="form-field-input"
        />
      </div>

      {/* Invitee Corporate Email */}
      <div className="form-field-group">
        <Label htmlFor="invite-email" className="form-field-label">
          {UI_COPY.TEAM.MODAL.EMAIL_LABEL}
        </Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={UI_COPY.TEAM.MODAL.EMAIL_PLACEHOLDER}
          required
          className="form-field-input-mono"
        />
      </div>

      {/* RBAC Role Selector */}
      <div className="form-field-group">
        <Label htmlFor="invite-role" className="form-field-label">
          {UI_COPY.TEAM.MODAL.ROLE_LABEL}
        </Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="invite-role" className="form-field-select">
            <SelectValue placeholder={UI_COPY.TEAM.MODAL.ROLE_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.MEMBER}>{UI_COPY.TEAM.ROLES.MEMBER}</SelectItem>
            <SelectItem value={UserRole.DEVELOPER}>{UI_COPY.TEAM.ROLES.DEVELOPER}</SelectItem>
            <SelectItem value={UserRole.OPERATOR}>{UI_COPY.TEAM.ROLES.OPERATOR}</SelectItem>
            <SelectItem value={UserRole.ADMIN}>{UI_COPY.TEAM.ROLES.ADMIN}</SelectItem>
            <SelectItem value={UserRole.READ_ONLY}>{UI_COPY.TEAM.ROLES.READ_ONLY}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scoped App Access Checklist */}
      <div className="form-field-group">
        <Label className="form-field-label">{UI_COPY.TEAM.MODAL.APPLICATIONS_LABEL}</Label>
        <p className="form-field-hint">{UI_COPY.TEAM.MODAL.APPLICATIONS_DESCRIPTION}</p>
        <div className="invite-apps-grid">
          {apps.length === 0 ? (
            <p className="invite-apps-empty">{UI_COPY.TEAM.MODAL.NO_APPLICATIONS}</p>
          ) : (
            apps.map((app) => (
              <label key={app.id || app.appId} className="invite-app-item">
                <Checkbox
                  checked={allowedApps.includes(app.appId)}
                  onCheckedChange={(checked) => toggleApp(app.appId, !!checked)}
                />
                <span className="invite-app-name">{app.name}</span>
              </label>
            ))
          )}
        </div>
      </div>
    </form>
  );
};
