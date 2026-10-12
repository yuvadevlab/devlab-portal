/**
 * @file apps/api/src/modules/redis/redis.module.ts
 * @description Global module providing RedisService for caching and event streaming.
 * @module @devlab/portal-api/redis
 */

import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
