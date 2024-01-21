import { Inject, Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SNS } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import { LoggerService } from '@aggregator/logger';
import { v4 as uuidv4 } from 'uuid';

import { Attributes, mapAttributes } from './map-attributes';

@Injectable()
export class SnsManagerService {
  constructor(
    @InjectAwsService(SNS) private readonly sns: SNS,
    @Inject('SNS_OPTIONS') private readonly options,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  async send(
    message: Record<string, unknown>,
    attributes?: Attributes,
  ): Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>> {
    const attrs = Object.assign(attributes, {
      correlationId: uuidv4(),
    });

    const params = {
      Message: JSON.stringify(message),
      MessageAttributes: mapAttributes(attrs),
      TopicArn: this.options.arn,
    };

    try {
      const result = await this.sns.publish(params).promise();
      return result;
    } catch (error) {
      this.logger.error('Error publishing message to SNS', {
        params: params,
        error: error,
      });
    }
  }

  async batchSend(messages) {
    try {
      const params = {
        TopicArn: this.options.arn,
        PublishBatchRequestEntries: messages,
      };

      return await this.sns.publishBatch(params).promise();
    } catch (error) {
      this.logger.error('Error publishing batch to SNS', {
        error: error,
      });
    }
  }
}
