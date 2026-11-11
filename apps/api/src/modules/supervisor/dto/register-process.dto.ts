/**
 * @file apps/api/src/modules/supervisor/dto/register-process.dto.ts
 * @description Data transfer object for dynamically registering an application process for a tenant.
 * @module @devlab/portal-api/supervisor/dto
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsObject,
} from "class-validator";
import type { AppProcessConfig } from "@yuva-devlab/supervisor";

/**
 * Payload for registering a process dynamically under a tenant.
 */
export class RegisterProcessDto implements AppProcessConfig {
  @IsString()
  @IsNotEmpty()
  appId!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  workingDir!: string;

  @IsString()
  @IsNotEmpty()
  command!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  args?: string[];

  @IsObject()
  @IsOptional()
  env?: Record<string, string>;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ports?: number[];

  @IsString()
  @IsOptional()
  healthUrl?: string;

  @IsNumber()
  @IsOptional()
  readinessTimeoutMs?: number;

  @IsNumber()
  @IsOptional()
  gracefulShutdownTimeoutMs?: number;

  @IsBoolean()
  @IsOptional()
  autoRestartOnCrash?: boolean;

  @IsNumber()
  @IsOptional()
  maxCrashRestarts?: number;

  @IsString()
  @IsOptional()
  tenantId?: string;
}
