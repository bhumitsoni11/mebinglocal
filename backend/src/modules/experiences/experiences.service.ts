import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  private async getLocalFriendId(userId: string) {
    const profile = await this.prisma.localFriendProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      throw new ForbiddenException('User is not a Local Friend or profile missing');
    }
    return profile.id;
  }

  async create(userId: string, data: CreateExperienceDto) {
    const localFriendId = await this.getLocalFriendId(userId);
    return this.prisma.experience.create({
      data: {
        ...data,
        localFriendId,
      },
    });
  }

  async findAllByLocalFriend(localFriendId: string) {
    return this.prisma.experience.findMany({
      where: { localFriendId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        localFriend: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarUrl: true },
            },
          },
        },
      },
    });
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  async update(userId: string, id: string, data: UpdateExperienceDto) {
    const localFriendId = await this.getLocalFriendId(userId);
    const experience = await this.prisma.experience.findUnique({ where: { id } });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    if (experience.localFriendId !== localFriendId) {
      throw new ForbiddenException('You do not own this experience');
    }

    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  async remove(userId: string, id: string) {
    const localFriendId = await this.getLocalFriendId(userId);
    const experience = await this.prisma.experience.findUnique({ where: { id } });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    if (experience.localFriendId !== localFriendId) {
      throw new ForbiddenException('You do not own this experience');
    }

    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
