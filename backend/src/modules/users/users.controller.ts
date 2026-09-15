import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() body: { name?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(user.id, body);
  }
}
