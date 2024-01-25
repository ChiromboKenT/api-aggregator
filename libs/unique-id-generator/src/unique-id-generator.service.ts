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

  generateGameId(gameId: string | number): string {
    return this.generateHashedId(`game-${gameId}`);
  }

  generateGameArticleId(
    gameId: string | number,
    gameTimestamp: number,
    location: string,
  ): string {
    return this.generateHashedId(
      `all-games-${gameId}-${location}-${gameTimestamp}`,
    );
  }

  guid() {
    return uuidV4();
  }
}
