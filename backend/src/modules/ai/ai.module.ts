import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

import { AiAssistantController } from './controllers/ai-assistant.controller';
import { AssistantService } from './services/assistant.service';
import { ItineraryController } from './controllers/itinerary.controller';
import { ItineraryService } from './services/itinerary.service';
import { MatchingController } from './controllers/matching.controller';
import { MatchingService } from './services/matching.service';
import { RecommendationController } from './controllers/recommendation.controller';
import { RecommendationService } from './services/recommendation.service';
import { ReviewAiController } from './controllers/review-ai.controller';
import { ReviewAiService } from './services/review-ai.service';
import { TranslationController } from './controllers/translation.controller';
import { TranslationService } from './services/translation.service';
import { SafetyAiController } from './controllers/safety-ai.controller';
import { SafetyAiService } from './services/safety-ai.service';
import { DiscoveryController } from './controllers/discovery.controller';
import { DiscoveryService } from './services/discovery.service';

@Module({
  controllers: [AiController, AiAssistantController, ItineraryController, MatchingController, RecommendationController, ReviewAiController, TranslationController, SafetyAiController, DiscoveryController],
  providers: [AiService, AssistantService, ItineraryService, MatchingService, RecommendationService, ReviewAiService, TranslationService, SafetyAiService, DiscoveryService],
})
export class AiModule {}
