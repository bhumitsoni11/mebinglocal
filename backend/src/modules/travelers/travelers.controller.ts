import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TravelersService } from './travelers.service';
import { UpdateTravelerDto } from './dto/update-traveler.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Travelers')
@Controller('travelers')
export class TravelersController {
  constructor(private readonly travelersService: TravelersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current traveler profile' })
  async getMe(@CurrentUser() user: any) {
    return this.travelersService.findByUserId(user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current traveler profile' })
  async updateMe(
    @CurrentUser() user: any,
    @Body() updateTravelerDto: UpdateTravelerDto,
  ) {
    return this.travelersService.updateByUserId(user.id, updateTravelerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get traveler profile by ID' })
  async getTraveler(@Param('id') id: string) {
    return this.travelersService.findByUserId(id);
  }
}
