/**
 * @file apps/api/src/modules/audit/dto/audit.dto.ts
 * @description GraphQL Object Types and query parameters for security audit ledger.
 * @module @devlab/portal-api/audit/dto
 */

import { Field, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@ObjectType()
export class AuditActorType {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class AuditLogType {
  @Field()
  id!: string;

  @Field()
  action!: string;

  @Field()
  actorId!: string;

  @Field(() => AuditActorType, { nullable: true })
  actor?: AuditActorType;

  @Field()
  targetType!: string;

  @Field()
  targetId!: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown>;

  @Field()
  ipAddress!: string;

  @Field()
  userAgent!: string;

  @Field()
  createdAt!: Date;
}
