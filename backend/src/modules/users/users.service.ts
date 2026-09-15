import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { travelerProfile: true, localProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByClerkId(clerkUserId: string) {
    return this.prisma.user.findUnique({
      where: { clerkUserId },
      include: { travelerProfile: true, localProfile: true },
    });
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.avatar ? { avatar: data.avatar } : {}),
      },
      include: { travelerProfile: true, localProfile: true },
    });
  }
}
