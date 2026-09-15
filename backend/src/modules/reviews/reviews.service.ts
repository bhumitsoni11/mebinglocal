import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { User } from '@prisma/client';

export interface CreateReviewDto {
  bookingId: string;
  rating: number; // 1 to 5
  content: string;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(user: User, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { localProfile: true, review: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.travelerUserId !== user.id) {
      throw new BadRequestException('Only the booking traveler can write a review');
    }

    if (booking.review) {
      throw new BadRequestException('Review has already been submitted for this booking');
    }

    const rating = Math.min(5, Math.max(1, Number(dto.rating) || 5));

    const review = await this.prisma.review.create({
      data: {
        bookingId: booking.id,
        authorUserId: user.id,
        localProfileId: booking.localProfileId,
        experienceId: booking.experienceId,
        rating,
        content: dto.content,
      },
      include: {
        author: { select: { name: true, avatar: true } },
      },
    });

    // Recalculate host average rating
    const allReviews = await this.prisma.review.findMany({
      where: { localProfileId: booking.localProfileId },
      select: { rating: true },
    });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgScore = Number((totalRatings / allReviews.length).toFixed(2));

    await this.prisma.localProfile.update({
      where: { id: booking.localProfileId },
      data: {
        ratingScore: avgScore,
        reviewCount: allReviews.length,
      },
    });

    return review;
  }

  async getLocalReviews(localProfileId: string) {
    return this.prisma.review.findMany({
      where: { localProfileId },
      include: {
        author: { select: { name: true, avatar: true } },
        experience: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async replyToReview(reviewId: string, user: User, replyContent: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { localProfile: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.localProfile.userId !== user.id) {
      throw new BadRequestException('Only the reviewed host can reply');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        hostReply: replyContent,
        hostRepliedAt: new Date(),
      },
    });
  }
}
