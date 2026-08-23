import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { UpdateLocalFriendDto } from './dto/update-local-friend.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanionsService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.localFriendProfile.findUnique({
      where: { userId },
      include: {
        interests: { include: { interest: true } },
        languages: { include: { language: true } },
        experiences: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Local Friend profile not found');
    }

    return profile;
  }

  async createProfile(userId: string, data: UpdateLocalFriendDto) {
    const { interestIds, languageIds, ...profileData } = data;
    
    // Default hourlyRate if not provided, since it's required in schema
    const hourlyRate = profileData.hourlyRate || 2000; // $20.00
    
    return this.prisma.localFriendProfile.create({
      data: {
        userId,
        ...profileData,
        hourlyRate,
        interests: interestIds ? {
          create: interestIds.map(id => ({ interest: { connect: { id } } }))
        } : undefined,
        languages: languageIds ? {
          create: languageIds.map(id => ({ language: { connect: { id } } }))
        } : undefined,
      },
    });
  }

  async updateByUserId(userId: string, data: UpdateLocalFriendDto) {
    const { interestIds, languageIds, ...profileData } = data;

    // Verify it exists
    const existing = await this.prisma.localFriendProfile.findUnique({ where: { userId } });
    if (!existing) {
      return this.createProfile(userId, data);
    }

    const updateData: any = { ...profileData };

    if (interestIds) {
      updateData.interests = {
        deleteMany: {},
        create: interestIds.map(id => ({ interest: { connect: { id } } }))
      };
    }

    if (languageIds) {
      updateData.languages = {
        deleteMany: {},
        create: languageIds.map(id => ({ language: { connect: { id } } }))
      };
    }

    return this.prisma.localFriendProfile.update({
      where: { userId },
      data: updateData,
      include: {
        interests: { include: { interest: true } },
        languages: { include: { language: true } },
      },
    });
  }

  async search(query: any) {
    const {
      destination,
      languageId,
      interestId,
      minRating,
      maxPrice,
      isVerified,
      page = 1,
      limit = 20,
    } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: Prisma.LocalFriendProfileWhereInput = {};

    if (destination) {
      where.location = { contains: destination, mode: 'insensitive' };
    }
    if (minRating) {
      where.rating = { gte: Number(minRating) };
    }
    if (maxPrice) {
      where.hourlyRate = { lte: Number(maxPrice) }; // Assuming maxPrice is in minor units
    }
    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true';
    }
    if (languageId) {
      where.languages = {
        some: { languageId },
      };
    }
    if (interestId) {
      where.interests = {
        some: { interestId },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.localFriendProfile.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
            }
          },
          interests: { include: { interest: true } },
          languages: { include: { language: true } },
        },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.localFriendProfile.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }
    };
  }

  async findById(id: string) {
    const profile = await this.prisma.localFriendProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          }
        },
        interests: { include: { interest: true } },
        languages: { include: { language: true } },
        experiences: {
          where: { isActive: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Local Friend profile not found');
    }

    return profile;
  }
}
