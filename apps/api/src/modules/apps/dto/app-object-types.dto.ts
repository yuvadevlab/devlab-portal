/**
 * @file apps/api/src/modules/apps/dto/app-object-types.dto.ts
 * @description GraphQL Object Types for Registered Apps and subscription payloads.
 * @module @devlab/portal-api/apps/dto
 */

import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

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

  @Field({ nullable: true })
  workingDir?: string;

  @Field({ nullable: true })
  devCommand?: string;

  @Field({ nullable: true })
  buildCommand?: string;

  @Field({ nullable: true })
  startCommand?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  envVars?: Record<string, unknown>;

  @Field(() => [String], { nullable: true })
  dependsOn?: string[];

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
