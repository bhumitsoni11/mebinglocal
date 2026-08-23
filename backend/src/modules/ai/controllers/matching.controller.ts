import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MatchingService } from '../services/matching.service';
import { MatchingRequestDto } from '../dto/matching.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/match')
@UseGuards(AuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('local-friends')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async matchLocalFriends(@Req() req: any, @Body() body: MatchingRequestDto) {
    const userId = req.user.id;
    return this.matchingService.matchLocalFriends(userId, body);
  }
}
