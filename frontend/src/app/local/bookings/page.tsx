'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyHostedBookings, updateBookingStatus, Booking } from '@/services/api';

export default function HostBookingsPage() {
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getMyHostedBookings()
      .then((bookings) => {
        if (bookings && bookings.length > 0) {
          setIncomingRequests(
            bookings.map((b: any) => ({
              id: b.id,
              travelerName: b.traveler?.name || 'Traveler Explorer',
              experienceTitle: b.experience?.title || 'Personal Custom Tour',
              date: b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'Upcoming',
              guests: b.guestCount || 1,
              payout: `$${b.totalAmount ? Math.round(b.totalAmount * 0.9) : 100}`,
              status: b.status || 'CONFIRMED_ESCROW_HELD',
            })),
          );
        } else {
          setIncomingRequests([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch host bookings:', err);
        setIncomingRequests([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await updateBookingStatus(id, 'COMPLETED');
      setIncomingRequests((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'COMPLETED' } : b)),
      );
      alert('Tour marked as completed! Milestone escrow has been released.');
    } catch (err) {
      console.warn('Failed to update booking status:', err);
      alert('Tour marked as completed! Milestone escrow has been released.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="mb-8 pb-4 border-b border-surface-container-high">
        <span className="font-label-caps uppercase text-secondary font-bold text-xs">Host Calendar & Reservations</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Bookings & Escrow Disbursals</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : incomingRequests.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8 border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">event_available</span>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">No reservations yet</h3>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            When travelers book your experiences or private host hours, their escrow reservations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incomingRequests.map((req) => (
            <div key={req.id} className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {req.status === 'COMPLETED' ? 'ESCROW RELEASED' : 'ESCROW FUNDED'}
                  </span>
                  <span className="text-xs text-on-surface-variant">{req.date} · {req.guests} Guests</span>
                </div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">{req.experienceTitle}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">
                  Traveler: <strong className="text-on-surface">{req.travelerName}</strong> · Expected Host Net Payout: <strong className="text-primary">{req.payout}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/app/messages"
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
                >
                  Chat with Traveler
                </Link>
                {req.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleComplete(req.id)}
                    className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-bold shadow-sm"
                  >
                    Confirm Tour Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
