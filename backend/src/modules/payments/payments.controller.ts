import { Controller, Post, Body, Headers, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(AuthGuard)
  async createOrder(@CurrentUser() user: User, @Body('bookingId') bookingId: string) {
    return this.paymentsService.createOrder(bookingId, user);
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  async verifyPayment(
    @Body()
    body: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ) {
    return this.paymentsService.verifyPayment(body);
  }

  @Post('webhook')
  async webhook(
    @Req() req: FastifyRequest,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return this.paymentsService.handleWebhook(rawBody, signature || '');
  }
}
