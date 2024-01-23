import { Module } from '@nestjs/common';
import { RequestHandlerController } from './request-handler.controller';
import { RequestHandlerService } from './request-handler.service';
import { UniqueIdGeneratorModule } from '@aggregator/unique-id-generator';
import { CacheManagerModule } from '@aggregator/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '@aggregator/events';
import { LoggerModule } from '@aggregator/logger';
import { SseManagerModule } from '@aggregator/sse-manager';

@Module({
  imports: [
    UniqueIdGeneratorModule,
    LoggerModule,
    CacheManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheManagerModule,
    EventsModule,
    SseManagerModule,
  ],
  controllers: [RequestHandlerController],
  providers: [RequestHandlerService],
})
export class RequestHandlerModule {}
