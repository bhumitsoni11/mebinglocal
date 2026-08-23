import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('TRAVELER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay payment order for a booking' })
  createOrder(
    @CurrentUser() user: any,
    @Body() dto: CreatePaymentOrderDto,
  ) {
    return this.paymentsService.createOrder(user.id, dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Razorpay webhook receiver' })
  webhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: any,
  ) {
    return this.paymentsService.verifyWebhook(signature, body);
  }
}
