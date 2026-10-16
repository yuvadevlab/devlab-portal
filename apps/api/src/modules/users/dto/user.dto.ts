/**
 * @file apps/api/src/modules/users/dto/user.dto.ts
 * @description Data transfer objects for User management and team invitations.
 * @module @devlab/portal-api/users/dto
 */

import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum UserRoleEnum {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  DEVELOPER = "developer",
  OPERATOR = "operator",
  READ_ONLY = "read_only",
  MEMBER = "member",
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role?: UserRoleEnum;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedApps?: string[];
}
