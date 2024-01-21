import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class Listener {
  constructor(
    @Inject(SqsManagerService)
    private readonly sqsManagerService: SqsManagerService,
    private readonly logger: LoggerService,
  ) {}
  async start() {
    this.logger.debug('Start listening on queue... ');

    for await (const { body, ack } of this.sqsManagerService.listen<any>()) {
      this.logger.debug('Received message', { body });
      ack();
    }
  }
}
