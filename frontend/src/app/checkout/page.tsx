'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hostId = searchParams?.get('hostId');
  const experienceId = searchParams?.get('experienceId');
  const date = searchParams?.get('date') || '2025-10-20';
  const hours = searchParams?.get('hours') || '3';
  const guests = searchParams?.get('guests') || '2';
  const total = searchParams?.get('total') || '115';

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card' | 'upi'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setBookingRef(`MEB-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mb-2">
          Booking Confirmed & Protected!
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
          Your payment of <strong className="text-primary">${total}</strong> is held securely in MebingLocal escrow until your journey is completed.
        </p>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high text-left mb-8 space-y-3">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Booking Reference</span>
            <span className="font-mono font-bold text-on-surface">{bookingRef}</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Scheduled Date</span>
            <span className="font-semibold text-on-surface">{date}</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Escrow Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              ESCROW LOCKED (100% PROTECTED)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/app/trips"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all text-center"
          >
            View in My Trips
          </Link>
          <Link
            href="/app/messages"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-all text-center"
          >
            Message Host
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mb-2">
          Confirm and Pay
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant mb-8">
          Protected by MebingLocal Escrow Guarantee
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Payment Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-sm space-y-4">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">Payment Method</h3>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-surface-container-high bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-primary"
                    />
                    <div>
                      <span className="font-label-md text-sm font-bold text-on-surface block">
                        Razorpay Secure Checkout
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        Cards, UPI, Netbanking, International Currencies
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-xl">payments</span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-surface-container-high bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-primary"
                    />
                    <div>
                      <span className="font-label-md text-sm font-bold text-on-surface block">
                        Credit / Debit Card
                      </span>
                      <span className="text-xs text-on-surface-variant">Visa, Mastercard, Amex</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-xl">credit_card</span>
                </label>
              </div>
            </div>

            {/* Escrow Badge Notice */}
            <div className="p-6 rounded-3xl bg-secondary-container/30 border border-secondary-container flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary text-2xl mt-0.5">verified_user</span>
              <div>
                <h4 className="font-label-md font-bold text-on-secondary-container text-sm">
                  Milestone Escrow Guarantee
                </h4>
                <p className="text-xs text-on-secondary-container/80 mt-1 leading-relaxed">
                  Your funds are not disbursed to the host upfront. MebingLocal holds the payment in escrow until after your journey concludes and you confirm satisfaction.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">autorenew</span>
                  <span>Securing Payment & Escrow...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>Pay ${total} & Confirm Booking</span>
                </>
              )}
            </button>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-md space-y-5">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface pb-3 border-b border-surface-container-high">
                Booking Summary
              </h3>

              <div className="space-y-2 text-sm text-on-surface">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Date</span>
                  <span className="font-semibold">{date}</span>
                </div>
                {hostId && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Guided Time</span>
                    <span className="font-semibold">{hours} Hours</span>
                  </div>
                )}
                {experienceId && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Party Size</span>
                    <span className="font-semibold">{guests} Explorers</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-surface-container-high space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${Math.round(Number(total) * 0.9)}</span>
                </div>
                <div className="flex justify-between">
                  <span>MebingLocal Escrow & Support</span>
                  <span>${Math.round(Number(total) * 0.1)}</span>
                </div>
                <div className="pt-2 border-t border-surface-container-high flex justify-between font-bold text-base text-on-surface">
                  <span>Total Amount</span>
                  <span className="text-primary font-bold">${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body-md text-on-surface-variant">Loading checkout details...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
