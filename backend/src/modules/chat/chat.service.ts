import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChatsForUser(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        participant2: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get latest message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(userId: string, chatId: string, page = 1, limit = 50) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.participant1Id !== userId && chat.participant2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { chatId } }),
    ]);

    // Mark unread messages as read
    const unreadMessages = items.filter(m => m.senderId !== userId && !m.isRead);
    if (unreadMessages.length > 0) {
      await this.prisma.message.updateMany({
        where: {
          id: { in: unreadMessages.map(m => m.id) },
        },
        data: { isRead: true },
      });
    }

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendMessage(userId: string, data: CreateMessageDto) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: data.chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.participant1Id !== userId && chat.participant2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    const message = await this.prisma.message.create({
      data: {
        chatId: data.chatId,
        senderId: userId,
        content: data.content,
        mediaUrl: data.mediaUrl,
      },
    });

    // Update chat updatedAt for sorting
    await this.prisma.chat.update({
      where: { id: data.chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async createChat(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot create a chat with yourself');
    }

    // Ensure users exist
    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('Target user not found');

    // Check if chat already exists (order independent)
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: targetUserId },
          { participant1Id: targetUserId, participant2Id: userId },
        ],
      },
    });

    if (existingChat) return existingChat;

    return this.prisma.chat.create({
      data: {
        participant1Id: userId,
        participant2Id: targetUserId,
      },
    });
  }
}
