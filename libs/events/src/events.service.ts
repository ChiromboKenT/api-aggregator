import { Inject, Injectable } from '@nestjs/common';
import { EventAttributes, EventType } from './events';
import { SnsManagerService } from '@aggregator/sns-manager';
import { LoggerService } from '@aggregator/logger';

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
    });

    await this.sns.send(message, messageAttributes);
  }
}
