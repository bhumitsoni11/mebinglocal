import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(travelerId: string, data: CreateBookingDto) {
    // 1. Verify traveler is not booking themselves
    if (travelerId === data.localFriendId) {
      throw new BadRequestException('You cannot book yourself');
    }

    // 2. Check for overlapping bookings for the local friend that are already CONFIRMED
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        localFriendId: data.localFriendId,
        status: BookingStatus.CONFIRMED,
        OR: [
          {
            startTime: { lte: new Date(data.endTime) },
            endTime: { gte: new Date(data.startTime) },
          }
        ]
      }
    });

    if (existingBooking) {
      throw new BadRequestException('The Local Friend is already booked during this time');
    }

    // 3. Create the booking as PENDING
    return this.prisma.booking.create({
      data: {
        ...data,
        travelerId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: BookingStatus.PENDING,
      },
    });
  }

  async findByTraveler(travelerId: string) {
    return this.prisma.booking.findMany({
      where: { travelerId },
      include: {
        localFriend: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
        experience: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLocalFriend(localFriendId: string) {
    return this.prisma.booking.findMany({
      where: { localFriendId },
      include: {
        traveler: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
        experience: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(userId: string, id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isTraveler = booking.travelerId === userId;
    const isLocalFriend = booking.localFriendId === userId;

    if (!isTraveler && !isLocalFriend) {
      throw new ForbiddenException('You do not have permission to modify this booking');
    }

    // State Machine Validation
    const currentStatus = booking.status;
    const newStatus = dto.status;

    // Local Friend transitions
    if (isLocalFriend) {
      if (currentStatus === 'PENDING' && !['CONFIRMED', 'REJECTED'].includes(newStatus)) {
        throw new BadRequestException(`Local Friend can only CONFIRM or REJECT a PENDING booking`);
      }
      if (currentStatus === 'CONFIRMED' && !['CANCELLED', 'COMPLETED'].includes(newStatus)) {
        throw new BadRequestException(`Local Friend can only CANCEL or COMPLETE a CONFIRMED booking`);
      }
    }

    // Traveler transitions
    if (isTraveler) {
      if (currentStatus === 'PENDING' && newStatus !== 'CANCELLED') {
        throw new BadRequestException(`Traveler can only CANCEL a PENDING booking`);
      }
      if (currentStatus === 'CONFIRMED' && !['CANCELLED', 'COMPLETED'].includes(newStatus)) {
        throw new BadRequestException(`Traveler can only CANCEL or COMPLETE a CONFIRMED booking`);
      }
    }

    // Invalid states to transition FROM
    if (['REJECTED', 'CANCELLED', 'COMPLETED', 'REFUNDED'].includes(currentStatus)) {
      throw new BadRequestException(`Cannot transition from terminal state ${currentStatus}`);
    }

    // Note: In a real implementation with Razorpay, CONFIRMING would create the Payment record, 
    // and CANCELING might trigger refunds. For Phase 3 core API, we update state directly.
    return this.prisma.booking.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
