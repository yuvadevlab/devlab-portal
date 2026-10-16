/**
 * @file apps/api/src/modules/platform/dto/tenant.dto.ts
 * @description Data Transfer Object for creating new workspace tenant identities.
 * @module @devlab/portal-api/platform/dto
 */

import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  plan?: string;
}
