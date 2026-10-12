/**
 * @file apps/web/src/features/team/components/invite-member-modal.tsx
 * @description Modal dialog for inviting new team members to the workspace.
 * Adheres strictly to Sonner promise toast standard across FinAI and OrchestrAI.
 * @module @devlab/portal-web/features/team/components/invite-member-modal
 */

import React, { useState } from "react";
import { Users, UserPlus, CheckCircle2, Copy, Check } from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  toast,
} from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { UserRole } from "@/lib/constants";
import { useInviteMember } from "@/features/team/api";
import { InviteMemberForm } from "./invite-member-form";

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
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inviteMemberMutation = useInviteMember();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      return;
    }

    const promise = inviteMemberMutation.mutateAsync({ name, email, role });
    toast.promise(promise, {
      loading: `Inviting ${name} (${email})...`,
      success: (result) => {
        setIsSuccess(true);
        if (result.inviteUrl) {
          setCreatedInviteUrl(result.inviteUrl);
        } else {
          setTimeout(() => {
            handleClose();
            onSuccess();
          }, 1200);
        }
        return `Invitation created for ${email}`;
      },
      error: (err: unknown) => (err instanceof Error ? err.message : "Failed to invite member"),
    });
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setRole(UserRole.DEVELOPER);
    setIsSuccess(false);
    setCreatedInviteUrl(null);
    setCopied(false);
    onClose();
  };

  const handleCopyLink = () => {
    if (createdInviteUrl) {
      void navigator.clipboard.writeText(createdInviteUrl);
      setCopied(true);
      toast.success("Invite link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
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

          {createdInviteUrl && (
            <div className="bg-secondary/70 border-border space-y-2 rounded-lg border p-3 text-xs">
              <p className="text-primary font-medium">
                🛠 Dev mode — use this link to onboard member:
              </p>
              <div className="flex items-center gap-2">
                <Input readOnly value={createdInviteUrl} className="h-8 font-mono text-[11px]" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 text-xs"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          )}

          {!createdInviteUrl && (
            <InviteMemberForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              role={role}
              setRole={setRole}
              onSubmit={handleSubmit}
            />
          )}
        </DialogBody>

        <DialogFooter>
          {createdInviteUrl ? (
            <Button
              type="button"
              className="h-9 text-xs"
              onClick={() => {
                handleClose();
                onSuccess();
              }}
            >
              Done
            </Button>
          ) : (
            <>
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
                {inviteMemberMutation.isPending
                  ? UI_COPY.COMMON.ACTIONS.INVITING
                  : UI_COPY.COMMON.ACTIONS.INVITE}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
