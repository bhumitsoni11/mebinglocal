import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { buildSafetyPrompt } from '../prompts/safety.prompts';

export interface SafetyResult {
  trustIndicators: string[];
  areasForCaution: string[];
  summary: string;
}

@Injectable()
export class SafetyAiService {
  private readonly logger = new Logger(SafetyAiService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService,
  ) {}

  async analyzeSafety(localFriendId: string): Promise<SafetyResult> {
    this.logger.log(`Analyzing safety trust signals for Local Friend ${localFriendId}`);

    const lfProfile = await this.prisma.localFriendProfile.findUnique({
      where: { userId: localFriendId },
      include: {
        user: {
          select: {
            isActive: true,
            createdAt: true,
            verificationDocs: { select: { status: true } },
            reportsReceived: { select: { status: true, reportType: true } },
            bookingsAsLocalFriend: { select: { status: true } }
          }
        }
      }
    });

    if (!lfProfile) {
      throw new NotFoundException('Local Friend not found');
    }

    // Aggregate signals
    const verificationStatus = lfProfile.isVerified ? 'VERIFIED' : 'UNVERIFIED';
    const totalBookings = lfProfile.user.bookingsAsLocalFriend.length;
    const completedBookings = lfProfile.user.bookingsAsLocalFriend.filter(b => b.status === 'COMPLETED').length;
    const cancelledBookings = lfProfile.user.bookingsAsLocalFriend.filter(b => b.status === 'CANCELLED').length;
    const activeReports = lfProfile.user.reportsReceived.filter(r => r.status === 'OPEN' || r.status === 'INVESTIGATING').length;

    const signals = {
      verificationStatus,
      totalReviews: lfProfile.totalReviews,
      rating: lfProfile.rating,
      accountAgeDays: Math.floor((Date.now() - lfProfile.user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      reports: {
        active: activeReports,
      }
    };

    const prompt = buildSafetyPrompt(signals);

    return this.openaiService.generateStructuredOutput<SafetyResult>([
      { role: 'system', content: prompt }
    ], { temperature: 0.1 });
  }
}
