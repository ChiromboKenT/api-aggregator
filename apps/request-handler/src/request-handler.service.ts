// request-handler.service.ts
import { Inject, Injectable } from '@nestjs/common';

import {
  GetAllGamesRequest,
  GetSpecificGameRequest,
  GetFullGameDataRequest,
  ApiResponse,
} from './request.dto';
import { UniqueIdGeneratorService } from '@aggregator/unique-id-generator';
import { CacheManagerService } from '@aggregator/cache-manager';



@Injectable()
export class RequestHandlerService {
  constructor(
    private readonly uniqueIdGeneratorService: UniqueIdGeneratorService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  async getAllGames(page: number, pageSize: number): Promise<ApiResponse> {
    //Retieve games from cache, otherwise retrieve from nbaService
    const cacheId = this.uniqueIdGeneratorService.generateAllGamesId(
      page,
      pageSize,
    );

    const cachedGames = await this.cacheManagerService.get(cacheId);
    if (cachedGames) {
      return {
        data: cachedGames,
        message: 'Returning cached /games?page=1&pageSize=10',
      };
    }

    //const games = await this.nbaService.getAllGames(page, pageSize);

    //Cache games
    await this.cacheManagerService.set(cacheId, {
      id: 1,
      title: 'NBA 2K21',
      description: 'Basketball video game',
    });

    return {
      data: {
        id: 1,
        title: 'NBA 2K21',
        description: 'Basketball video game',
      },
      message: 'Successfully retrieved /games?page=1&pageSize=10',
    };
  }

  async getGameById(id: number): Promise<ApiResponse> {
    //Retieve game from cache, otherwise retrieve from nbaService
    const cacheId = this.uniqueIdGeneratorService.generateGameId(id);

    const cachedGame = await this.cacheManagerService.get(cacheId);
    if (cachedGame) {
      return {
        data: cachedGame,
        message: `Returning cached /games/${cacheId}`,
      };
    }

    //const game = await this.nbaService.getGameById(id);

    //Cache game
    await this.cacheManagerService.set(cacheId, {});

    return {
      data: {},
      message: 'Successfully retrieved /games/${cacheId}',
    };
  }

  async getGameArticlesById(
    id: number,
    timestamp: number,
  ): Promise<ApiResponse> {
    //Retieve game articles from cache, otherwise aggregate data
    const cacheId = this.uniqueIdGeneratorService.generateGameArticleId(
      id,
      timestamp.toString(),
    );

    const cachedGameArticles = await this.cacheManagerService.get(cacheId);

    if (cachedGameArticles) {
      return {
        data: cachedGameArticles,
        message: `Returning cached /games/${id}/articles/${timestamp}`,
      };
    }

    //Aggregate data

    //Cache game articles
    await this.cacheManagerService.set(cacheId, {});

    return {
      data: {},
      message: 'Successfully retrieved /games/${id}/articles/${timestamp}',
    };
  }
}


