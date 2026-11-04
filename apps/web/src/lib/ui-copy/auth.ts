/**
 * @file apps/web/src/lib/ui-copy/auth.ts
 * @description Centralized authentication page copy, validation errors, metadata, and SSO toast messages.
 * @module @devlab/portal-web/ui-copy/auth
 */

export const AUTH_COPY = {
  BRAND: "Yuva DevLab",
  INITIALS_FALLBACK: "U",
  LOGIN: {
    TITLE: "Sign In — DevLab Portal",
    DESCRIPTION: "Sign in to your DevLab workspace control plane",
    SSO_CONNECTING: "Authorizing single sign-on…",
    SSO_BADGE_PREFIX: "Single Sign-On for",
    REDIRECTING_TO_APP: (appName: string) => `Redirecting you to ${appName}…`,
    REDIRECTING_TO_PORTAL: "Loading DevLab Portal workspace…",
    SSO_HANDOFF_TITLE: (name: string) => `Signed in as ${name}`,
    SSO_HANDOFF_DESC: (appName: string) => `Authorizing session and redirecting to ${appName}…`,
  },
  FORGOT_PASSWORD: {
    TITLE: "Forgot Password — DevLab Portal",
    DESCRIPTION: "Reset your DevLab workspace account password",
  },
  RESET_PASSWORD: {
    TITLE: "Set Password | DevLab Portal",
    DESCRIPTION: "Set or reset your DevLab workspace credentials.",
    SUCCESS_TITLE: "Password updated successfully!",
    REDIRECTING: "Redirecting you to login…",
    LOGIN_ACTION: "Go to Login",
    TOKEN_LABEL: "Token",
    TOKEN_PLACEHOLDER: "Paste your reset token here",
    NEW_PASSWORD_LABEL: "New Password",
    CREATE_PASSWORD_LABEL: "Create Password",
    CONFIRM_PASSWORD_LABEL: "Confirm Password",
    PASSWORD_PLACEHOLDER: "••••••••••••",
    SET_PASSWORD_ACTION: "Set Password & Complete Setup",
    RESET_PASSWORD_ACTION: "Reset Password",
    UPDATING_PASSWORD: "Updating password…",
    SET_ACCOUNT_TITLE: "Set Account Password",
    SET_ACCOUNT_DESCRIPTION: "Choose a secure password to access your DevLab workspace.",
    BACK_TO_SIGN_IN: "Back to sign in",
    LOADING: "Loading…",
    VALIDATION: {
      TOKEN_REQUIRED: "Reset or onboarding token is required.",
      PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long.",
      PASSWORDS_MISMATCH: "Passwords do not match.",
      RESET_FAILED: "Reset failed. The token may have expired.",
    },
  },
  TOAST: {
    DEFAULT_MEMBER_NAME: "Member",
    DEFAULT_APP_NAME: "DevLab Portal",
    SSO_LOGIN_SUCCESS_TITLE: (name: string) => `Welcome back, ${name}!`,
    SSO_LOGIN_SUCCESS_FALLBACK_TITLE: "Welcome back!",
    SSO_LOGIN_PORTAL_DESC: "Signed in to DevLab Central Identity. Unified control plane loaded.",
    SSO_LOGIN_REDIRECT_TITLE: (name: string) => `Signed in as ${name}`,
    SSO_LOGIN_REDIRECT_DESC: (appName: string) =>
      `Authorizing session and redirecting to ${appName}…`,
    LOGIN_ERROR_TITLE: "Sign-in failed",
    LOGIN_ERROR_DESC: "Invalid email or password. Please verify your credentials.",
    FORGOT_PASSWORD_SUCCESS_TITLE: "Password reset link dispatched",
    FORGOT_PASSWORD_SUCCESS_DESC: (email: string) =>
      `If an account exists for ${email}, recovery instructions have been sent.`,
    FORGOT_PASSWORD_ERROR_TITLE: "Password reset request failed",
    FORGOT_PASSWORD_ERROR_FALLBACK: "Failed to dispatch password recovery request.",
    RESET_PASSWORD_SUCCESS_TITLE: "Password updated successfully",
    RESET_PASSWORD_SUCCESS_DESC:
      "Your account credentials have been securely updated. Redirecting to login…",
    RESET_PASSWORD_LOGIN_HINT: "Credentials updated. Please sign in with your new password.",
    RESET_PASSWORD_ERROR_TITLE: "Password update failed",
    SIGNED_OUT_TITLE: "Signed out",
    SIGNED_OUT_DESC: "You have been securely signed out of DevLab Portal.",
    SESSION_EXPIRED_TITLE: "Session expired",
    SESSION_EXPIRED_DESC: "Your session has ended. Please sign in again to continue.",
  },
} as const;
