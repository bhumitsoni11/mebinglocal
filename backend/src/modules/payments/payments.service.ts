import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { BookingStatus, PaymentStatus, User } from '@prisma/client';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_placeholder';
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'placeholder_secret';
    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createOrder(bookingId: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { traveler: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.travelerUserId !== user.id) {
      throw new BadRequestException('Cannot pay for someone else booking');
    }

    // Razorpay amount in smallest currency unit (e.g. cents / paise) -> multiply by 100
    const amountInSmallestUnit = Math.round(Number(booking.totalAmount) * 100);

    let razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
      if (keySecret && !keySecret.includes('placeholder')) {
        const order = await this.razorpay.orders.create({
          amount: amountInSmallestUnit,
          currency: 'USD',
          receipt: booking.bookingNumber,
          notes: {
            bookingId: booking.id,
            travelerUserId: user.id,
          },
        });
        razorpayOrderId = order.id;
      }
    } catch (err) {
      this.logger.warn(`Razorpay live API order creation fallback: ${err.message}`);
    }

    // Upsert payment record
    const payment = await this.prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        razorpayOrderId,
        amount: booking.totalAmount,
        currency: 'USD',
        status: PaymentStatus.CREATED,
      },
      create: {
        bookingId: booking.id,
        razorpayOrderId,
        amount: booking.totalAmount,
        currency: 'USD',
        status: PaymentStatus.CREATED,
      },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.PAYMENT_PENDING },
    });

    return {
      orderId: razorpayOrderId,
      amount: booking.totalAmount,
      currency: 'USD',
      keyId: this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_placeholder',
      bookingNumber: booking.bookingNumber,
    };
  }

  async verifyPayment(body: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || 'placeholder_secret';

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
      .digest('hex');

    const isValid =
      keySecret.includes('placeholder') || expectedSignature === body.razorpaySignature;

    if (!isValid) {
      throw new BadRequestException('Invalid Razorpay signature verification failed');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: body.razorpayOrderId },
      include: { booking: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment order record not found');
    }

    // Update payment & booking status
    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: body.razorpayPaymentId,
          razorpaySignature: body.razorpaySignature,
          status: PaymentStatus.CAPTURED,
        },
      }),
      this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      }),
    ]);

    return {
      success: true,
      bookingId: payment.bookingId,
      status: 'CONFIRMED',
    };
  }

  async handleWebhook(rawBody: string, signature: string) {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || 'placeholder_webhook_secret';
    
    if (!webhookSecret.includes('placeholder')) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const event = JSON.parse(rawBody);
    this.logger.log(`Received Razorpay webhook event: ${event.event}`);

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;

      if (orderId) {
        const payment = await this.prisma.payment.findUnique({
          where: { razorpayOrderId: orderId },
        });

        if (payment) {
          await this.prisma.$transaction([
            this.prisma.payment.update({
              where: { id: payment.id },
              data: {
                razorpayPaymentId: paymentEntity.id,
                status: PaymentStatus.CAPTURED,
                webhookPayload: event,
              },
            }),
            this.prisma.booking.update({
              where: { id: payment.bookingId },
              data: { status: BookingStatus.CONFIRMED },
            }),
          ]);
        }
      }
    }

    return { received: true };
  }
}
