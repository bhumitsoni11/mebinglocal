import { Controller, Post, Body, Req } from '@nestjs/common';
import { AIService, GenerateItineraryDto } from './ai.service';
import { FastifyRequest } from 'fastify';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('itinerary')
  async generateItinerary(@Body() body: GenerateItineraryDto, @Req() req: FastifyRequest) {
    const user = (req as any).user || null;
    return this.aiService.generateItinerary(user, body);
  }

  @Post('translate')
  async translate(@Body('text') text: string, @Body('targetLanguage') targetLanguage: string) {
    return this.aiService.translateText(text || '', targetLanguage || 'English');
  }
}
