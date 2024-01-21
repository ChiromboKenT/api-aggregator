import { Module } from '@nestjs/common';
import { RequestHandlerController } from './request-handler.controller';
import { RequestHandlerService } from './request-handler.service';
import { UniqueIdGeneratorModule } from '@aggregator/unique-id-generator';
import { CacheManagerModule } from '@aggregator/cache-manager';
import { AggregatorModule } from 'apps/aggregator/src/aggregator.module';
import { NbaService } from './nba/nba.service';
import { WeatherService } from './weather/weather.service';

@Module({
  imports: [UniqueIdGeneratorModule, CacheManagerModule, AggregatorModule],
  controllers: [RequestHandlerController],
  providers: [RequestHandlerService, NbaService, WeatherService],
})
export class RequestHandlerModule {}
