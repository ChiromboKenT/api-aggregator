import { LoggerService } from '@aggregator/logger';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Action } from '../types';
import { EventsService, RequestPayload, SNSMessage } from '@aggregator/events';
import { Events } from '@aggregator/events/events';

@Injectable()
export class WeatherService implements Action {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject(EventsService) private readonly eventBus: EventsService,
  ) {}

  async run(body: SNSMessage): Promise<void> {
    const requestId = body.requestId;
    const { clientId, request } = body.payload as RequestPayload;

    const response = await this.fetchData(
      request.timestamp,
      request.gameLocation,
    );

    if (response) {
      await this.eventBus.sendEvent(
        {
          requestId,
          actionType: 'weather',
          serviceName: 'WEATHER_SERVICE',
          payload: { data: response, clientId },
        },
        Events.API_RESOLVED,
      );
    }
  }

  async fetchData(
    timestamp: number,
    location: string = 'Johannesburg',
  ): Promise<any> {
    const date = new Date(timestamp).toISOString();
    const options = {
      method: 'GET',
      url: `https://${this.config.get('RAPID_API_HOST_WEATHER')}/history`,
      params: {
        startDateTime: date,
        aggregateHours: '24',
        location: location,
        endDateTime: date,
        unitGroup: 'metric',
        contentType: 'json',
        shortColumnNames: '0',
      },
      headers: {
        'X-RapidAPI-Key': `${this.config.get('RAPID_API_KEY')}`,
        'X-RapidAPI-Host': `${this.config.get('RAPID_API_HOST_WEATHER')}`,
      },
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
