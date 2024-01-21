import { Injectable } from '@nestjs/common';
import { LoggerService } from '@aggregator/logger';

@Injectable()
export class NbaService {
  constructor(private readonly loggerService: LoggerService) {}

  fetchGameById(gameId: string): Promise<any> {
    const game = null;

    // Log the fetched game data
    this.loggerService.info(`Fetched game by Id: ${gameId}`, game);

    return game;
  }

  fetchAllGames(page: number, pageSize: number): Promise<any[]> {
    // Fetch all games with page and pageSize logic here
    const games = null;

    // Log the fetched games data
    this.loggerService.info(
      `Fetched all games with page: ${page}, pageSize: ${pageSize}`,
      games,
    );

    return games;
  }
}
