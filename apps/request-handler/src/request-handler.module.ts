import { Module } from '@nestjs/common';
import { RequestHandlerController } from './request-handler.controller';
import { RequestHandlerService } from './request-handler.service';
import { UniqueIdGeneratorModule } from '@aggregator/unique-id-generator';
import { CacheManagerModule } from '@aggregator/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '@aggregator/events';

@Module({
  imports: [
    UniqueIdGeneratorModule,
    CacheManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheManagerModule,
    EventsModule,
  ],
  controllers: [RequestHandlerController],
  providers: [RequestHandlerService],
})
export class RequestHandlerModule {}
