import { Module } from '@nestjs/common';
import { ExternalApiHandlerController } from './app.controller';
import { ExternalApiHandlerService } from './app.service';
import { SqsManagerModule } from '@aggregator/sqs-manager';
import { LoggerModule } from '@aggregator/logger';
import { ActionsModule } from './api-actions/actions.module';
import { Listener } from './listener';

@Module({
  imports: [
    SqsManagerModule.forRoot({ url: process.env.EXTERNAL_API_LISTENER_SQS }),
    LoggerModule,
    ActionsModule,
  ],
  controllers: [ExternalApiHandlerController],
  providers: [Listener, ExternalApiHandlerService],
})
export class ExternalApiHandlerModule {}
