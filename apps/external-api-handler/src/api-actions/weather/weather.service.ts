import { LoggerService } from '@aggregator/logger';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  async fetchData(date: string, location: string): Promise<any> {
    const options = {
      method: 'GET',
      url: `${this.config.get('RAPID_API_URL')}/weather/historical/${date}`,
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
        'X-RapidAPI-Host': `${this.config.get('RAPID_API_HOST')}`,
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
