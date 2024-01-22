import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AggregatorCoreService } from './app.service';
import { EventsService } from '@aggregator/events';
import { Events } from '@aggregator/events/events';

@Injectable()
export class Listener {
  constructor(
    @Inject(SqsManagerService)
    private readonly sqsManagerService: SqsManagerService,
    private readonly logger: LoggerService,
    private readonly appService: AggregatorCoreService,
    @Inject(EventsService) private readonly eventBus: EventsService,
  ) {}
  async start() {
    this.logger.debug('Start listening on queue... ');

    for await (const { body, ack } of this.sqsManagerService.listen<any>()) {
      this.logger.debug('Received message', { body });

      const { actionType, payload } = body;
      await this.appService.saveEventToDynamoDB(payload);

      const completion = await this.appService.checkCompletion(body.requestId);

      if (completion) {
        await this.eventBus.sendEvent(
          {
            requestId: body.requestId,
            actionType: 'aggregated',
            serviceName: 'AGGREGATOR_SERVICE  ',
          },
          Events.API_AGGREGATED,
        );
        this.logger.debug('Aggregator Request completed');
      }

      this.logger.debug(`Message of type:${actionType} processed!`);
      await ack();
    }
  }
}
