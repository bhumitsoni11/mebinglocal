import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { GeoService } from './geo.service';

@Module({
  controllers: [DestinationsController],
  providers: [DestinationsService, GeoService],
  exports: [DestinationsService, GeoService],
})
export class DestinationsModule {}
