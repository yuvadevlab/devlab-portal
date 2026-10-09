/**
 * @file apps/web/src/features/team/components/invite-member-modal.tsx
 * @description Modal dialog granting ecosystem control plane access and RBAC assignments.
 * @module @devlab/portal-web/features/team/components/invite-member-modal
 */

import React, { useState } from "react";
import { Users, X, UserPlus, CheckCircle2 } from "lucide-react";
import { Button, Input } from "@yuva-devlab/ui";
import { UI_COPY } from "../../../lib/ui-copy/index";
import { UserRole } from "../../../lib/constants/enums";
import { api } from "../../../lib/api-client";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(UserRole.DEVELOPER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createUser({ name, email, role });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleClose();
        onSuccess();
      }, 1200);
    } catch (err) {
      console.error("Failed to invite member:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setRole(UserRole.DEVELOPER);
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="border-border bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold">{UI_COPY.TEAM.MODAL.TITLE}</h3>
              <p className="text-muted-foreground text-xs">{UI_COPY.TEAM.MODAL.DESCRIPTION}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:bg-background hover:text-foreground rounded-lg p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form id="invite-member-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
          {isSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{UI_COPY.TEAM.MODAL.SUCCESS_ALERT}</span>
            </div>
          )}

          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {UI_COPY.TEAM.MODAL.NAME_LABEL} *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={UI_COPY.TEAM.MODAL.NAME_PLACEHOLDER}
              required
              className="bg-background border-border h-9 text-xs"
            />
          </div>

          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {UI_COPY.TEAM.MODAL.EMAIL_LABEL} *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={UI_COPY.TEAM.MODAL.EMAIL_PLACEHOLDER}
              required
              className="bg-background border-border h-9 font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-foreground mb-1 block text-xs font-semibold">
              {UI_COPY.TEAM.MODAL.ROLE_LABEL}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border-border bg-background text-foreground focus:ring-primary h-9 w-full rounded-md border px-3 py-1.5 text-xs focus:ring-1"
            >
              <option value={UserRole.DEVELOPER}>{UI_COPY.TEAM.ROLES.DEVELOPER}</option>
              <option value={UserRole.OPERATOR}>{UI_COPY.TEAM.ROLES.OPERATOR}</option>
              <option value={UserRole.ADMIN}>{UI_COPY.TEAM.ROLES.ADMIN}</option>
              <option value={UserRole.READ_ONLY}>{UI_COPY.TEAM.ROLES.READ_ONLY}</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="border-border mt-6 flex items-center justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-border h-9 text-xs"
          >
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>
          <Button
            type="submit"
            form="invite-member-form"
            disabled={isSubmitting || !name || !email}
            className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            {isSubmitting ? "Inviting..." : UI_COPY.COMMON.ACTIONS.INVITE}
          </Button>
        </div>
      </div>
    </div>
  );
};
