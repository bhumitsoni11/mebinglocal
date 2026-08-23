import { Injectable, Logger } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL || 'https://mock.upstash.io';
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || 'mock';

    // Disable UPSTASH when using mock so it doesn't crash on invalid fetch
    if (url === 'https://mock.upstash.io') {
      this.logger.warn('Running RedisService with MOCK config. Caching is bypassed.');
      this.redis = null as any; 
    } else {
      this.redis = new Redis({
        url,
        token,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      const data = await this.redis.get<T>(key);
      if (data) {
        this.logger.debug(`Cache hit: ${key}`);
      } else {
        this.logger.debug(`Cache miss: ${key}`);
      }
      return data;
    } catch (error) {
      this.logger.error(`Failed to GET key: ${key}`, error);
      return null; // Fail gracefully
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.redis) return;
    try {
      if (ttlSeconds) {
        await this.redis.set(key, value, { ex: ttlSeconds });
      } else {
        await this.redis.set(key, value);
      }
      this.logger.debug(`Cache set: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to SET key: ${key}`, error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) return;
    try {
      await this.redis.del(key);
      this.logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to DEL key: ${key}`, error);
    }
  }
}
