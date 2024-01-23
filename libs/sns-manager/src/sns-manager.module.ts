import { DynamicModule, Module } from '@nestjs/common';
import { SnsManagerService } from './sns-manager.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SNS } from 'aws-sdk';
import { LoggerModule } from '@aggregator/logger';
import { awsRegion } from '@aggregator/common-types';

interface Options {
  arn: string;
  endpoint?: string;
}

@Module({})
export class SnsManagerModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: SnsManagerModule,
      imports: [
        LoggerModule,
        AwsSdkModule.forRoot({
          defaultServiceOptions: {
            region: (process.env.REGION as awsRegion) || 'us-east-1',
            endpoint: process.env.SNS_ENDPOINT,
          },
          services: [SNS],
        }),
      ],
      providers: [
        {
          provide: 'SNS_OPTIONS',
          useValue: options,
        },
        SnsManagerService,
      ],
      exports: [SnsManagerService],
    };
  }
}
