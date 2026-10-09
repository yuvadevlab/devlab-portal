"use client";

/**
 * @file apps/web/src/features/team/components/invite-member-modal.tsx
 * @description Modal dialog granting ecosystem control plane access and RBAC assignments.
 * Fully built with @yuva-devlab/ui Dialog, Label, Input, and Select components.
 * @module @devlab/portal-web/features/team/components/invite-member-modal
 */

import React, { useState } from "react";
import { Users, UserPlus, CheckCircle2 } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { UserRole } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { useInviteMember } from "@/features/team/api";

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
  const [isSuccess, setIsSuccess] = useState(false);

  const inviteMemberMutation = useInviteMember();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      return;
    }

    try {
      await inviteMemberMutation.mutateAsync({ name, email, role });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleClose();
        onSuccess();
      }, 1200);
    } catch (err) {
      logger.error("Failed to invite member:", err);
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg">
              <Users className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">{UI_COPY.TEAM.MODAL.TITLE}</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                {UI_COPY.TEAM.MODAL.DESCRIPTION}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-4 py-3">
          {isSuccess && (
            <div className="border-success/20 bg-success/10 text-success flex items-center gap-2 rounded-lg border p-3 text-xs">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{UI_COPY.TEAM.MODAL.SUCCESS_ALERT}</span>
            </div>
          )}

          <form id="invite-member-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-name" className="text-xs font-semibold">
                {UI_COPY.TEAM.MODAL.NAME_LABEL} *
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
                {UI_COPY.TEAM.MODAL.EMAIL_LABEL} *
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
                  <SelectValue placeholder="Select role..." />
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
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} className="h-9 text-xs">
            {UI_COPY.COMMON.ACTIONS.CANCEL}
          </Button>
          <Button
            type="submit"
            form="invite-member-form"
            disabled={inviteMemberMutation.isPending || !name || !email}
            className="bg-primary text-primary-foreground h-9 text-xs font-medium hover:opacity-90"
          >
            <UserPlus className="mr-1.5 size-3.5" />
            {inviteMemberMutation.isPending ? "Inviting..." : UI_COPY.COMMON.ACTIONS.INVITE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
