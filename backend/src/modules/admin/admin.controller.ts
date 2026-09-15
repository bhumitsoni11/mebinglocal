import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User, UserRole, VerificationStatus } from '@prisma/client';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('verification/applications')
  async getVerificationApplications(@Query('status') status?: VerificationStatus) {
    return this.adminService.getVerificationApplications(status);
  }

  @Put('verification/applications/:id/review')
  async reviewApplication(
    @Param('id') id: string,
    @CurrentUser() adminUser: User,
    @Body() body: { status: VerificationStatus; adminNotes?: string },
  ) {
    return this.adminService.reviewApplication(id, adminUser, body);
  }

  @Get('users')
  async getUsers(@Query('search') search?: string, @Query('role') role?: UserRole) {
    return this.adminService.getUsers(search, role);
  }

  @Put('users/:id/toggle-active')
  async toggleUserActive(@Param('id') id: string, @CurrentUser() adminUser: User) {
    return this.adminService.toggleUserActive(id, adminUser);
  }

  @Get('system-health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }
}
