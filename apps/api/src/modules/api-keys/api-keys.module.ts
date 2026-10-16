/**
 * @file apps/api/src/modules/api-keys/api-keys.module.ts
 * @description Module bundling API keys service, controller, and GraphQL resolver.
 * @module @devlab/portal-api/api-keys
 */

import { Module } from "@nestjs/common";
import { ApiKeysService } from "./api-keys.service";
import { ApiKeysController } from "./api-keys.controller";
import { ApiKeysResolver } from "./api-keys.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, ApiKeysResolver],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
