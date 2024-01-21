import { Inject, Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { mapSqsAttributes } from '@aggregator/sqs-manager/sqs-attributes';
import { LoggerService } from '@aggregator/logger';

export interface Message<TBody> {
  body: TBody;
  attributes: Record<string, string>;
  ack: () => Promise<void>;
}

@Injectable()
export class SqsManagerService {
  constructor(
    @InjectAwsService(SQS) private readonly sqs: SQS,
    @Inject('SQS_OPTIONS') private readonly options,
    private readonly logger: LoggerService,
  ) {}

  private async receive(): Promise<SQS.Message[]> {
    try {
      const response = await this.sqs
        .receiveMessage({
          QueueUrl: this.options.url,
          MaxNumberOfMessages: 1,
          WaitTimeSeconds: 10,
          MessageAttributeNames: ['All'],
        })
        .promise();

      return response.Messages || [];
    } catch (error) {
      this.logger.error('Error receiving messages from queue', {
        error: error,
      });
      return [];
    }
  }

  private async ack(receiptHandle: string): Promise<void> {
    const deleteParams = {
      QueueUrl: this.options.url,
      ReceiptHandle: receiptHandle,
    };

    try {
      await this.sqs.deleteMessage(deleteParams).promise();
    } catch (error) {
      this.logger.error('Error removing messages from queue', {
        error: error,
      });
    }
  }

  public async *listen<TBody>(): AsyncGenerator<Message<TBody>> {
    while (true) {
      const messages = await this.receive();
      if (messages.length > 0) {
        for await (const message of messages) {
          yield {
            body: JSON.parse(message.Body) as TBody,
            attributes: mapSqsAttributes(message.MessageAttributes),
            ack: () => this.ack(message.ReceiptHandle),
          };
        }
      }
    }
  }
}
