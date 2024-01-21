import { Injectable, Logger } from '@nestjs/common';
import { NbaService } from '../nba/nba.service';
import { WeatherService } from '../weather/weather.service';
import { DbManagerService } from '@aggregator/db-manager';

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(
    private readonly nbaService: NbaService,
    private readonly weatherService: WeatherService,
    private readonly dbManagerService: DbManagerService,
  ) {}

  async aggregateAndSaveData(
    gameId: string,
    date: string,
    location: string,
  ): Promise<any> {
    try {
      // Fetch data from NBA service
      const nbaData = await this.nbaService.fetchGameById(gameId);

      // Fetch weather data
      const weatherData = await this.weatherService.fetchData(date, location);

      // Combine NBA and weather data
      const combinedData = this.combineData(nbaData, weatherData);

      // Save combined data to the database
      await this.dbManagerService.putItem(combinedData);

      return combinedData;
    } catch (error) {
      this.logger.error(`Failed to aggregate and save data: ${error.message}`);
      throw error;
    }
  }

  private combineData(nbaData: any, weatherData: any): any {
    // Implement your logic to combine NBA and weather data here
    // For simplicity, let's assume you just want to merge them into a single object
    return { nbaData, weatherData };
  }
}
