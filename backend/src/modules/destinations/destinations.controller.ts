import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async findAll(@Query('trending') trending?: string) {
    const isTrending = trending === 'true' ? true : trending === 'false' ? false : undefined;
    return this.destinationsService.findAll({ isTrending });
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.destinationsService.findBySlug(slug);
  }
}
