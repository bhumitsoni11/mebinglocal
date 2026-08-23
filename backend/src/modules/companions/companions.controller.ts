import { Controller, Get, Patch, Post, Body, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CompanionsService } from './companions.service';
import { UpdateLocalFriendDto } from './dto/update-local-friend.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Local Friends')
@Controller('local-friends')
export class CompanionsController {
  constructor(private readonly companionsService: CompanionsService) {}

  @Get()
  @ApiOperation({ summary: 'Search and discover local friends' })
  @ApiQuery({ name: 'destination', required: false })
  @ApiQuery({ name: 'languageId', required: false })
  @ApiQuery({ name: 'interestId', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'isVerified', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async search(@Query() query: any) {
    return this.companionsService.search(query);
  }

  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current local friend profile' })
  async getMe(@CurrentUser() user: any) {
    return this.companionsService.findByUserId(user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current local friend profile' })
  async updateMe(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateLocalFriendDto,
  ) {
    return this.companionsService.updateByUserId(user.id, updateDto);
  }

  @Post('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create current local friend profile' })
  async createMe(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateLocalFriendDto,
  ) {
    return this.companionsService.createProfile(user.id, updateDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get local friend by ID' })
  async getById(@Param('id') id: string) {
    return this.companionsService.findById(id);
  }
}
