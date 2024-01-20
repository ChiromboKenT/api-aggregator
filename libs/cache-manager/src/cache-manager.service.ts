import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
  private readonly client;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl || 3600);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }
}
