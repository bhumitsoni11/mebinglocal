import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SafetyAiService } from '../services/safety-ai.service';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/safety')
@UseGuards(AuthGuard)
export class SafetyAiController {
  constructor(private readonly safetyAiService: SafetyAiService) {}

  @Get('local-friend/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async analyzeSafety(@Param('id') id: string) {
    return this.safetyAiService.analyzeSafety(id);
  }
}
