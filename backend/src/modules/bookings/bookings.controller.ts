import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService, CreateBookingDto } from './bookings.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User, BookingStatus } from '@prisma/client';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@CurrentUser() user: User, @Body() body: CreateBookingDto) {
    return this.bookingsService.createBooking(user, body);
  }

  @Get('my-trips')
  async getTravelerBookings(@CurrentUser() user: User) {
    return this.bookingsService.getTravelerBookings(user.id);
  }

  @Get('my-hosted')
  async getLocalBookings(@CurrentUser() user: User) {
    return this.bookingsService.getLocalBookings(user.id);
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.getBookingById(id, user);
  }

  @Put(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingsService.updateBookingStatus(id, user, status);
  }
}
