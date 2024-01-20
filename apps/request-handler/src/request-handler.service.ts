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
import { title } from 'process';

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
        message: 'Returning cached games',
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
      message: 'Returning fresh games',
    };
  }
}
