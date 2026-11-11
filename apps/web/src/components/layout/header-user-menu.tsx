"use client";

/**
 * @file apps/web/src/components/layout/header-user-menu.tsx
 * @description Dynamic user profile dropdown displaying authenticated session details and sign-out controls.
 * @module @devlab/portal-web/components/layout/header-user-menu
 */

import React from "react";
import { ChevronDown, Settings2, LogOut } from "lucide-react";
import { Button } from "@devlab-portal/ui";
import { UI_COPY } from "@/lib/ui-copy";
import { AUTH_COPY } from "@/lib/ui-copy/auth";
import { setPendingAuthToast, AuthToastType } from "@/features/auth";
import { purgeClientSession, type UserMember } from "@/lib/api-client";
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
  const userName = user?.name || UI_COPY.COMMON.HEADER.MEMBER_FALLBACK;
  const userEmail = user?.email || "";
  const userRole = user?.role || UserRole.MEMBER;

  // Derive initials from active user display name
  const initials =
    userName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || AUTH_COPY.INITIALS_FALLBACK;

  const handleSignOut = () => {
    onClose();
    setPendingAuthToast({
      type: AuthToastType.INFO,
      title: AUTH_COPY.TOAST.SIGNED_OUT_TITLE,
      description: AUTH_COPY.TOAST.SIGNED_OUT_DESC,
    });
    purgeClientSession();
  };

  return (
    <div className="user-menu-wrap">
      <Button
        variant="ghost"
        className="user-menu-trigger"
        aria-label={userName}
        onClick={onToggle}
      >
        <span className="avatar">{initials}</span>
        <ChevronDown className="user-menu-chevron" />
      </Button>

      {isOpen && (
        <div className="pop-menu">
          <div className="user-menu-header">
            <strong className="user-menu-name">{userName}</strong>
            {userEmail && <p className="user-menu-email">{userEmail}</p>}
            <span className="tag tag-role">{userRole}</span>
          </div>

          <div className="user-menu-actions">
            <Button
              variant="ghost"
              className="menu-item"
              onClick={() => {
                onClose();
                onNavigateSettings();
              }}
            >
              <Settings2 className="menu-item-icon" />
              {UI_COPY.COMMON.HEADER.ACCOUNT_SETTINGS}
            </Button>
            <Button
              variant="ghost"
              className="menu-item menu-item-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="menu-item-icon" />
              {UI_COPY.COMMON.HEADER.SIGN_OUT}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
