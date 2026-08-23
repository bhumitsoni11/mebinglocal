# AI Prompts Strategy

## Centralized Prompt Builders
Prompts are isolated from controller logic and kept in the `src/modules/ai/prompts` directory.
This prevents prompt leakage and ensures prompts can be versioned and tested independently.

## Builders implemented:
1. `buildAssistantSystemPrompt`: Merges base assistant context with user preferences.
2. `buildItineraryPrompt`: Forces JSON schema output for multi-day itineraries.
3. `buildMatchingPrompt`: Ranks pre-filtered candidate Local Friends based on traveler intent.
4. `buildRecommendationPrompt`: Scores DB-filtered candidate experiences using past booking history.
5. `buildReviewSummaryPrompt`: Distills up to 20 recent DB reviews into overall sentiment and strengths/weaknesses.
6. `buildTranslationPrompt`: Localizes text while retaining travel entities.
7. `buildSafetyPrompt`: Translates boolean flags and counts into narrative trust indicators.
8. `buildDiscoveryPrompt`: Converts natural language search queries into strict filtering parameters for Prisma.
