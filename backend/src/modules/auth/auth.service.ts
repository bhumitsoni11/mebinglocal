import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { User, UserRole, OnboardingStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async syncUser(clerkUserId: string, email: string, name?: string, avatar?: string, role?: UserRole): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { clerkUserId },
      include: { travelerProfile: true, localProfile: true },
    });

    if (existing) {
      return this.prisma.user.update({
        where: { clerkUserId },
        data: {
          email,
          name: name || existing.name,
          avatar: avatar || existing.avatar,
          role: role || existing.role,
        },
        include: { travelerProfile: true, localProfile: true },
      });
    }

    return this.prisma.user.create({
      data: {
        clerkUserId,
        email,
        name: name || 'Explorer',
        avatar: avatar || null,
        role: role || UserRole.TRAVELER,
        onboardingStatus: OnboardingStatus.NOT_STARTED,
        travelerProfile: {
          create: {},
        },
      },
      include: { travelerProfile: true, localProfile: true },
    });
  }

  async getMe(user: User): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        travelerProfile: true,
        localProfile: {
          include: {
            destination: true,
            experiences: true,
          },
        },
      },
    });
  }

  async updateOnboarding(user: User, data: { status: OnboardingStatus; role?: UserRole }): Promise<User> {
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingStatus: data.status,
        ...(data.role ? { role: data.role } : {}),
      },
      include: { travelerProfile: true, localProfile: true },
    });
  }
}
