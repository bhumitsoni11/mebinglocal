import { Module } from '@nestjs/common';
import { LocalPulseService } from './local-pulse.service';
import { LocalPulseController } from './local-pulse.controller';

@Module({
  controllers: [LocalPulseController],
  providers: [LocalPulseService],
  exports: [LocalPulseService],
})
export class LocalPulseModule {}
