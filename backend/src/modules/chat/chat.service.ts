import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserConversations(user: User) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId: user.id },
      include: {
        conversation: {
          include: {
            booking: {
              include: {
                experience: { select: { title: true } },
              },
            },
            participants: {
              include: {
                user: { select: { id: true, name: true, avatar: true, role: true } },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    });

    return participants.map((p) => {
      const otherParticipant = p.conversation.participants.find((part) => part.userId !== user.id);
      return {
        id: p.conversation.id,
        booking: p.conversation.booking,
        lastMessage: p.conversation.messages[0] || null,
        lastMessageAt: p.conversation.lastMessageAt,
        otherUser: otherParticipant?.user || null,
      };
    });
  }

  async getMessages(conversationId: string, user: User) {
    const isMember = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: user.id } },
    });

    if (!isMember && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Not authorized to access this conversation');
    }

    // Update lastReadAt
    await this.prisma.conversationParticipant.updateMany({
      where: { conversationId, userId: user.id },
      data: { lastReadAt: new Date() },
    });

    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(conversationId: string, user: User, content: string, mediaUrl?: string) {
    const isMember = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: user.id } },
    });

    if (!isMember) {
      throw new ForbiddenException('Not a member of this conversation');
    }

    const now = new Date();

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderUserId: user.id,
          content,
          mediaUrl: mediaUrl || null,
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: now },
      }),
    ]);

    return message;
  }
}
