import { DynamicModule, Module } from '@nestjs/common';
import { SqsManagerService } from './sqs-manager.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { LoggerModule } from '@aggregator/logger';
import { awsRegion } from '@aggregator/common-types';

interface Options {
  url: string;
}

@Module({})
export class SqsManagerModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: SqsManagerModule,
      imports: [
        LoggerModule,
        AwsSdkModule.forRoot({
          defaultServiceOptions: {
            region: (process.env.REGION as awsRegion) || 'us-east-1',
          },
          services: [SQS],
        }),
      ],
      providers: [
        {
          provide: 'SQS_OPTIONS',
          useValue: options,
        },
        SqsManagerService,
      ],
      exports: [SqsManagerService],
    };
  }
}
