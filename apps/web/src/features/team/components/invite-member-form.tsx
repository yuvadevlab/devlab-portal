/**
 * @file apps/web/src/features/team/components/invite-member-form.tsx
 * @description Form inputs for inviting and onboarding team members with RBAC roles.
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
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { UserRole } from "@/lib/constants";

export interface InviteMemberFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const InviteMemberForm: React.FC<InviteMemberFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  onSubmit,
}) => {
  return (
    <form id="invite-member-form" onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="invite-name" className="text-xs font-semibold">
          {UI_COPY.TEAM.MODAL.NAME_LABEL}
        </Label>
        <Input
          id="invite-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={UI_COPY.TEAM.MODAL.NAME_PLACEHOLDER}
          required
          className="h-9 text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="invite-email" className="text-xs font-semibold">
          {UI_COPY.TEAM.MODAL.EMAIL_LABEL}
        </Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={UI_COPY.TEAM.MODAL.EMAIL_PLACEHOLDER}
          required
          className="h-9 font-mono text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="invite-role" className="text-xs font-semibold">
          {UI_COPY.TEAM.MODAL.ROLE_LABEL}
        </Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="invite-role" className="h-9 w-full text-xs">
            <SelectValue placeholder={UI_COPY.TEAM.MODAL.ROLE_PLACEHOLDER} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.DEVELOPER}>{UI_COPY.TEAM.ROLES.DEVELOPER}</SelectItem>
            <SelectItem value={UserRole.OPERATOR}>{UI_COPY.TEAM.ROLES.OPERATOR}</SelectItem>
            <SelectItem value={UserRole.ADMIN}>{UI_COPY.TEAM.ROLES.ADMIN}</SelectItem>
            <SelectItem value={UserRole.READ_ONLY}>{UI_COPY.TEAM.ROLES.READ_ONLY}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
