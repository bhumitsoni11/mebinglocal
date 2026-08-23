import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { RecommendationService } from '../services/recommendation.service';
import { RecommendationRequestDto } from '../dto/recommendation.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/recommendations')
@UseGuards(AuthGuard)
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  async getRecommendations(@Req() req: any, @Query() query: RecommendationRequestDto) {
    const userId = req.user.id;
    return this.recommendationService.getRecommendations(userId, query);
  }
}
