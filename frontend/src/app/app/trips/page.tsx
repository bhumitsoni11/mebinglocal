'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMyTrips, Booking } from '@/services/api';

export default function TravelerTripsPage() {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getMyTrips()
      .then((trips) => {
        if (trips && trips.length > 0) {
          setUpcomingBookings(
            trips.map((t: any) => ({
              id: t.id,
              title: t.experience?.title || `Journey with ${t.local?.user?.name || 'Local Guide'}`,
              hostName: t.local?.user?.name || 'Local Guide',
              hostAvatar: t.local?.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
              location: `${t.local?.city || 'Tokyo'}, ${t.local?.destination?.country || 'Japan'}`,
              date: t.bookingDate ? new Date(t.bookingDate).toLocaleDateString() : 'Upcoming',
              status: t.status || 'CONFIRMED',
              escrowStatus: t.escrowStatus || 'HELD_IN_ESCROW',
              amount: `$${t.totalAmount || 150}`,
            })),
          );
        } else {
          setUpcomingBookings([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load traveler trips:', err);
        setUpcomingBookings([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-high">
        <div>
          <span className="font-label-caps uppercase text-secondary font-bold text-xs">Traveler Portal</span>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">My Journeys & Bookings</h1>
        </div>
        <Link
          href="/local-friends"
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all"
        >
          Book New Experience
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-48 rounded-3xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : upcomingBookings.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">luggage</span>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">No upcoming trips yet</h3>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Discover verified resident hosts in Kyoto, Florence, Tokyo, and Mexico City.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="font-headline-md text-xl font-bold text-on-surface">Upcoming Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingBookings.map((b) => (
              <div key={b.id} className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={b.hostAvatar} alt={b.hostName} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div>
                      <h4 className="font-label-lg text-sm font-bold text-on-surface">{b.hostName}</h4>
                      <p className="text-xs text-on-surface-variant">{b.location}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px] font-bold">
                    {b.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">{b.title}</h3>
                  <p className="text-xs text-primary font-semibold mt-1">{b.date}</p>
                </div>

                <div className="pt-3 border-t border-surface-container-low flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-secondary font-medium">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>100% Escrow Protected</span>
                  </div>
                  <Link
                    href="/app/messages"
                    className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold"
                  >
                    Message Host
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
