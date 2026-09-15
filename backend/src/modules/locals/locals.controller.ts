import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LocalsService, LocalFilterDto } from './locals.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('locals')
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}

  @Get()
  async findAll(@Query() query: LocalFilterDto) {
    return this.localsService.findAll(query);
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  async getDashboard(@CurrentUser() user: User) {
    return this.localsService.getDashboardStats(user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.localsService.findById(id);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@CurrentUser() user: User, @Body() body: any) {
    return this.localsService.updateProfile(user.id, body);
  }
}
