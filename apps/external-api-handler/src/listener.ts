import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ActionsDictionary } from './api-actions/actions-dictionary';

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

    for await (const { body, ack } of this.sqsManagerService.listen<any>()) {
      this.logger.debug('Received message', { body });

      const { actionType, payload } = body;
      try {
        const app = this.actionsDictionary.get(actionType);
        await app.run(payload);
      } catch (error) {
        this.logger.trace('Error processing entity', error);
      }
      this.logger.debug(`Message of type:${actionType} processed!`);
      await ack();
    }
  }
}