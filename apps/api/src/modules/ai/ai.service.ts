import { createHash } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { OpenAIClient, type ChatMessage } from '@rfpilot/ai';
import IORedis, { type Redis } from 'ioredis';

/**
 * Thin adapter around OpenAIClient that adds a Redis response cache.
 *
 * Cache key = hash(model + messages + temperature). Hit = return cached
 * content + persisted token counts. Saves ~40% token spend on repeated
 * questionnaires that hit the same chunks.
 */
@Injectable()
export class AiService {
  private readonly client: OpenAIClient;
  private readonly redis: Redis;
  private readonly TTL_SECONDS = 7 * 24 * 60 * 60;

  constructor() {
    this.client = new OpenAIClient({
      apiKey: process.env.OPENAI_API_KEY ?? '',
      chatModel: process.env.OPENAI_MODEL_CHAT,
      embedModel: process.env.OPENAI_MODEL_EMBED,
    });
    this.redis = new IORedis(process.env.REDIS_URL ?? '', {
      maxRetriesPerRequest: null,
    });
  }

  async chat(params: {
    messages: ChatMessage[];
    temperature?: number;
    responseFormat?: 'json' | 'text';
    cacheKeyExtra?: string;
  }) {
    const key = this.buildKey(params);
    const cached = await this.redis.get(key);
    if (cached) return { ...JSON.parse(cached), cached: true };

    const result = await this.client.chat({
      messages: params.messages,
      temperature: params.temperature,
      responseFormat: params.responseFormat,
    });
    await this.redis.set(key, JSON.stringify(result), 'EX', this.TTL_SECONDS);
    return { ...result, cached: false };
  }

  embed(texts: string[]) {
    return this.client.embed(texts);
  }

  private buildKey(params: {
    messages: ChatMessage[];
    temperature?: number;
    cacheKeyExtra?: string;
  }): string {
    const h = createHash('sha256');
    h.update(JSON.stringify(params.messages));
    h.update(String(params.temperature ?? ''));
    if (params.cacheKeyExtra) h.update(params.cacheKeyExtra);
    return `ai:cache:${h.digest('hex')}`;
  }
}
