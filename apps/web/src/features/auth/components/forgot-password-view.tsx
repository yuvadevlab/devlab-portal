"use client";

/**
 * @file apps/web/src/features/auth/components/forgot-password-view.tsx
 * @description Interactive client view for portal password recovery.
 * @module @devlab/portal-web/features/auth
 */

import React from "react";
import { ForgotPassword } from "@yuva-devlab/auth-client";

export const ForgotPasswordView: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

  return <ForgotPassword apiBaseUrl={apiBaseUrl} signInUrl="/login" />;
};
