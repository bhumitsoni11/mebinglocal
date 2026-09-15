import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { TravelersService } from './travelers.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User, SavedItemType } from '@prisma/client';

@Controller('travelers')
@UseGuards(AuthGuard)
export class TravelersController {
  constructor(private readonly travelersService: TravelersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.travelersService.getProfile(user.id);
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: User, @Body() body: any) {
    return this.travelersService.updateProfile(user.id, body);
  }

  @Get('saved')
  async getSavedItems(@CurrentUser() user: User) {
    return this.travelersService.getSavedItems(user.id);
  }

  @Post('saved/toggle')
  async toggleSaveItem(
    @CurrentUser() user: User,
    @Body('itemType') itemType: SavedItemType,
    @Body('targetId') targetId: string,
  ) {
    return this.travelersService.toggleSaveItem(user.id, itemType, targetId);
  }
}
