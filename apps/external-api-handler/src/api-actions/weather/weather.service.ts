import { LoggerService } from '@aggregator/logger';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Action } from '../types';
import { EventsService } from '@aggregator/events';
import { Events } from '@aggregator/events/events';

@Injectable()
export class WeatherService implements Action {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject(EventsService) private readonly eventBus: EventsService,
  ) {}

  async run(body: any): Promise<void> {
    const { requestId, date, location, ...payload } = body;
    const response = await this.fetchData(date, location);

    if (response) {
      await this.eventBus.sendEvent(
        {
          requestId,
          actionType: 'weather',
          serviceName: 'WEATHER_SERVICE',
          ...{ date, location, ...payload },
        },
        Events.API_RESOLVED,
      );
    }
  }

  async fetchData(timestamp: string, location: string): Promise<any> {
    const date = new Date(timestamp).toISOString();
    const options = {
      method: 'GET',
      url: `https://${this.config.get('RAPID_API_HOST_WEATHER')}/weather/historical/${date}`,
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
      this.logger.info(response.data);
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
