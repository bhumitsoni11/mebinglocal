import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { buildMatchingPrompt } from '../prompts/matching.prompts';
import { MatchingRequestDto } from '../dto/matching.dto';

export interface MatchResult {
  matches: {
    localFriendId: string;
    matchScore: number;
    reasons: string[];
  }[];
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService,
  ) {}

  async matchLocalFriends(userId: string, request: MatchingRequestDto): Promise<MatchResult> {
    this.logger.log(`Matching Local Friends for user ${userId}`);

    // Step 1: Database filtering (Hard constraints to reduce AI token usage)
    const candidates = await this.prisma.localFriendProfile.findMany({
      where: {
        user: { isActive: true },
        location: {
          contains: request.destination,
          mode: 'insensitive',
        },
        ...(request.maxHourlyRate && {
          hourlyRate: { lte: request.maxHourlyRate }
        })
      },
      include: {
        interests: { include: { interest: true } },
        languages: { include: { language: true } },
        user: { select: { firstName: true } } // minimal user data
      },
      take: 20, // Limit candidates sent to AI
    });

    if (candidates.length === 0) {
      return { matches: [] };
    }

    // Step 2: Format candidates for AI (Minimizing PII)
    const formattedCandidates = candidates.map((c: any) => ({
      localFriendId: c.id,
      name: c.user?.firstName,
      bio: c.bio,
      rating: c.rating,
      interests: c.interests?.map((i: any) => i.interest.name),
      languages: c.languages?.map((l: any) => l.language.name),
      hourlyRate: c.hourlyRate,
    }));

    const travelerPrefs = {
      destination: request.destination,
      interests: request.interests,
      languages: request.languages,
    };

    const prompt = buildMatchingPrompt(travelerPrefs, formattedCandidates);

    // Step 3: Semantic ranking via AI
    const result = await this.openaiService.generateStructuredOutput<MatchResult>([
      { role: 'system', content: prompt }
    ], { temperature: 0.2 });

    // Optional: Log match request to database for audit/analytics
    await this.prisma.aIMatchRequest.create({
      data: {
        travelerId: userId,
        preferences: travelerPrefs as any,
        matchResult: result as any,
      }
    }).catch(e => this.logger.warn('Failed to save AI match request audit log', e));

    // Sort by score descending
    result.matches.sort((a, b) => b.matchScore - a.matchScore);
    
    return result;
  }
}
