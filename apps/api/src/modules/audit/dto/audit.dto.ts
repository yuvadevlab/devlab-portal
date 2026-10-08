/**
 * @file apps/api/src/modules/audit/dto/audit.dto.ts
 * @description GraphQL Object Types and query parameters for security audit ledger.
 * @module @devlab/portal-api/audit/dto
 */

import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLScalarType, Kind } from "graphql";

export const GraphQLJSON = new GraphQLScalarType({
  name: "JSON",
  description: "Arbitrary JSON value",
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        return ast.value;
      }
    }
    return null;
  },
});

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
  createdAt!: Date;
}
