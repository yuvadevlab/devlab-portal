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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--foreground)]">
                {UI_COPY.TEAM.MODAL.TITLE}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {UI_COPY.TEAM.MODAL.DESCRIPTION}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
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
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              {UI_COPY.TEAM.MODAL.NAME_LABEL} *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={UI_COPY.TEAM.MODAL.NAME_PLACEHOLDER}
              required
              className="bg-[var(--background)] border-[var(--border)] text-xs h-9"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              {UI_COPY.TEAM.MODAL.EMAIL_LABEL} *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={UI_COPY.TEAM.MODAL.EMAIL_PLACEHOLDER}
              required
              className="bg-[var(--background)] border-[var(--border)] text-xs h-9 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              {UI_COPY.TEAM.MODAL.ROLE_LABEL}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] h-9 focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value={UserRole.DEVELOPER}>{UI_COPY.TEAM.ROLES.DEVELOPER}</option>
              <option value={UserRole.OPERATOR}>{UI_COPY.TEAM.ROLES.OPERATOR}</option>
              <option value={UserRole.ADMIN}>{UI_COPY.TEAM.ROLES.ADMIN}</option>
              <option value={UserRole.READ_ONLY}>{UI_COPY.TEAM.ROLES.READ_ONLY}</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="text-xs h-9 border-[var(--border)]"
          >
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>
          <Button
            type="submit"
            form="invite-member-form"
            disabled={isSubmitting || !name || !email}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 text-xs h-9 font-medium"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            {isSubmitting ? "Inviting..." : UI_COPY.COMMON.ACTIONS.INVITE}
          </Button>
        </div>
      </div>
    </div>
  );
};
