import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { VerificationStatus, Prisma } from '@prisma/client';

export interface LocalFilterDto {
  destination?: string;
  city?: string;
  language?: string;
  interest?: string;
  maxRate?: number;
  verifiedOnly?: boolean;
  superhostOnly?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class LocalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: LocalFilterDto) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(filter.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.LocalProfileWhereInput = {
      verificationStatus: filter.verifiedOnly !== false ? VerificationStatus.APPROVED : undefined,
      ...(filter.superhostOnly ? { isSuperhost: true } : {}),
      ...(filter.maxRate ? { hourlyRate: { lte: filter.maxRate } } : {}),
      ...(filter.city ? { city: { equals: filter.city, mode: 'insensitive' } } : {}),
      ...(filter.language ? { languages: { has: filter.language } } : {}),
      ...(filter.interest ? { interests: { has: filter.interest } } : {}),
      ...(filter.search
        ? {
            OR: [
              { user: { name: { contains: filter.search, mode: 'insensitive' } } },
              { city: { contains: filter.search, mode: 'insensitive' } },
              { tagline: { contains: filter.search, mode: 'insensitive' } },
              { bio: { contains: filter.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.localProfile.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          destination: { select: { id: true, city: true, country: true, slug: true } },
          experiences: {
            where: { status: 'PUBLISHED' },
            select: { id: true, title: true, pricePerPerson: true, durationHours: true },
            take: 3,
          },
        },
        orderBy: [{ isSuperhost: 'desc' }, { ratingScore: 'desc' }, { reviewCount: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.localProfile.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const profile = await this.prisma.localProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true, email: true, createdAt: true } },
        destination: true,
        experiences: {
          where: { status: 'PUBLISHED' },
          include: { images: true },
        },
        reviewsReceived: {
          include: {
            author: { select: { name: true, avatar: true } },
            experience: { select: { title: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        availabilitySlots: {
          where: { date: { gte: new Date() } },
          orderBy: { date: 'asc' },
          take: 30,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Local Friend profile with ID "${id}" not found`);
    }

    return profile;
  }

  async findByUserId(userId: string) {
    return this.prisma.localProfile.findUnique({
      where: { userId },
      include: {
        destination: true,
        experiences: { include: { images: true } },
        availabilitySlots: true,
      },
    });
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.localProfile.upsert({
      where: { userId },
      update: {
        tagline: data.tagline,
        bio: data.bio,
        city: data.city,
        country: data.country,
        hourlyRate: data.hourlyRate,
        languages: data.languages,
        interests: data.interests,
        expertise: data.expertise,
        yearsResident: data.yearsResident,
      },
      create: {
        userId,
        city: data.city || 'Florence',
        country: data.country || 'Italy',
        tagline: data.tagline || 'Local Resident Host',
        bio: data.bio || '',
        hourlyRate: data.hourlyRate || 35.00,
        languages: data.languages || ['English'],
        interests: data.interests || ['Food', 'Culture'],
        verificationStatus: VerificationStatus.SUBMITTED,
      },
      include: { destination: true },
    });
  }

  async getDashboardStats(userId: string) {
    const profile = await this.prisma.localProfile.findUnique({
      where: { userId },
      include: {
        bookingsReceived: {
          include: {
            traveler: { select: { name: true, avatar: true, email: true } },
            experience: { select: { title: true } },
            payment: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        reviewsReceived: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Local profile not found');
    }

    const totalBookings = profile.bookingsReceived.length;
    const completedBookings = profile.bookingsReceived.filter((b) => b.status === 'COMPLETED').length;
    const pendingBookings = profile.bookingsReceived.filter((b) => b.status === 'PENDING').length;
    const totalEarnings = profile.bookingsReceived
      .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + Number(b.hostPayout), 0);

    return {
      profile,
      metrics: {
        totalEarnings,
        totalBookings,
        completedBookings,
        pendingBookings,
        ratingScore: profile.ratingScore,
        reviewCount: profile.reviewCount,
      },
      recentBookings: profile.bookingsReceived.slice(0, 10),
    };
  }
}
