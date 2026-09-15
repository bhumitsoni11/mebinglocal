import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExperiencesService, ExperienceFilterDto } from './experiences.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  async findAll(@Query() query: ExperienceFilterDto) {
    return this.experiencesService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.experiencesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@CurrentUser() user: User, @Body() body: any) {
    return this.experiencesService.create(user.id, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @CurrentUser() user: User, @Body() body: any) {
    return this.experiencesService.update(id, user.id, body);
  }
}
