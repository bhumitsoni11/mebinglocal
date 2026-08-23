import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DiscoveryService } from '../services/discovery.service';
import { DiscoveryRequestDto } from '../dto/discovery.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/discovery')
@UseGuards(AuthGuard)
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Post()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  async parseQueryAndSearch(@Req() req: any, @Body() body: DiscoveryRequestDto) {
    const userId = req.user.id;
    return this.discoveryService.parseQueryAndSearch(userId, body);
  }
}
