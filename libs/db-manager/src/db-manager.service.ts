import { Injectable } from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { LoggerService } from '@aggregator/logger';
import { InjectAwsService } from 'nest-aws-sdk';
import { DynamoDB } from 'aws-sdk';
import { Error } from '@aggregator/common-types/error';

@Injectable()
export class DbManagerService {
  constructor(
    @InjectAwsService(DynamoDB.DocumentClient)
    private readonly dynamoDbClient: DocumentClient,
    private readonly logger: LoggerService,
  ) {}

  async putItem(params: DocumentClient.PutItemInput): Promise<boolean | Error> {
    try {
      await this.dynamoDbClient.put(params).promise();
      return true;
    } catch (error) {
      return this.handleDynamoDbError(error);
    }
  }

  async getItem(
    params: DocumentClient.GetItemInput,
  ): Promise<DocumentClient.AttributeMap | Error | undefined> {
    try {
      const result = await this.dynamoDbClient.get(params).promise();
      return result.Item;
    } catch (error) {
      return this.handleDynamoDbError(error);
    }
  }

  async updateItem(
    params: DocumentClient.UpdateItemInput,
  ): Promise<boolean | Error> {
    try {
      await this.dynamoDbClient.update(params).promise();
      return true;
    } catch (error) {
      return this.handleDynamoDbError(error);
    }
  }

  async deleteItem(
    params: DocumentClient.DeleteItemInput,
  ): Promise<boolean | Error> {
    try {
      await this.dynamoDbClient.delete(params).promise();
      return true;
    } catch (error) {
      return this.handleDynamoDbError(error);
    }
  }

  private handleDynamoDbError(error: Error): Error<unknown> {
    this.logger.error('DynamoDB error', error);
    return {
      message: error.message,
      error,
    };
  }
}
