# Phase 4 AI Architecture Audit

## 1. Existing AI-Related Code
- **`package.json`**: Both `openai` (`^7.5.0`) and `@upstash/redis` (`^1.38.2`) are present.
- **Modules**: An empty stub `ai` module (`ai.module.ts`, `ai.controller.ts`, `ai.service.ts`) exists under `src/modules/ai/`.
- **Database Models**: Prisma schema already contains `AITrip`, `AIMatchRequest`, and `AITrustSignal` models prepared for this phase. Additionally, `LocalPulsePost` contains an `aiAnalysis` Json field and `authenticityScore`.
- **Redis Cache**: No existing Upstash Redis service or module exists in the source code yet.

## 2. Existing Database Structures (To Be Queried)
- **`LocalFriendProfile`**: Location, languages, interests, rating, availability, bio.
- **`TravelerProfile`**: Bio, travelStyle, budgetLevel, interests, languages.
- **`Review`**: Rating and text comment (used for AI Review Summarization).
- **`Experience`**: Tours and activities offered by local friends.
- **`LocalPulsePost` & `Event`**: Local event recommendations.
- **`Booking` & `Report`**: Relevant for computing trust/safety intelligence.

## 3. Existing APIs that AI can consume
- **PrismaService**: Used to query DB tables for context (e.g. `this.prisma.localFriendProfile.findMany()`).
- No internal HTTP calls are needed; AI services will directly query the local database via `PrismaService`.

## 4. Missing AI Infrastructure
- **OpenAI Service**: A central service to initialize the client, track costs/tokens, and handle errors.
- **Redis Service**: For caching structured AI responses (e.g. review summaries).
- **Rate Limiting**: NestJS `@nestjs/throttler` needs to be configured specifically for AI endpoints.
- **Prompt Builders**: A dedicated directory for prompts (e.g. `assistant.prompts.ts`, `matching.prompts.ts`).
- **Feature-Specific Services & Controllers**: Need granular services for each AI capability as per the requested architecture (e.g. `itinerary.service.ts`, `matching.service.ts`).

## 5. Required New Modules / Files
- `src/modules/ai/ai.module.ts` (expanded)
- `src/modules/redis/redis.module.ts` and `redis.service.ts`
- Feature sub-services and controllers inside `src/modules/ai/`:
  - `assistant`
  - `itinerary`
  - `matching`
  - `recommendations`
  - `review-ai`
  - `translation`
  - `safety-ai`

## 6. Required Schema Changes
- None immediately identified; the schema appears to have been pre-designed in Phase 2 for these AI capabilities.
