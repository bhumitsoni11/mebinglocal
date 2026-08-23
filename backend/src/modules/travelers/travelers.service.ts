import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { UpdateTravelerDto } from './dto/update-traveler.dto';

@Injectable()
export class TravelersService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.travelerProfile.findUnique({
      where: { userId },
      include: {
        interests: { include: { interest: true } },
        languages: { include: { language: true } },
      },
    });

    if (!profile) {
      // If it doesn't exist, create it (lazy initialization)
      return this.prisma.travelerProfile.create({
        data: { userId },
        include: {
          interests: { include: { interest: true } },
          languages: { include: { language: true } },
        },
      });
    }

    return profile;
  }

  async updateByUserId(userId: string, data: UpdateTravelerDto) {
    const { interestIds, languageIds, ...profileData } = data;

    // We must ensure the profile exists first
    await this.findByUserId(userId);

    const updateData: any = { ...profileData };

    if (interestIds) {
      updateData.interests = {
        deleteMany: {},
        create: interestIds.map(id => ({
          interest: { connect: { id } }
        }))
      };
    }

    if (languageIds) {
      updateData.languages = {
        deleteMany: {},
        create: languageIds.map(id => ({
          language: { connect: { id } }
        }))
      };
    }

    return this.prisma.travelerProfile.update({
      where: { userId },
      data: updateData,
      include: {
        interests: { include: { interest: true } },
        languages: { include: { language: true } },
      },
    });
  }
}
