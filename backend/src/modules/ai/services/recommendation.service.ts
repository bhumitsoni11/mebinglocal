import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { buildRecommendationPrompt } from '../prompts/recommendation.prompts';
import { RecommendationRequestDto } from '../dto/recommendation.dto';

export interface RecommendationResult {
  recommendations: {
    itemId: string;
    score: number;
    reason: string;
  }[];
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService,
  ) {}

  async getRecommendations(userId: string, request: RecommendationRequestDto): Promise<RecommendationResult> {
    this.logger.log(`Fetching recommendations for user ${userId}`);

    // Fetch user preferences and past bookings
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        travelerProfile: { include: { interests: { include: { interest: true } } } },
        bookingsAsTraveler: { take: 5, include: { experience: true } },
      },
    });

    // Rule-based DB retrieval (Experiences as an example)
    const candidates = await this.prisma.experience.findMany({
      where: {
        isActive: true,
        ...(request.destination && { location: { contains: request.destination, mode: 'insensitive' } }),
      },
      take: 15,
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        price: true,
      }
    });

    if (candidates.length === 0) return { recommendations: [] };

    const travelerPrefs = {
      interests: user?.travelerProfile?.interests.map(i => i.interest.name),
      pastBookings: user?.bookingsAsTraveler.map(b => b.experience?.category),
    };

    const prompt = buildRecommendationPrompt(travelerPrefs, candidates);

    const result = await this.openaiService.generateStructuredOutput<RecommendationResult>([
      { role: 'system', content: prompt }
    ], { temperature: 0.3 });

    result.recommendations.sort((a, b) => b.score - a.score);
    return result;
  }
}
