"use client";

/**
 * @file apps/web/src/features/auth/components/login-view.tsx
 * @description Interactive client view for portal sign-in with enterprise invite-only notice.
 * @module @devlab/portal-web/features/auth
 */

import React from "react";
import { SignIn } from "@yuva-devlab/auth-client";

export const LoginView: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3015";

  return <SignIn apiBaseUrl={apiBaseUrl} redirectTo="/" forgotPasswordUrl="/forgot-password" />;
};
