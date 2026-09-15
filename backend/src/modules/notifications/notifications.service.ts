import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { User } from '@prisma/client';
import { Resend } from 'resend';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private resend: Resend | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (resendApiKey && !resendApiKey.startsWith('re_placeholder')) {
      this.resend = new Resend(resendApiKey);
    }
  }

  async getUserNotifications(user: User) {
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAsRead(id: string, user: User) {
    return this.prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(user: User) {
    return this.prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string) {
    if (this.resend) {
      try {
        const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'concierge@mebinglocal.com';
        await this.resend.emails.send({
          from: fromEmail,
          to,
          subject,
          html: htmlContent,
        });
        this.logger.log(`Email dispatched to ${to}: ${subject}`);
      } catch (err) {
        this.logger.warn(`Resend email dispatch error: ${err.message}`);
      }
    } else {
      this.logger.debug(`[Mock Email] To: ${to} | Subject: ${subject}`);
    }
  }

  async createNotification(userId: string, title: string, message: string, type: string, linkUrl?: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        linkUrl: linkUrl || null,
      },
    });
  }
}
