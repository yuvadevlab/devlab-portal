/**
 * @file apps/web/src/lib/ui-copy/auth.ts
 * @description Centralized authentication page copy, validation errors, and metadata.
 * @module @devlab/portal-web/ui-copy/auth
 */

export const AUTH_COPY = {
  BRAND: "Yuva DevLab",
  LOGIN: {
    TITLE: "Sign In — DevLab Portal",
    DESCRIPTION: "Sign in to your DevLab workspace control plane",
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
} as const;
