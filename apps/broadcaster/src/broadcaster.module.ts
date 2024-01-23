import { Module } from '@nestjs/common';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterService } from './broadcaster.service';
import { SseManagerModule } from '@aggregator/sse-manager';
import { LoggerModule } from '@aggregator/logger';
import { EventsModule } from '@aggregator/events';
import { SqsManagerModule } from '@aggregator/sqs-manager';
import { DbManagerModule } from '@aggregator/db-manager';

@Module({
  imports: [
    SseManagerModule,
    SqsManagerModule,
    DbManagerModule,
    LoggerModule,
    EventsModule,
  ],
  controllers: [BroadcasterController],
  providers: [BroadcasterService],
})
export class BroadcasterModule {}
