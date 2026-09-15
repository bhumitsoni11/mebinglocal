import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VerificationService, SubmitVerificationDto } from './verification.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('verification')
@UseGuards(AuthGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('my-application')
  async getMyApplication(@CurrentUser() user: User) {
    return this.verificationService.getMyApplication(user);
  }

  @Post('apply')
  async submitApplication(@CurrentUser() user: User, @Body() body: SubmitVerificationDto) {
    return this.verificationService.submitApplication(user, body);
  }
}
