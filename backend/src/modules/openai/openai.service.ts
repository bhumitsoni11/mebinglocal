import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';
import { PostHog } from 'posthog-node';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenaiService.name);
  private readonly defaultModel: string;
  private readonly posthog: PostHog;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || 'mock-key';
    this.defaultModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    
    this.posthog = new PostHog(process.env.POSTHOG_KEY || 'phc_mock', {
      host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
      disabled: process.env.POSTHOG_KEY === undefined
    });

    this.openai = new OpenAI({
      apiKey,
      timeout: 30000, // 30s timeout
      maxRetries: 2, // Built-in retry handling
    });
  }

  /**
   * Generates a chat completion and tracks token usage.
   */
  async generateCompletion(messages: OpenAI.Chat.ChatCompletionMessageParam[], options?: { model?: string, temperature?: number }) {
    try {
      const response = await this.openai.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages,
        temperature: options?.temperature ?? 0.7,
      });

      this.logUsage(response.usage, 'generateCompletion');

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generates structured JSON output using OpenAI's response_format = { type: 'json_object' }
   */
  async generateStructuredOutput<T>(messages: OpenAI.Chat.ChatCompletionMessageParam[], options?: { model?: string, temperature?: number }): Promise<T> {
    try {
      const response = await this.openai.chat.completions.create({
        model: options?.model || this.defaultModel,
        messages,
        temperature: options?.temperature ?? 0.3,
        response_format: { type: 'json_object' },
      });

      this.logUsage(response.usage, 'generateStructuredOutput');

      const content = response.choices[0]?.message?.content || '{}';
      try {
        return JSON.parse(content) as T;
      } catch (parseError) {
        this.logger.error('Failed to parse AI structured output', { content, parseError });
        throw new HttpException(
          { success: false, code: 'AI_PARSE_ERROR', message: 'Failed to parse AI response' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      this.handleError(error);
      throw error; // Let TypeScript know it throws
    }
  }

  private logUsage(usage: OpenAI.Completions.CompletionUsage | undefined, context: string) {
    if (usage) {
      this.logger.log(`[${context}] Token usage: Prompt=${usage.prompt_tokens}, Completion=${usage.completion_tokens}, Total=${usage.total_tokens}`);
      
      this.posthog.capture({
        distinctId: 'system-backend', // Tracking system-wide usage. Or pass userId for per-user tracking.
        event: 'ai_api_request',
        properties: {
          context,
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
        }
      });
    }
  }

  private handleError(error: any) {
    this.logger.error('OpenAI Error', error?.message || error);

    // If it's a known API error, handle it gracefully
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new HttpException(
          { success: false, code: 'AI_RATE_LIMITED', message: 'AI assistance is currently rate-limited. Please try again later.' },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      if (error.status === 401) {
        throw new HttpException(
          { success: false, code: 'AI_AUTH_ERROR', message: 'AI configuration error.' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        { success: false, code: 'AI_TEMPORARILY_UNAVAILABLE', message: 'AI assistance is temporarily unavailable.' },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Generic error fallback
    throw new HttpException(
      { success: false, code: 'AI_TEMPORARILY_UNAVAILABLE', message: 'AI assistance is temporarily unavailable.' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
