/**
 * @file apps/api/src/modules/auth/dto/auth.dto.ts
 * @description Data Transfer Objects for OIDC authorization, direct login, and token exchange.
 * @module @devlab/portal-api/auth/dto
 */

import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class AuthorizeDto {
  @IsString()
  @IsNotEmpty()
  client_id!: string;

  @IsString()
  @IsNotEmpty()
  redirect_uri!: string;

  @IsString()
  @IsNotEmpty()
  response_type!: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  code_challenge?: string;

  @IsString()
  @IsOptional()
  code_challenge_method?: string;
}

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  grant_type!: string;

  @IsString()
  @IsOptional()
  client_id?: string;

  @IsString()
  @IsOptional()
  client_secret?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  code_verifier?: string;

  @IsString()
  @IsOptional()
  redirect_uri?: string;

  @IsString()
  @IsOptional()
  refresh_token?: string;
}
