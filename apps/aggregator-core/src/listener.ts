import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AggregatorCoreService } from './app.service';
import { EventsService, SNSMessage } from '@aggregator/events';
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

    for await (const {
      body,
      ack,
    } of this.sqsManagerService.listen<SNSMessage>()) {
      this.logger.debug('Received message', { body });

      const { actionType, requestId, payload } = body;

      await this.appService.saveEventToDynamoDB(body);

      this.logger.debug(`Message of type:${actionType} processed!`);

      const completion = await this.appService.checkCompletion(requestId);

      if (completion) {
        await this.eventBus.sendEvent(
          {
            requestId,
            actionType: 'aggregated',
            serviceName: 'AGGREGATOR_SERVICE  ',
            payload: {
              message: 'Request Aggregated',
              data: {},
              clientId: payload.clientId,
            },
          },
          Events.API_AGGREGATED,
        );
        this.logger.debug(
          `Message of type ${Events.API_AGGREGATED} sent to queue`,
        );
      }
      await ack();
    }
  }
}
