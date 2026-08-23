import { Controller, Get, Post, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new report' })
  create(
    @CurrentUser() user: any,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.create(user.id, createReportDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all reports (Admin only)' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reportsService.findAll(page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update report status (Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: any; resolution?: string },
  ) {
    return this.reportsService.updateStatus(id, body.status, body.resolution);
  }
}
