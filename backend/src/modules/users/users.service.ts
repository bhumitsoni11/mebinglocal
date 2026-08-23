import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByClerkId(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async getSavedItems(userId: string) {
    return this.prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveItem(userId: string, itemType: string, itemId: string) {
    return this.prisma.savedItem.upsert({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType,
          itemId,
        }
      },
      update: {},
      create: {
        userId,
        itemType,
        itemId,
      }
    });
  }

  async removeSavedItem(userId: string, id: string) {
    return this.prisma.savedItem.deleteMany({
      where: {
        id,
        userId, // ensure ownership
      },
    });
  }
}
