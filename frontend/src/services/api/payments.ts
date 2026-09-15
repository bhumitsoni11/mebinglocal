import { api } from '@/lib/api';

export interface CreatePaymentOrderDto {
  bookingId: string;
}

export interface VerifyPaymentDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingId: string;
}

export async function createPaymentOrder(dto: CreatePaymentOrderDto): Promise<any> {
  return api.post('/payments/create-order', dto);
}

export async function verifyPayment(dto: VerifyPaymentDto): Promise<any> {
  return api.post('/payments/verify', dto);
}
