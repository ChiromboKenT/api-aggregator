import { Module } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@aggregator/logger';

/*
 * The CacheManagerModule is responsible for creating a CacheManagerService
 * instance and exporting it for use in other modules.
 *
 * The CacheManagerModule uses the RedisModule to create a Redis client
 * instance. The Redis client is configured using the REDIS_URL environment
 * variable. If the REDIS_URL environment variable is not set, the Redis client
 * will default to connecting to localhost:6379.
 *
 * The CacheManagerModule uses the ConfigModule to access environment variables
 * and the ConfigService to access environment variables.
 *
 * The CacheManagerModule is imported by the RequestHandlerModule.
 */

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        const url =
          configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        return {
          config: {
            url,
          },
        };
      },
    }),
  ],

  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
