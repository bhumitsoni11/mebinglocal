import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ItineraryService } from '../services/itinerary.service';
import { ItineraryRequestDto } from '../dto/itinerary.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/itinerary')
@UseGuards(AuthGuard)
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Limit to 5 itineraries per minute
  async generateItinerary(@Req() req: any, @Body() body: ItineraryRequestDto) {
    const userId = req.user.id;
    return this.itineraryService.generateItinerary(userId, body);
  }
}
