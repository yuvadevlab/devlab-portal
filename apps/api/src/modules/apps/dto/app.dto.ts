/**
 * @file apps/api/src/modules/apps/dto/app.dto.ts
 * @description Data Transfer Objects and input types for Registered Apps and Kill-Switch events.
 * @module @devlab/portal-api/apps/dto
 */

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

export { RegisteredAppType, AppStatusChangedPayload } from "./app-object-types.dto";

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  workingDir?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  devCommand?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  buildCommand?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  startCommand?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsObject()
  @IsOptional()
  envVars?: Record<string, unknown>;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  dependsOn?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  maintenanceNote?: string;
}

@InputType()
export class UpdateAppSettingsDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  appId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  iconUrl?: string;

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
  @IsEnum(AppEnvironmentEnum)
  @IsOptional()
  environment?: AppEnvironmentEnum;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  maintenanceNote?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  workingDir?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  devCommand?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  buildCommand?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  startCommand?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsObject()
  @IsOptional()
  envVars?: Record<string, unknown>;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  dependsOn?: string[];
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
