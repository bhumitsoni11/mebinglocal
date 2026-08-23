import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { buildReviewSummaryPrompt } from '../prompts/review.prompts';

export interface ReviewSummaryResult {
  overall: string;
  strengths: string[];
  weaknesses: string[];
}

@Injectable()
export class ReviewAiService {
  private readonly logger = new Logger(ReviewAiService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async summarizeReviews(localFriendId: string): Promise<ReviewSummaryResult> {
    this.logger.log(`Fetching review summary for Local Friend ${localFriendId}`);

    // Check if user exists and get total reviews as a "version" indicator
    const lfProfile = await this.prisma.localFriendProfile.findUnique({
      where: { userId: localFriendId },
      include: { user: true }
    });

    if (!lfProfile) {
      throw new NotFoundException('Local Friend not found');
    }

    const reviewVersion = lfProfile.totalReviews; // Cache invalidates when review count changes
    const cacheKey = `ai:review-summary:${localFriendId}:${reviewVersion}`;

    // Try hitting cache first
    const cachedSummary = await this.redis.get<ReviewSummaryResult>(cacheKey);
    if (cachedSummary) {
      return cachedSummary;
    }

    // Fetch actual reviews from database
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: localFriendId },
      select: { rating: true, comment: true },
      take: 20, // Only take recent 20 for AI to keep tokens low
      orderBy: { createdAt: 'desc' }
    });

    if (reviews.length === 0) {
      return {
        overall: 'Not enough reviews yet.',
        strengths: [],
        weaknesses: [],
      };
    }

    const prompt = buildReviewSummaryPrompt(lfProfile.user.firstName || 'the local friend', reviews);

    // Generate summary via OpenAI
    const result = await this.openaiService.generateStructuredOutput<ReviewSummaryResult>([
      { role: 'system', content: prompt }
    ], { temperature: 0.2 });

    // Cache the result (e.g. for 24 hours, but naturally invalidates via version string)
    await this.redis.set(cacheKey, result, 60 * 60 * 24);

    return result;
  }
}
