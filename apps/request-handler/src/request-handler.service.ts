// request-handler.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import {
  GetAllGamesRequest,
  GetSpecificGameRequest,
  GetFullGameDataRequest,
  ApiResponse,
} from './request.dto';
import { UniqueIdGeneratorService } from '@aggregator/unique-id-generator';
import { CacheManagerService } from '@aggregator/cache-manager';
import { EventsService } from '@aggregator/events';
import { Events } from '@aggregator/events/events';
import { Subscription } from 'rxjs';
import { LoggerService } from '@aggregator/logger';
import { SseManagerService } from '@aggregator/sse-manager';

@Injectable()
export class RequestHandlerService {
  private clients: Record<
    string,
    { client: Response; subscription: Subscription }
  > = {};
  constructor(
    private readonly uniqueIdGeneratorService: UniqueIdGeneratorService,
    private readonly cacheManagerService: CacheManagerService,
    private readonly sseHandlerService: SseManagerService,
    private readonly logger: LoggerService,
    @Inject(EventsService) private readonly eventBus: EventsService,
  ) {}

  async getAllGames(
    page: number,
    pageSize: number,
    clientId: string,
  ): Promise<ApiResponse> {
    //Retieve games from cache, otherwise retrieve from nbaService
    const cacheId = this.uniqueIdGeneratorService.generateAllGamesId(
      page,
      pageSize,
    );

    const cachedGames = await this.cacheManagerService.get(cacheId);
    if (cachedGames) {
      this.sseHandlerService.sendUpdate('games', clientId, cachedGames);
      this.sseHandlerService.sendUpdate('games', clientId, 'DONE');
      return;
    }

    try {
      this.logger.debug(`Sending event to external api handler : ${cacheId}`);
      this.triggerExternalApi(cacheId, 'nba', {
        page,
        pageSize,
        clientId,
        requestType: 'ALL',
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getGameById(id: number, clientId: string): Promise<ApiResponse> {
    //Retieve game from cache, otherwise retrieve from nbaService
    const cacheId = this.uniqueIdGeneratorService.generateGameId(id);

    const cachedGame = await this.cacheManagerService.get(cacheId);
    if (cachedGame) {
      this.sseHandlerService.sendUpdate(`games/:id`, clientId, cachedGame);
      this.sseHandlerService.sendUpdate(`games/:id`, clientId, 'DONE');
      return;
    }

    try {
      this.logger.debug(`Sending event to aggregator : ${cacheId}`);
      this.triggerExternalApi(cacheId, 'nba', {
        gameId: id,
        clientId,
        requestType: 'SINGLE',
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getGameArticlesById(
    id: number,
    timestamp: number,
    clientId: string,
  ): Promise<ApiResponse> {
    //Retieve game articles from cache, otherwise aggregate data
    const cacheId = this.uniqueIdGeneratorService.generateGameArticleId(
      id,
      timestamp,
    );

    const cachedGameArticles = await this.cacheManagerService.get(cacheId);

    if (cachedGameArticles) {
      //Send cached data
      this.sseHandlerService.sendUpdate(
        'games/:id/articles/:timestamp',
        clientId,
        cachedGameArticles,
      );
      this.sseHandlerService.sendUpdate(
        'games/:id/articles/:timestamp',
        clientId,
        'DONE',
      );
    }

    //Aggregate data
    await this.triggerAggregatorEvent(cacheId, 'nba', {
      gameId: id,
      timestamp,
      clientId,
    });
    await this.triggerAggregatorEvent(cacheId, 'weather', {
      gameId: id,
      timestamp,
      clientId,
    });

    return {
      data: {},
      message: 'Successfully retrieved /games/${id}/articles/${timestamp}',
    };
  }

  private async triggerExternalApi(
    cacheId: string,
    actionType: string,
    payload: any,
  ) {
    await this.eventBus.sendEvent(
      {
        requestId: cacheId,
        serviceName: 'REQUEST_HANDLER',
        actionType,
        payload,
      },
      Events.API_REQUESTED,
    );
  }

  private async triggerAggregatorEvent(
    cacheId: string,
    actionType: string,
    payload: any,
  ): Promise<void> {
    await this.eventBus.sendEvent(
      {
        requestId: cacheId,
        serviceName: 'REQUEST_HANDLER',
        actionType,
        payload,
      },
      Events.AGGREGATOR_TRIGGERED,
    );
  }

  // Register a client to receive updates for a specific endpoint
  registerClient(
    client: Response,
    endpoint: string,
    clientId: string,
  ): () => void {
    const channel = this.sseHandlerService.getClientChannel(clientId, endpoint);

    // Subscribe to updates
    const subscription = channel.subscribe((update) => {
      client.write(`data: ${update}\n\n`);
    });

    // Save the subscription and client
    this.clients[clientId] = {
      client,
      subscription,
    };

    // Unsubscribe function to be called when the client disconnects
    const unsubscribe = (): void => {
      if (this.clients[clientId]) {
        const { subscription } = this.clients[clientId];
        delete this.clients[clientId];
        if (!subscription.closed) {
          subscription.unsubscribe();
        }
      }
    };

    return unsubscribe;
  }
}


