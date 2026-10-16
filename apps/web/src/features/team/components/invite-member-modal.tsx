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
import { UserRole } from "@/lib/constants/enums";
import type { RegisteredApp } from "@/lib/api-client";
import { useInviteMember } from "@/features/team/api";
import { useAppsQuery } from "@/features/apps/api";
import { InviteMemberForm } from "./invite-member-form";

/**
 * Interface configuring the modal visibility and callback state.
 */
export interface InviteMemberModalProps {
  /** Optional pre-fetched registered applications catalog */
  apps?: RegisteredApp[];
  /** Controls open/closed visibility of the dialog */
  isOpen: boolean;
  /** Callback fired upon modal dismissal or cancellation */
  onClose: () => void;
  /** Callback fired upon successful member onboarding */
  onSuccess: () => void;
}

/**
 * Modal dialog component managing member invitation state, promise toast feedback,
 * and dev-mode onboarding URL retrieval.
 *
 * @param props - Component configuration satisfying {@link InviteMemberModalProps}
 * @returns React modal dialog element
 */
export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  apps: propApps,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(UserRole.MEMBER);
  // Zero default allowed apps — explicit admin selection required
  const [allowedApps, setAllowedApps] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInviteUrl, setCreatedInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fallback to active query cache if apps not injected via props
  const { data: queriedApps = [] } = useAppsQuery();
  const apps = propApps && propApps.length > 0 ? propApps : queriedApps;

  const inviteMemberMutation = useInviteMember();

  /**
   * Dispatches the member creation mutation and shows toast notifications.
   *
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // Guard against submission without name or email
    if (!name || !email) {
      return;
    }

    const promise = inviteMemberMutation.mutateAsync({ name, email, role, allowedApps });
    toast.promise(promise, {
      loading: `Inviting ${name} (${email})...`,
      success: (result) => {
        setIsSuccess(true);
        // If an invite link is returned (dev environment), surface for quick copying
        if (result.inviteUrl) {
          setCreatedInviteUrl(result.inviteUrl);
        } else {
          // In production, automatically close dialog after success
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

  /**
   * Resets all internal dialog form states and notifies parent component.
   */
  const handleClose = () => {
    setName("");
    setEmail("");
    setRole(UserRole.MEMBER);
    setAllowedApps([]);
    setIsSuccess(false);
    setCreatedInviteUrl(null);
    setCopied(false);
    onClose();
  };

  /**
   * Copies the generated dev-mode onboarding URL to the user clipboard.
   */
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
          {/* Success banner */}
          {isSuccess && (
            <div className="border-success/20 bg-success/10 text-success flex items-center gap-2 rounded-lg border p-3 text-xs">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{UI_COPY.TEAM.MODAL.SUCCESS_ALERT}</span>
            </div>
          )}

          {/* Dev-mode quick onboarding link */}
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

          {/* Main invite inputs */}
          {!createdInviteUrl && (
            <InviteMemberForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              role={role}
              setRole={setRole}
              apps={apps}
              allowedApps={allowedApps}
              setAllowedApps={setAllowedApps}
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
