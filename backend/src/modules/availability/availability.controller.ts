import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an availability slot' })
  create(
    @CurrentUser() user: any,
    @Body() createDto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.create(user.id, createDto);
  }

  @Get('local-friend/:localFriendId')
  @ApiOperation({ summary: 'Get availability for a specific local friend' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findByLocalFriend(
    @Param('localFriendId') localFriendId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.availabilityService.findByLocalFriend(localFriendId, startDate, endDate);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an availability slot' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.availabilityService.remove(user.id, id);
  }
}
