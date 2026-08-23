import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TranslationService } from '../services/translation.service';
import { TranslationRequestDto } from '../dto/translation.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('v1/ai/translate')
@UseGuards(AuthGuard)
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async translateText(@Body() body: TranslationRequestDto) {
    return this.translationService.translateText(body);
  }
}
