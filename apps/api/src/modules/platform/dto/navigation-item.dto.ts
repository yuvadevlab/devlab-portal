/**
 * @file apps/api/src/modules/platform/dto/navigation-item.dto.ts
 * @description Data Transfer Object and GraphQL Object Type for DB-driven navigation menus.
 * @module @devlab/portal-api/platform/dto
 */

import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class NavigationItemDto {
  @Field(() => ID)
  id!: string;

  @Field()
  key!: string;

  @Field()
  label!: string;

  @Field()
  icon!: string;

  @Field(() => Int)
  order!: number;

  @Field()
  isEnabled!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
