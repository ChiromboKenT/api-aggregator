import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { SnsManagerModule } from '@aggregator/sns-manager';
import { LoggerModule } from '@aggregator/logger';

@Module({
  imports: [
    SnsManagerModule.forRoot({
      arn: process.env.EVENT_BUS_SNS,
    }),
    LoggerModule,
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
