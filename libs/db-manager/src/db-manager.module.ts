import { Module } from '@nestjs/common';
import { DbManagerService } from './db-manager.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { LoggerModule } from '@aggregator/logger';
import { awsRegion } from '@aggregator/common-types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamoDB } from 'aws-sdk';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot(),
    AwsSdkModule.forRootAsync({
      services: [DynamoDB.DocumentClient],
      defaultServiceOptions: {
        useFactory: (config: ConfigService) => {
          return {
            region: config.get<awsRegion>('AWS_REGION') || 'eu-central-1',
            endpoint: config.get<string>('DYNAMODB_ENDPOINT'),
          };
        },
        imports: [ConfigModule],
        inject: [ConfigService],
      },
    }),
  ],
  providers: [DbManagerService],
  exports: [DbManagerService],
})
export class DbManagerModule {}
