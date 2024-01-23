import { Inject, Injectable } from '@nestjs/common';
import { EventAttributes, EventType } from './events';
import { SnsManagerService } from '@aggregator/sns-manager';
import { LoggerService } from '@aggregator/logger';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class EventsService {
  constructor(
    @Inject(SnsManagerService) public readonly sns: SnsManagerService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  async sendEvent(
    message,
    eventType: EventType,
    attributes?: EventAttributes,
  ): Promise<void> {
    if (!eventType) throw new Error('Event Type is required');

    const messageAttributes = Object.assign({}, attributes, {
      EVENT: eventType,
      correlationId: uuid4(),
    });

    this.logger.info(
      `Sending event ${eventType} with attributes ${JSON.stringify(
        messageAttributes,
      )}`,
    );

    try {
      await this.sns.send(message, messageAttributes);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
