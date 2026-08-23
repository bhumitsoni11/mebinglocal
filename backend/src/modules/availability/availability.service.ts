import { Injectable, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
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

  async create(userId: string, data: CreateAvailabilityDto) {
    const localFriendId = await this.getLocalFriendId(userId);
    
    // Simple conflict check
    const existing = await this.prisma.availability.findFirst({
      where: {
        localFriendId,
        OR: [
          {
            startTime: { lte: new Date(data.endTime) },
            endTime: { gte: new Date(data.startTime) },
          }
        ]
      }
    });

    if (existing) {
      throw new ConflictException('Availability slot conflicts with existing slot');
    }

    return this.prisma.availability.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        localFriendId,
      },
    });
  }

  async findByLocalFriend(localFriendId: string, startDate?: string, endDate?: string) {
    const where: any = { localFriendId };
    
    if (startDate && endDate) {
      where.startTime = { gte: new Date(startDate) };
      where.endTime = { lte: new Date(endDate) };
    }

    return this.prisma.availability.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }

  async remove(userId: string, id: string) {
    const localFriendId = await this.getLocalFriendId(userId);
    const slot = await this.prisma.availability.findUnique({ where: { id } });

    if (!slot || slot.localFriendId !== localFriendId) {
      throw new ForbiddenException('Cannot delete this availability slot');
    }

    return this.prisma.availability.delete({
      where: { id },
    });
  }
}
