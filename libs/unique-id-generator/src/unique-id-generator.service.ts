import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UniqueIdGeneratorService {
  private generateHashedId(input: string): string {
    const hash = createHash('sha256').update(input).digest('base64');

    return hash;
  }
  generateAllGamesId(page: number, pageSize: number): string {
    return this.generateHashedId(`all-games-${page}-${pageSize}`);
  }

  generateGameId(gameId: string, gameDate: string): string {
    return this.generateHashedId(`game-${gameId}-${gameDate}`);
  }

  generateGameArticleId(gameId: string, gameDate: string): string {
    return this.generateHashedId(`all-games-${gameId}-${gameDate}`);
  }

  guid() {
    return uuidV4();
  }
}
