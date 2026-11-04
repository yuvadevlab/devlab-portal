"use client";

/**
 * @file apps/web/src/features/auth/components/reset-password-inputs.tsx
 * @description Form input fields and submission trigger for the password reset form.
 * @module @devlab/portal-web/features/auth/components
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { AuthInput } from "@yuva-devlab/auth-client";
import { UI_COPY } from "@/lib/ui-copy";
import { AuthFormField } from "../types";

export interface ResetPasswordInputsProps {
  token: string;
  showTokenInput: boolean;
  onTokenChange: (val: string) => void;
  password: string;
  onPasswordChange: (val: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (val: string) => void;
  loading: boolean;
  isWelcome: boolean;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

/**
 * Encapsulated password fields and submission button using design system AuthInput primitives.
 */
export function ResetPasswordInputs({
  token,
  showTokenInput,
  onTokenChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  loading,
  isWelcome,
  onSubmit,
}: ResetPasswordInputsProps): React.JSX.Element {
  const copy = UI_COPY.AUTH.RESET_PASSWORD;

  return (
    <form onSubmit={onSubmit} className="dl-auth-form">
      {showTokenInput && (
        <AuthInput
          id="devlab-reset-token"
          name={AuthFormField.TOKEN}
          label={copy.TOKEN_LABEL}
          type="text"
          required
          value={token}
          onChange={(e) => onTokenChange(e.target.value)}
          placeholder={copy.TOKEN_PLACEHOLDER}
        />
      )}

      <AuthInput
        id="devlab-reset-password"
        name={AuthFormField.NEW_PASSWORD}
        label={isWelcome ? copy.CREATE_PASSWORD_LABEL : copy.NEW_PASSWORD_LABEL}
        isPassword
        required
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder={copy.PASSWORD_PLACEHOLDER}
      />

      <AuthInput
        id="devlab-confirm-password"
        name={AuthFormField.CONFIRM_PASSWORD}
        label={copy.CONFIRM_PASSWORD_LABEL}
        isPassword
        required
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        placeholder={copy.PASSWORD_PLACEHOLDER}
      />

      <button type="submit" disabled={loading} className="dl-auth-submit-btn">
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>{copy.UPDATING_PASSWORD}</span>
          </>
        ) : (
          <span>{isWelcome ? copy.SET_PASSWORD_ACTION : copy.RESET_PASSWORD_ACTION}</span>
        )}
      </button>
    </form>
  );
}
