/**
 * @file apps/api/src/modules/api-keys/dto/api-key.dto.ts
 * @description Data Transfer Objects and GraphQL types for Scoped M2M API Keys.
 * @module @devlab/portal-api/api-keys/dto
 */

import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType()
export class CreateApiKeyDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  appId!: string;

  @Field(() => [String])
  @IsArray()
  scopes!: string[];

  @Field(() => Int, { defaultValue: 600 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  rateLimitRpm: number = 600;

  @Field({ nullable: true })
  @IsOptional()
  expiresAt?: string;
}

@ObjectType()
export class ApiKeyType {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  keyPrefix!: string;

  @Field()
  appId!: string;

  @Field(() => [String])
  scopes!: string[];

  @Field(() => Int)
  rateLimitRpm!: number;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field({ nullable: true })
  lastUsedAt?: Date;

  @Field()
  isRevoked!: boolean;

  @Field()
  createdAt!: Date;
}

@ObjectType()
export class ApiKeyWithSecretType extends ApiKeyType {
  @Field()
  rawKey!: string;
}
