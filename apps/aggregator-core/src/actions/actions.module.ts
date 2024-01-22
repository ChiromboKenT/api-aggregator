import { Module } from '@nestjs/common';
import { NbaCoreService } from './nba';
import { WeatherCoreService } from './weather';
import { DbManagerModule } from '@aggregator/db-manager';
import { ActionsDictionary } from './actions-dictionary';
import { LoggerModule } from '@aggregator/logger';

@Module({
  imports: [DbManagerModule, LoggerModule],
  providers: [
    {
      provide: 'ACTION_LIST',
      useFactory: (
        nbaService: NbaCoreService,
        weatherService: WeatherCoreService,
      ) => {
        return [
          ['nba', nbaService],
          ['weather', weatherService],
        ];
      },
      inject: [NbaCoreService, WeatherCoreService],
    },
  ],
  exports: [ActionsDictionary, 'ACTION_LIST'],
})
export class ActionsModule {}
