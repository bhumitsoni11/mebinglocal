import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LocalPulseService } from './local-pulse.service';
import { CreateLocalPulseDto } from './dto/create-local-pulse.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Local Pulse')
@Controller('local-pulse')
export class LocalPulseController {
  constructor(private readonly localPulseService: LocalPulseService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Local Pulse post' })
  create(
    @CurrentUser() user: any,
    @Body() createLocalPulseDto: CreateLocalPulseDto,
  ) {
    return this.localPulseService.create(user.id, createLocalPulseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Local Pulse feed' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.localPulseService.findAll(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Local Pulse post' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.localPulseService.remove(user.id, id);
  }
}
