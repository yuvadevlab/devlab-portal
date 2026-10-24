/**
 * @file apps/api/src/modules/apps/dto/app.dto.ts
 * @description Data Transfer Objects and GraphQL Object Types for Registered Apps and Kill-Switch events.
 * @module @devlab/portal-api/apps/dto
 */

import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "@nestjs/graphql";

export enum AppEnvironmentEnum {
  LOCAL_DEV = "local_dev",
  STAGING = "staging",
  PRODUCTION = "production",
}

@InputType()
export class CreateAppDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  appId!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  iconUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  themeColor?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  originUrl!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  apiUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  callbackUrls?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  healthUrl?: string;

  @Field({ nullable: true })
  @IsEnum(AppEnvironmentEnum)
  @IsOptional()
  environment?: AppEnvironmentEnum;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  clientSecret?: string;
}

@InputType()
export class UpdateAppSettingsDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  themeColor?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  originUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  apiUrl?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  callbackUrls?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  healthUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  maintenanceNote?: string;
}

@InputType()
export class UpdateAppStatusDto {
  @Field()
  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  maintenanceNote?: string;
}

@ObjectType()
export class RegisteredAppType {
  @Field()
  id!: string;

  @Field()
  appId!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  iconUrl?: string;

  @Field({ nullable: true })
  themeColor?: string;

  @Field()
  originUrl!: string;

  @Field({ nullable: true })
  apiUrl?: string;

  @Field(() => [String])
  callbackUrls!: string[];

  @Field()
  healthUrl!: string;

  @Field()
  environment!: string;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  maintenanceNote?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  latencyMs?: number;

  @Field({ nullable: true })
  healthStatus?: string;
}

@ObjectType()
export class AppStatusChangedPayload {
  @Field()
  appId!: string;

  @Field()
  name!: string;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  maintenanceNote?: string;

  @Field()
  updatedAt!: Date;
}
