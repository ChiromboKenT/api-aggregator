import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'LOGGER',
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          app_name: config.get<string>('APP_NAME'),
          app_env: config.get<string>('APP_ENV'),
          logger_version: '1.0.0',
        };
      },
    },
    LoggerService,
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
