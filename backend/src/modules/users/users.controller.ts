import { Controller, Get, Patch, Post, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Get('me/saved-items')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user saved items' })
  async getSavedItems(@CurrentUser() user: any) {
    return this.usersService.getSavedItems(user.id);
  }

  @Post('me/saved-items')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save an item (LOCAL_FRIEND, EXPERIENCE, LOCAL_PULSE)' })
  async saveItem(
    @CurrentUser() user: any,
    @Body() body: { itemType: string; itemId: string },
  ) {
    return this.usersService.saveItem(user.id, body.itemType, body.itemId);
  }

  @Delete('me/saved-items/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a saved item' })
  async removeSavedItem(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.usersService.removeSavedItem(user.id, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUser(@Param('id') id: string) {
    // Only return public info in a real app, but returning full for now
    return this.usersService.findById(id);
  }
}
