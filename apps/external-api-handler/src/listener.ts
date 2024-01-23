import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ActionsDictionary } from './api-actions/actions-dictionary';
import { Events } from '@aggregator/events/events';

@Injectable()
export class Listener {
  constructor(
    @Inject(ActionsDictionary)
    private readonly actionsDictionary: ActionsDictionary,
    @Inject(SqsManagerService)
    private readonly sqsManagerService: SqsManagerService,
    private readonly logger: LoggerService,
  ) {}
  async start() {
    this.logger.debug('Start listening on queue... ');

    for await (const {
      body,
      attributes,
      ack,
    } of this.sqsManagerService.listen<any>()) {
      this.logger.debug('Received message', { body });

      const { actionType, payload } = body;
      const app = this.actionsDictionary.get(actionType);

      switch (attributes.EVENT) {
        case Events.AGGREGATOR_TRIGGERED:
          try {
            await app.run(body);
          } catch (error) {
            this.logger.trace('Error processing entity', error);
          }

          break;
        case Events.API_REQUESTED:
          try {
            if (payload.requestType === 'ALL') {
              await app.handleGetAllGames(body);
            } else {
              await app.handleGetGameById(body);
            }
          } catch (error) {
            this.logger.trace('Error processing External API request', error);
          }

        default:
          break;
      }
      this.logger.debug(`Message of type:${actionType} processed!`);
      await ack();
    }
  }
}
