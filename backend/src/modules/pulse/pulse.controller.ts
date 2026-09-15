import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { PulseService } from './pulse.service';

@Controller('pulse')
export class PulseController {
  constructor(private readonly pulseService: PulseService) {}

  @Get()
  async getFeed(
    @Query('destination') destination?: string,
    @Query('vibe') vibe?: string,
  ) {
    return this.pulseService.getFeed(destination, vibe);
  }

  @Post(':id/upvote')
  async upvote(@Param('id') id: string) {
    return this.pulseService.upvote(id);
  }
}
