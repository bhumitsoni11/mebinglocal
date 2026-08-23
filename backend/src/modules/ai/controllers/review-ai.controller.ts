import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReviewAiService } from '../services/review-ai.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/reviews')
@UseGuards(AuthGuard)
export class ReviewAiController {
  constructor(private readonly reviewAiService: ReviewAiService) {}

  @Get(':localFriendId/summary')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async getReviewSummary(@Param('localFriendId') localFriendId: string) {
    return this.reviewAiService.summarizeReviews(localFriendId);
  }
}
