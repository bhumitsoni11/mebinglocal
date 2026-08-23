import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new experience' })
  create(
    @CurrentUser() user: any,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return this.experiencesService.create(user.id, createExperienceDto);
  }

  @Get('local-friend/:localFriendId')
  @ApiOperation({ summary: 'Get all experiences for a specific local friend' })
  findAll(@Param('localFriendId') localFriendId: string) {
    return this.experiencesService.findAllByLocalFriend(localFriendId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific experience' })
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an experience' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(user.id, id, updateExperienceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an experience' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.experiencesService.remove(user.id, id);
  }
}
