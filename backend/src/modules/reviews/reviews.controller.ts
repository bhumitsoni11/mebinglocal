import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReview(@CurrentUser() user: User, @Body() body: CreateReviewDto) {
    return this.reviewsService.createReview(user, body);
  }

  @Get('local/:localProfileId')
  async getLocalReviews(@Param('localProfileId') localProfileId: string) {
    return this.reviewsService.getLocalReviews(localProfileId);
  }

  @Post(':id/reply')
  @UseGuards(AuthGuard)
  async replyToReview(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body('reply') reply: string,
  ) {
    return this.reviewsService.replyToReview(id, user, reply);
  }
}
