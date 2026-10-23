import { Controller, Get, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { GeoService } from './geo.service';

@Controller('destinations')
export class DestinationsController {
  constructor(
    private readonly destinationsService: DestinationsService,
    private readonly geoService: GeoService,
  ) {}

  @Get()
  async findAll(
    @Query('trending') trending?: string,
    @Query('search') search?: string,
    @Query('country') country?: string,
    @Query('region') region?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const isTrending = trending === 'true' ? true : trending === 'false' ? false : undefined;
    return this.destinationsService.findAll({
      isTrending,
      search,
      country,
      region,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('countries')
  async getCountries() {
    return this.destinationsService.getCountries();
  }

  // --- Dynamic Live External Geo API Endpoints ---

  @Get('geo/countries')
  async getGeoCountries() {
    return this.geoService.getCountries();
  }

  @Get('geo/states')
  async getGeoStates(@Query('country') country: string) {
    if (!country) return [];
    return this.geoService.getStatesByCountry(country);
  }

  @Get('geo/cities')
  async getGeoCities(
    @Query('country') country: string,
    @Query('state') state?: string,
  ) {
    if (!country) return [];
    return this.geoService.getCitiesByState(country, state);
  }

  @Get('geo/search')
  async searchGeo(@Query('q') query: string) {
    return this.geoService.searchLocations(query || '');
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.destinationsService.findBySlug(slug);
  }
}
