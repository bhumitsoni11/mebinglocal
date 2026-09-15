import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@CurrentUser() user: User) {
    return this.notificationsService.getUserNotifications(user);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.markAsRead(id, user);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user);
  }
}
