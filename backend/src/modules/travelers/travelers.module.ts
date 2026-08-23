import { Module } from '@nestjs/common';
import { TravelersController } from './travelers.controller';
import { TravelersService } from './travelers.service';

@Module({
  controllers: [TravelersController],
  providers: [TravelersService]
})
export class TravelersModule {}
