import { Injectable } from '@nestjs/common';
import { LoggerService } from '@aggregator/logger';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  async fetchWeather(date: Date): Promise<any> {
    // Fetch weather data for the given date

    // Log the data using the logger service
    this.loggerService.info(`Fetching weather for ${date.toISOString()}`);

    // Get configuration values using the config service
    const apiKey = this.configService.get<string>('weather.apiKey');
    const apiUrl = this.configService.get<string>('weather.apiUrl');

    // Make API request to fetch weather data using the apiKey and apiUrl

    // Return the fetched weather data
    return true;
  }
}
