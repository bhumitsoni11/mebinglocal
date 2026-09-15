import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { User, SavedItemType } from '@prisma/client';

@Injectable()
export class TravelersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.travelerProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
      },
    });

    if (!profile) {
      // Auto-create profile if missing
      return this.prisma.travelerProfile.create({
        data: { userId },
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        },
      });
    }

    return profile;
  }

  async updateProfile(userId: string, data: any) {
    return this.prisma.travelerProfile.upsert({
      where: { userId },
      update: {
        bio: data.bio,
        languages: data.languages,
        interests: data.interests,
        travelStyle: data.travelStyle,
        budgetRange: data.budgetRange,
        homeCountry: data.homeCountry,
      },
      create: {
        userId,
        bio: data.bio || '',
        languages: data.languages || [],
        interests: data.interests || [],
        travelStyle: data.travelStyle || 'Slow Cultural',
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
  }

  async getSavedItems(userId: string) {
    const items = await this.prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const localIds = items.filter((i) => i.itemType === SavedItemType.LOCAL_FRIEND).map((i) => i.targetId);
    const experienceIds = items.filter((i) => i.itemType === SavedItemType.EXPERIENCE).map((i) => i.targetId);

    const [locals, experiences] = await Promise.all([
      this.prisma.localProfile.findMany({
        where: { id: { in: localIds } },
        include: { user: { select: { name: true, avatar: true } } },
      }),
      this.prisma.experience.findMany({
        where: { id: { in: experienceIds } },
        include: { images: true, localProfile: { include: { user: { select: { name: true } } } } },
      }),
    ]);

    return {
      locals,
      experiences,
    };
  }

  async toggleSaveItem(userId: string, itemType: SavedItemType, targetId: string) {
    const existing = await this.prisma.savedItem.findUnique({
      where: {
        userId_itemType_targetId: {
          userId,
          itemType,
          targetId,
        },
      },
    });

    if (existing) {
      await this.prisma.savedItem.delete({ where: { id: existing.id } });
      return { saved: false };
    }

    await this.prisma.savedItem.create({
      data: { userId, itemType, targetId },
    });

    return { saved: true };
  }
}
