/**
 * @file apps/api/src/common/decorators/current-user.decorator.ts
 * @description Parameter decorator extracting authenticated user from HTTP/GraphQL request.
 * @module @devlab/portal-api/common/decorators
 */

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  if (context.getType() === "http") {
    return context.switchToHttp().getRequest().user;
  }
  const ctx = context.getArgs()[2];
  return ctx?.req?.user;
});
