import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  private razorpay: any;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });
  }

  async createOrder(userId: string, data: CreatePaymentOrderDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.travelerId !== userId) {
      throw new BadRequestException('You do not own this booking');
    }
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Booking must be CONFIRMED before payment');
    }

    // Calculate commission (e.g. 15% platform fee)
    const grossAmount = booking.totalAmount;
    const platformCommission = Math.round(grossAmount * 0.15);
    const localFriendAmount = grossAmount - platformCommission;

    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId: booking.id },
    });

    if (existingPayment && existingPayment.status === 'COMPLETED') {
      throw new BadRequestException('Payment already completed');
    }

    try {
      const options = {
        amount: grossAmount, // minor units (e.g., paise, cents)
        currency: booking.currency,
        receipt: `receipt_${booking.id}`,
      };

      const order = await this.razorpay.orders.create(options);

      // Upsert payment record
      const payment = await this.prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: {
          razorpayOrderId: order.id,
          amount: grossAmount,
          platformCommission,
          localFriendAmount,
          status: 'PENDING',
        },
        create: {
          bookingId: booking.id,
          userId,
          amount: grossAmount,
          platformCommission,
          localFriendAmount,
          currency: booking.currency,
          status: 'PENDING',
          razorpayOrderId: order.id,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
      };
    } catch (error) {
      this.logger.error('Failed to create Razorpay order', error);
      throw new BadRequestException('Payment initialization failed');
    }
  }

  async verifyWebhook(signature: string, body: any) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
    
    // Stringify body carefully to match raw body. Note: In Fastify, you might need raw body parsing.
    // For simplicity, assuming JSON stringified matches.
    const payload = JSON.stringify(body);
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.event;
    if (event === 'payment.captured') {
      const paymentEntity = body.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      await this.prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          status: 'COMPLETED',
          razorpayPaymentId: paymentId,
        },
      });
      
      this.logger.log(`Payment captured for order ${orderId}`);
    }

    return { received: true };
  }
}
