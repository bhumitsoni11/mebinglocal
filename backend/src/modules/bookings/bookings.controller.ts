import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('TRAVELER', 'ADMIN') // Only travelers book
  @ApiOperation({ summary: 'Create a new booking request' })
  create(
    @CurrentUser() user: any,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.id, createBookingDto);
  }

  @Get('traveler')
  @ApiOperation({ summary: 'Get all bookings for current traveler' })
  findByTraveler(@CurrentUser() user: any) {
    return this.bookingsService.findByTraveler(user.id);
  }

  @Get('local-friend')
  @UseGuards(RolesGuard)
  @Roles('LOCAL_FRIEND', 'ADMIN')
  @ApiOperation({ summary: 'Get all bookings for current local friend' })
  findByLocalFriend(@CurrentUser() user: any) {
    return this.bookingsService.findByLocalFriend(user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status (accept, reject, cancel, complete)' })
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(user.id, id, updateBookingStatusDto);
  }
}
