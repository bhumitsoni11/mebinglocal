import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { buildItineraryPrompt } from '../prompts/itinerary.prompts';
import { ItineraryRequestDto } from '../dto/itinerary.dto';

export interface ItineraryResponse {
  destination: string;
  days: {
    day: number;
    activities: {
      title: string;
      description: string;
      location: string;
      duration: string;
      estimatedCost: number;
    }[];
  }[];
}

@Injectable()
export class ItineraryService {
  private readonly logger = new Logger(ItineraryService.name);

  constructor(private readonly openaiService: OpenaiService) {}

  async generateItinerary(userId: string, request: ItineraryRequestDto): Promise<ItineraryResponse> {
    this.logger.log(`Generating itinerary for user ${userId} to ${request.destination}`);

    const prompt = buildItineraryPrompt(request);

    // Make the call via central OpenAI service asking for structured JSON
    return this.openaiService.generateStructuredOutput<ItineraryResponse>([
      { role: 'system', content: prompt }
    ], { temperature: 0.4 });
  }
}
