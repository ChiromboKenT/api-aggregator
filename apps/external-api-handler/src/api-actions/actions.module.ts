import { Module } from '@nestjs/common';
import { NbaService } from './nba/nba.service';
import { WeatherService } from './weather/weather.service';
import { DbManagerModule } from '@aggregator/db-manager';
import { ActionsDictionary } from './actions-dictionary';
import { CacheManagerModule } from '@aggregator/cache-manager';

@Module({
  imports: [DbManagerModule, CacheManagerModule],
  providers: [
    {
      provide: 'ACTION_LIST',
      useFactory: (nbaService: NbaService, weatherService: WeatherService) => {
        return [
          ['nba', nbaService],
          ['weather', weatherService],
        ];
      },
      inject: [NbaService, WeatherService],
    },
  ],
  exports: [ActionsDictionary, 'ACTION_LIST'],
})
export class ActionsModule {}
