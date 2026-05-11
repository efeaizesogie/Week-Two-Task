import OpenAI from 'openai';

export interface OpenAIConfig {
  apiKey: string;
  chatModel?: string;
  embedModel?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Thin wrapper around the OpenAI SDK that:
 *   - enforces model defaults from env,
 *   - normalises chat + embedding calls to the shapes RFPilot uses,
 *   - returns token usage so callers can persist it for cost analytics.
 */
export class OpenAIClient {
  private readonly client: OpenAI;
  private readonly chatModel: string;
  private readonly embedModel: string;

  constructor(cfg: OpenAIConfig) {
    this.client = new OpenAI({ apiKey: cfg.apiKey });
    this.chatModel = cfg.chatModel ?? 'gpt-4o-mini';
    this.embedModel = cfg.embedModel ?? 'text-embedding-3-small';
  }

  async chat(params: {
    messages: ChatMessage[];
    temperature?: number;
    responseFormat?: 'json' | 'text';
    model?: string;
  }): Promise<{
    content: string;
    tokensInput: number;
    tokensOutput: number;
    model: string;
  }> {
    const model = params.model ?? this.chatModel;
    const res = await this.client.chat.completions.create({
      model,
      messages: params.messages,
      temperature: params.temperature ?? 0.2,
      response_format:
        params.responseFormat === 'json' ? { type: 'json_object' } : undefined,
    });

    const content = res.choices[0]?.message?.content ?? '';
    return {
      content,
      tokensInput: res.usage?.prompt_tokens ?? 0,
      tokensOutput: res.usage?.completion_tokens ?? 0,
      model,
    };
  }

  async embed(texts: string[]): Promise<{
    embeddings: number[][];
    tokensInput: number;
    model: string;
  }> {
    const res = await this.client.embeddings.create({
      model: this.embedModel,
      input: texts,
    });
    return {
      embeddings: res.data.map((d) => d.embedding),
      tokensInput: res.usage?.prompt_tokens ?? 0,
      model: this.embedModel,
    };
  }
}
