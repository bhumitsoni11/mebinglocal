import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { buildTranslationPrompt } from '../prompts/translation.prompts';
import { TranslationRequestDto } from '../dto/translation.dto';

export interface TranslationResult {
  translatedText: string;
}

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async translateText(request: TranslationRequestDto): Promise<TranslationResult> {
    this.logger.log(`Translating text from ${request.sourceLanguage} to ${request.targetLanguage}`);

    const prompt = buildTranslationPrompt(request.sourceLanguage, request.targetLanguage);

    return this.openaiService.generateStructuredOutput<TranslationResult>([
      { role: 'system', content: prompt },
      { role: 'user', content: request.text }
    ], { temperature: 0.1 });
  }
}
