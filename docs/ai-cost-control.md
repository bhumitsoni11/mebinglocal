# AI Cost Control

## 1. Structured Outputs
We enforce `response_format: { type: 'json_object' }` and strict prompts to minimize unnecessary verbose output tokens.

## 2. Pre-Filtering Strategy
For features like Matching and Recommendations, we do not send the entire database to OpenAI.
Instead, we use Prisma to query and limit the candidate pool (e.g. `take: 20`) based on hard constraints (location, budget) BEFORE sending the candidates to the AI for semantic ranking.

## 3. Caching
Deterministic results like Review Summaries are cached in Upstash Redis.
The cache key incorporates the `totalReviews` count, ensuring the AI only regenerates the summary when new reviews are posted.

## 4. Rate Limiting
NestJS `@nestjs/throttler` is integrated at the controller level:
- Assistant: 10/min
- Itinerary: 5/min
- Matching: 10/min
- Translation: 20/min
