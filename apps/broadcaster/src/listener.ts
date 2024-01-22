import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';
import { EventsService } from '@aggregator/events';
import { Events } from '@aggregator/events/events';
import { DbManagerService } from '@aggregator/db-manager';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Error } from '@aggregator/common-types/error';

@Injectable()
export class Listener {
  private tableName: string;
  constructor(
    @Inject(SqsManagerService)
    private readonly sqsManagerService: SqsManagerService,
    private readonly logger: LoggerService,
    @Inject(EventsService) private readonly eventBus: EventsService,
    @Inject(DbManagerService) private readonly dbClient: DbManagerService,
  ) {
    this.tableName = 'AggregatorCoreTable';
  }
  async start() {
    this.logger.debug('Start listening on queue... ');

    for await (const { body, ack } of this.sqsManagerService.listen<any>()) {
      this.logger.debug('Received message', { body });
      const requestId = body.requestId;
      const params = {
        TableName: '',
        Key: {
          PK: `REQUEST#${requestId}`,
          SK: 'COMBINED',
        },
      };

      let result = await this.dbClient.getItem(params);
      this.logger.debug('Result', { result });

      await ack();
    }
    this.logger.debug('Message processed');
  }

  async getCombinedData(requestId: string): Promise<any[]> {
    this.logger.info(`Getting combined data`);
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `REQUEST#${requestId}`,
        ':sk': 'Combined',
      },
    };

    try {
      const result = await this.dbClient.queryItems(params);
      if ((result as Error).error) {
        this.logger.error(
          `Error getting combined data: ${(result as Error).message}`,
        );
        return [];
      }

      return (result as DocumentClient.ItemList) || [];
    } catch (error) {
      this.logger.error(`Error getting combined data: ${error.message}`);
      return [];
    }
  }
}
