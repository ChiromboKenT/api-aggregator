import { Module } from '@nestjs/common';

import { LoggerModule } from '@aggregator/logger';
import { EventsModule } from '@aggregator/events';
import { SqsManagerModule } from '@aggregator/sqs-manager';
import { DbManagerModule } from '@aggregator/db-manager';
import { Listener } from './listener';
import { SseManagerModule } from '@aggregator/sse-manager';

@Module({
  imports: [
    SqsManagerModule.forRoot({ url: process.env.BROADCASTER_LISTENER_SQS }),
    DbManagerModule,
    LoggerModule,
    EventsModule,
    SseManagerModule,
  ],
  controllers: [],
  providers: [Listener],
})
export class BroadcasterModule {}
