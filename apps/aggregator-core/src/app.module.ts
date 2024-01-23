import { Module } from '@nestjs/common';
import { AggregatorCoreController } from './app.controller';
import { AggregatorCoreService } from './app.service';
import { DbManagerModule } from '@aggregator/db-manager';
import { LoggerModule } from '@aggregator/logger';
import { SqsManagerModule } from '@aggregator/sqs-manager';
import { Listener } from './listener';
import { EventsModule } from '@aggregator/events';

@Module({
  imports: [
    DbManagerModule,
    LoggerModule,
    SqsManagerModule.forRoot({ url: process.env.AGGREGATOR_CORE_LISTENER_SQS }),
    EventsModule,
  ],
  controllers: [AggregatorCoreController],
  providers: [AggregatorCoreService, Listener],
})
export class AggregatorCoreModule {}
