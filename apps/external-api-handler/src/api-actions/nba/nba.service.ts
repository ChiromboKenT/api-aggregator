import { LoggerService } from '@aggregator/logger';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Action } from '../types';
import { EventsService } from '@aggregator/events';
import { Events } from '@aggregator/events/events';
import { CacheManagerService } from '@aggregator/cache-manager';

@Injectable()
export class NbaService implements Action {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject(CacheManagerService)
    private readonly cacheManager: CacheManagerService,
    @Inject(EventsService) private readonly eventBus: EventsService,
  ) {}

  async run(body: any): Promise<void> {
    const { requestId, ...payload } = body;
    const response = await this.fetchGameById(payload.gameId);
    if (response) {
      await this.cacheManager.set(requestId, response.data);
      await this.eventBus.sendEvent(
        {
          requestId,
          actionType: 'nba',
          serviceName: 'NBA_SERVICE',
          payload,
        },
        Events.API_RESOLVED,
      );
    }
  }

  async handleGetAllGames(body: any): Promise<void> {
    const { requestId } = body;
    const { clientId, page, pageSize } = body.payload;
    const response = await this.fetchAllGames(page, pageSize);
    if (response) {
      await this.cacheManager.set(requestId, response.data);
      await await this.eventBus.sendEvent(
        {
          requestId,
          clientId,
          actionType: 'nba',
          serviceName: 'NBA_SERVICE',
          payload: response.data,
        },
        Events.API_REQUEST_COMPLETED,
      );
    }
  }

  async handleGetGameById(body: any): Promise<void> {
    const { requestId } = body;
    const { gameId, clientId } = body.payload;
    const response = await this.fetchGameById(gameId);
    if (response) {
      await this.cacheManager.set(requestId, response.data);
      await this.eventBus.sendEvent(
        {
          requestId,
          clientId,
          actionType: 'nba',
          serviceName: 'NBA_SERVICE',
          payload: response.data,
        },
        Events.API_REQUEST_COMPLETED,
      );
    }
  }

  /**
   * Fetches a single game's data by ID from the specified API endpoint.
   * @param gameId The ID of the game to fetch.
   * @returns The fetched game data.
   */
  async fetchGameById(gameId: string): Promise<any> {
    const options = {
      method: 'GET',
      url: `${this.config.get('RAPID_API_HOST_NBA')}/games/${gameId}`,
      params: {},
      headers: {
        'X-RapidAPI-Key': this.config.get('RAPID_API_KEY'),
        'X-RapidAPI-Host': this.config.get('RAPID_API_HOST_NBA'),
      },
    };

    try {
      this.logger.info(`Fetching game by ID ${gameId} from ${options.url}`);
      const response = await axios(options);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch game by ID ${gameId} from ${options.url}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Fetches all games from the specified API endpoint with pagination support.
   * @param page The page number.
   * @param pageSize The number of items per page.
   * @returns The fetched games data.
   */
  async fetchAllGames(page: number = 1, pageSize: number = 10): Promise<any> {
    const options = {
      method: 'GET',
      url: `${this.config.get('RAPID_API_HOST_NBA')}/games`,
      params: { page, pageSize },
      headers: {
        'X-RapidAPI-Key': this.config.get('RAPID_API_KEY'),
        'X-RapidAPI-Host': this.config.get('RAPID_API_HOST_NBA'),
      },
    };

    try {
      this.logger.info(
        `Fetching all games (Page: ${page}, PageSize: ${pageSize}) from ${options.url}`,
      );
      const response = await axios(options);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch all games (Page: ${page}, PageSize: ${pageSize}) from ${options.url}`,
        error,
      );
      throw error;
    }
  }
}
