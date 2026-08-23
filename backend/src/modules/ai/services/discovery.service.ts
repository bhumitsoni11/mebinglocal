import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { buildDiscoveryPrompt } from '../prompts/discovery.prompts';
import { DiscoveryRequestDto } from '../dto/discovery.dto';

export interface DiscoveryFilters {
  interests: string[];
  timeOfDay: string | null;
  travelStyle: string | null;
  destination: string | null;
  budget: number | null;
}

@Injectable()
export class DiscoveryService {
  private readonly logger = new Logger(DiscoveryService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService,
  ) {}

  async parseQueryAndSearch(userId: string, request: DiscoveryRequestDto) {
    this.logger.log(`Parsing discovery intent for user ${userId}: ${request.query}`);

    const prompt = buildDiscoveryPrompt();

    // 1. Natural Language -> Structured Filters
    const filters = await this.openaiService.generateStructuredOutput<DiscoveryFilters>([
      { role: 'system', content: prompt },
      { role: 'user', content: request.query }
    ], { temperature: 0.1 });

    // 2. Structured Filters -> Prisma Query (Example for Local Friends)
    const localFriends = await this.prisma.localFriendProfile.findMany({
      where: {
        ...(filters.destination && { location: { contains: filters.destination, mode: 'insensitive' } }),
        ...(filters.budget && { hourlyRate: { lte: filters.budget } }),
        ...(filters.interests?.length > 0 && {
          interests: {
            some: {
              interest: {
                name: { in: filters.interests, mode: 'insensitive' }
              }
            }
          }
        })
      },
      include: {
        user: { select: { firstName: true, avatarUrl: true } },
        interests: { include: { interest: true } },
      },
      take: 10,
    });

    return { filters, results: { localFriends } };
  }
}
