// request-handler.service.ts
import { Inject, Injectable } from '@nestjs/common';

import {
  GetAllGamesRequest,
  GetSpecificGameRequest,
  GetFullGameDataRequest,
  ApiResponse,
} from './request.dto';
import { UniqueIdGeneratorService } from '@aggregator/unique-id-generator';

@Injectable()
export class RequestHandlerService {
  constructor(
    private readonly uniqueIdGeneratorService: UniqueIdGeneratorService,
  ) {}

  async getAllGames(page: number, pageSize: number): Promise<ApiResponse> {
    //Retieve games from cache, otherwise retrieve from nbaService

    return {
      data: 'data',
      message: 'message',
    };
  }
}
