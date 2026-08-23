import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';
import { buildAssistantSystemPrompt } from '../prompts/assistant.prompts';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly prisma: PrismaService,
  ) {}

  async handleQuery(userId: string, query: string, contextOverrides?: Record<string, any>) {
    this.logger.log(`Handling assistant query for user ${userId}`);

    // Fetch user context from DB securely (TravelerProfile, Interests)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        travelerProfile: {
          include: { interests: { include: { interest: true } }, languages: { include: { language: true } } },
        },
      },
    });

    // Build context, removing sensitive PII
    const context = {
      travelStyle: user?.travelerProfile?.travelStyle,
      budgetLevel: user?.travelerProfile?.budgetLevel,
      interests: user?.travelerProfile?.interests.map(i => i.interest.name),
      languages: user?.travelerProfile?.languages.map(l => l.language.name),
      ...contextOverrides,
    };

    const systemPrompt = buildAssistantSystemPrompt(context);

    // Make the call via central OpenAI service
    const responseText = await this.openaiService.generateCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ]);

    return { response: responseText };
  }
}
