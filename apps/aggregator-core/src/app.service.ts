import { DbManagerService } from '@aggregator/db-manager';
import { LoggerService } from '@aggregator/logger';
import { Inject, Injectable } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { NBAGame, Weather } from './types';
import { MessagePayload, SNSMessage } from '@aggregator/events';

@Injectable()
export class AggregatorCoreService {
  private tableName: string = 'AggregatorCoreTable';

  constructor(
    @Inject(DbManagerService) private readonly dbClient: DbManagerService,
    private readonly logger: LoggerService,
  ) {}

  async saveEventToDynamoDB(body: SNSMessage<NBAGame | Weather>) {
    const { requestId, serviceName, payload } = body;

    const params: DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: {
        PK: `REQUEST#${requestId}`,
        SK: `COMBINED#${serviceName}}`,
        Data: {
          ...(payload as MessagePayload).data,
          lastUpdated: Date.now().toString(),
        },
      },
    };

    try {
      this.logger.info(`Saving event to DynamoDB`);
      await this.dbClient.putItem(params);
      this.logger.debug(`Event saved to DynamoDB`);

      this.logger.debug(`Updating tracking item - ${serviceName}`);

      const trackingParams: DocumentClient.UpdateItemInput = {
        TableName: this.tableName,
        Key: {
          PK: `REQUEST#${requestId}`,
          SK: 'TRACKING',
        },
        UpdateExpression: 'SET #serviceName = :serviceName',
        ExpressionAttributeNames: {
          '#serviceName': serviceName,
        },
        ExpressionAttributeValues: {
          ':serviceName': true,
        },
      };

      await this.dbClient.updateItem(trackingParams);
      this.logger.debug(`Tracking item updated - ${serviceName}`);
    } catch (error) {
      this.logger.error(`Failed to save event to DynamoDB`, error);
      throw error;
    }
  }

  async checkCompletion(requestId: string): Promise<boolean> {
    this.logger.info(`Checking completion`);
    const params: DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: {
        PK: `REQUEST#${requestId}`,
        SK: 'TRACKING',
      },
    };

    try {
      const result = await this.dbClient.getItem(params);
      this.logger.debug(`Fetched tracking information`, result);
      if (result.error) {
        throw new Error(`Failed to get item from DynamoDB : ${result.error}`);
      }

      const isNBAComplete = result['NBA_SERVICE'] === true;
      const isWeatherComplete = result['WEATHER_SERVICE'] === true;

      return isNBAComplete && isWeatherComplete;
    } catch (error) {
      this.logger.trace(`Failed to check completion`, error);
      return false;
    }
  }
}
