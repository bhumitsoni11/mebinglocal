import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { BookingStatus, User } from '@prisma/client';

export interface CreateBookingDto {
  localProfileId: string;
  experienceId?: string;
  bookingDate: string; // ISO date YYYY-MM-DD
  startTime: string; // e.g. "10:00 AM"
  endTime?: string;
  guestCount: number;
  specialNotes?: string;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(user: User, dto: CreateBookingDto) {
    const guestCount = Math.max(1, Number(dto.guestCount) || 1);
    const dateObj = new Date(dto.bookingDate);

    // 1. Fetch Local Profile & Experience
    const localProfile = await this.prisma.localProfile.findUnique({
      where: { id: dto.localProfileId },
    });

    if (!localProfile) {
      throw new NotFoundException('Local Friend not found');
    }

    let experience = null;
    let ratePerGuest = Number(localProfile.hourlyRate);

    if (dto.experienceId) {
      experience = await this.prisma.experience.findUnique({
        where: { id: dto.experienceId },
      });
      if (experience) {
        ratePerGuest = Number(experience.pricePerPerson);
      }
    }

    const totalAmount = ratePerGuest * guestCount;
    const platformFee = 0.00; // Zero fee for initial launch
    const hostPayout = totalAmount - platformFee;

    // 2. Generate unique booking number
    const bookingNumber = `MBL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 3. Perform transactional creation
    return this.prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          travelerUserId: user.id,
          localProfileId: localProfile.id,
          experienceId: experience?.id || null,
          bookingDate: dateObj,
          startTime: dto.startTime,
          endTime: dto.endTime || null,
          guestCount,
          specialNotes: dto.specialNotes || null,
          totalAmount,
          platformFee,
          hostPayout,
          currency: 'USD',
          status: BookingStatus.PENDING,
        },
        include: {
          localProfile: {
            include: { user: { select: { name: true, avatar: true, email: true } } },
          },
          experience: true,
        },
      });

      // Create conversation for chat
      const conversation = await tx.conversation.create({
        data: {
          bookingId: booking.id,
          participants: {
            create: [
              { userId: user.id },
              { userId: localProfile.userId },
            ],
          },
          messages: {
            create: {
              senderUserId: user.id,
              content: `Hi! I just booked ${experience?.title ? `"${experience.title}"` : 'time with you'} for ${dto.bookingDate} at ${dto.startTime}. Excited to connect!`,
              isSystem: false,
            },
          },
        },
      });

      return { booking, conversationId: conversation.id };
    });
  }

  async getTravelerBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { travelerUserId: userId },
      include: {
        localProfile: {
          include: { user: { select: { name: true, avatar: true, email: true } } },
        },
        experience: { include: { images: true } },
        payment: true,
        review: true,
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async getLocalBookings(userId: string) {
    const localProfile = await this.prisma.localProfile.findUnique({
      where: { userId },
    });

    if (!localProfile) {
      throw new NotFoundException('Local profile not found');
    }

    return this.prisma.booking.findMany({
      where: { localProfileId: localProfile.id },
      include: {
        traveler: { select: { id: true, name: true, avatar: true, email: true } },
        experience: { include: { images: true } },
        payment: true,
        review: true,
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async getBookingById(id: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        traveler: { select: { id: true, name: true, avatar: true, email: true } },
        localProfile: {
          include: { user: { select: { id: true, name: true, avatar: true, email: true } } },
        },
        experience: { include: { images: true } },
        payment: true,
        review: true,
        conversation: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Permission check
    const isTraveler = booking.travelerUserId === user.id;
    const isLocal = booking.localProfile.userId === user.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

    if (!isTraveler && !isLocal && !isAdmin) {
      throw new ForbiddenException('Not authorized to view this booking');
    }

    return booking;
  }

  async updateBookingStatus(id: string, user: User, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { localProfile: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isLocal = booking.localProfile.userId === user.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

    if (!isLocal && !isAdmin) {
      throw new ForbiddenException('Only the host or admin can update booking status');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        traveler: { select: { name: true, email: true } },
        localProfile: { include: { user: { select: { name: true, email: true } } } },
        experience: true,
      },
    });
  }
}
