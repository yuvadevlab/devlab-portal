"use client";

/**
 * @file apps/web/src/components/layout/header-user-menu.tsx
 * @description Dynamic user profile dropdown displaying authenticated session details and sign-out controls.
 * @module @devlab/portal-web/components/layout/header-user-menu
 */

import React from "react";
import { ChevronDown, Settings2, LogOut } from "lucide-react";
import { Button, toast } from "@yuva-devlab/ui";
import { UI_COPY } from "@/lib/ui-copy";
import type { UserMember } from "@/lib/api-client";
import { UserRole } from "@/lib/constants/enums";

interface HeaderUserMenuProps {
  user?: UserMember | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigateSettings: () => void;
}

export const HeaderUserMenu: React.FC<HeaderUserMenuProps> = ({
  user,
  isOpen,
  onToggle,
  onClose,
  onNavigateSettings,
}) => {
  const userName = user?.name || "Member";
  const userEmail = user?.email || "";
  const userRole = user?.role || UserRole.MEMBER;

  // Derive initials from active user display name
  const initials =
    userName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleSignOut = () => {
    onClose();
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("devlab_access_token");
        localStorage.removeItem("devlab_auth_token");
        localStorage.removeItem("devlab_auth_user");
        document.cookie = "devlab_access_token=; path=/; max-age=0; SameSite=Lax";
      } catch {
        // Ignore storage errors on teardown
      }
      toast.info("Signed out of DevLab Portal");
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" className="gap-2 px-1" aria-label={userName} onClick={onToggle}>
        <span className="avatar">{initials}</span>
        <ChevronDown className="size-3" />
      </Button>

      {isOpen && (
        <div className="pop-menu">
          <div className="p-3">
            <strong className="text-foreground text-sm font-semibold">{userName}</strong>
            {userEmail && <p className="text-muted-foreground mt-0.5 text-xs">{userEmail}</p>}
            <span className="tag mt-2.5">{userRole}</span>
          </div>

          <div className="border-border border-t pt-1">
            <Button
              variant="ghost"
              className="menu-item"
              onClick={() => {
                onClose();
                onNavigateSettings();
              }}
            >
              <Settings2 className="mr-2 size-3.5" />
              {UI_COPY.COMMON.HEADER.ACCOUNT_SETTINGS}
            </Button>
            <Button variant="ghost" className="menu-item text-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 size-3.5" />
              {UI_COPY.COMMON.HEADER.SIGN_OUT}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
