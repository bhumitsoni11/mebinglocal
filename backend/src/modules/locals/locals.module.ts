import { Module } from '@nestjs/common';
import { LocalsController } from './locals.controller';
import { LocalsService } from './locals.service';

@Module({
  controllers: [LocalsController],
  providers: [LocalsService],
  exports: [LocalsService],
})
export class LocalsModule {}
