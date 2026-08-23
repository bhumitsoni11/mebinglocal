import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AssistantService } from '../services/assistant.service';
import { AssistantRequestDto } from '../dto/assistant.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/assistant')
@UseGuards(AuthGuard)
export class AiAssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Limit to 10 queries per minute
  async handleQuery(@Req() req: any, @Body() body: AssistantRequestDto) {
    const userId = req.user.id;
    return this.assistantService.handleQuery(userId, body.query, body.contextOverrides);
  }
}
