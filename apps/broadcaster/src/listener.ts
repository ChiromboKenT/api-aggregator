import { LoggerService } from '@aggregator/logger';
import { SqsManagerService } from '@aggregator/sqs-manager';
import { Inject, Injectable } from '@nestjs/common';
import { EventsService } from '@aggregator/events';
import { Events } from '@aggregator/events/events';
import { DbManagerService } from '@aggregator/db-manager';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Error } from '@aggregator/common-types/error';
import { SseManagerService } from '@aggregator/sse-manager';

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

    for await (const {
      body,
      attributes,
      ack,
    } of this.sqsManagerService.listen<any>()) {
      this.logger.debug('Received message', { body });

      switch (attributes.EVENT) {
        case Events.API_AGGREGATED:
          const { requestId, clientId, payload } = body.requestId;

          const combinedData = await this.getCombinedData(requestId);
          this.logger.debug('Result', { combinedData });

          //send result to client
          this.sendResultToClient(
            requestId,
            clientId,
            'games/:id/articles/:timestamp',
            combinedData,
          );
          break;

        case Events.API_REQUEST_COMPLETED:
          this.logger.debug('Request completed', { requestId });
          this.sendResultToClient(requestId, clientId, 'games/:id', payload);
          break;

        default:
          break;
      }

      await ack();
    }

    this.logger.debug('Message processed');
  }

  async sendResultToClient(
    requestId,
    clientId,
    endpoint: string,
    payload: any,
  ) {
    try {
      this.logger.debug(`Sending result to client`);
      this.eventBus.sendEvent(
        {
          requestId,
          actionType: 'aggregated',
          serviceName: 'BROADCASTER_SERVICE',
          payload: {
            data: payload,
            message: `Retrieved data for ${endpoint}`,
            clientId,
            endpoint,
          },
        },
        Events.AGGREGATOR_COMPLETED,
      );
    } catch (error) {
      this.logger.error(`Error sending result to client:`, error);
    }
  }

  async getCombinedData(requestId: string): Promise<any[]> {
    this.logger.info(`Getting combined data`);
    const params: DocumentClient.QueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `REQUEST#${requestId}`,
        ':sk': 'COMBINED',
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

      return this.mapToClientResponse(
        (result as DocumentClient.ItemList) || [],
      );
    } catch (error) {
      this.logger.error(`Error getting combined data: ${error.message}`);
      return [];
    }
  }

  mapToClientResponse(data: any[]): any[] {
    return data.map((item) => {
      return {
        ...item.Data,
      };
    });
  }
}
