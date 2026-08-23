import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, data: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed bookings');
    }

    const isTraveler = booking.travelerId === reviewerId;
    const isLocalFriend = booking.localFriendId === reviewerId;

    if (!isTraveler && !isLocalFriend) {
      throw new ForbiddenException('You were not part of this booking');
    }

    const revieweeId = isTraveler ? booking.localFriendId : booking.travelerId;

    // Verify hasn't already reviewed this booking
    const existing = await this.prisma.review.findUnique({
      where: { bookingId: booking.id },
    });

    if (existing) {
      throw new BadRequestException('Review already exists for this booking');
    }

    const review = await this.prisma.review.create({
      data: {
        bookingId: booking.id,
        reviewerId,
        revieweeId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Update target user's rating (if Local Friend)
    if (isTraveler) {
      const localFriend = await this.prisma.localFriendProfile.findUnique({
        where: { userId: revieweeId },
      });
      
      if (localFriend) {
        const totalReviews = localFriend.totalReviews + 1;
        const rating = ((localFriend.rating * localFriend.totalReviews) + data.rating) / totalReviews;
        
        await this.prisma.localFriendProfile.update({
          where: { userId: revieweeId },
          data: { rating, totalReviews },
        });
      }
    }

    return review;
  }

  async findByReviewee(revieweeId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId, isFlagged: false },
      include: {
        reviewer: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
