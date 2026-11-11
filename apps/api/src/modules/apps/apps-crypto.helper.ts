/**
 * @file apps/api/src/modules/apps/apps-crypto.helper.ts
 * @description Cryptographic helper functions for client secret generation and password hashing.
 * @module @devlab/portal-api/apps
 */

import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export interface ProvisionedSecret {
  rawSecret: string;
  secretHash: string;
}

/**
 * Generates and hashes client secret for OAuth application provisioning.
 *
 * @param explicitSecret - Optional pre-defined client secret
 * @returns Object containing plain rawSecret and bcrypt secretHash
 */
export async function provisionClientSecret(explicitSecret?: string): Promise<ProvisionedSecret> {
  const rawSecret = explicitSecret || `dl_sec_${crypto.randomBytes(24).toString("hex")}`;
  const secretHash = await bcrypt.hash(rawSecret, 10);
  return { rawSecret, secretHash };
}
