import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User, UserRole, OnboardingStatus } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }

  @Post('sync')
  async syncUser(
    @Body()
    body: {
      clerkUserId: string;
      email: string;
      name?: string;
      avatar?: string;
      role?: UserRole;
    },
  ) {
    return this.authService.syncUser(
      body.clerkUserId,
      body.email,
      body.name,
      body.avatar,
      body.role,
    );
  }

  @Post('onboarding')
  @UseGuards(AuthGuard)
  async updateOnboarding(
    @CurrentUser() user: User,
    @Body() body: { status: OnboardingStatus; role?: UserRole },
  ) {
    return this.authService.updateOnboarding(user, body);
  }
}
