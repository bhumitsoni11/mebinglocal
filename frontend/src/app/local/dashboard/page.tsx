'use client';

import React from 'react';
import Link from 'next/link';

export default function HostDashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-caps text-xs font-bold uppercase mb-2">
            <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            Emerald Verified Host Portal
          </div>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface">Host Command Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/local/experiences"
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all shadow-sm"
          >
            + Create New Experience
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Total Earnings (YTD)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-xl text-3xl font-bold text-on-surface">$4,850</span>
            <span className="text-xs text-emerald-600 font-bold">+18% vs last mo</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">Paid directly via escrow</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Upcoming Bookings</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-xl text-3xl font-bold text-on-surface">8</span>
            <span className="text-xs text-primary font-bold">3 this week</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">Next: Tomorrow at 09:30 AM</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Host Rating</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-xl text-3xl font-bold text-amber-500">4.98</span>
            <span className="text-xs text-on-surface-variant font-medium">(124 reviews)</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">Superhost Status Active</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Response SLA</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-xl text-3xl font-bold text-secondary">&lt; 10m</span>
            <span className="text-xs text-secondary font-bold">100% Rate</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-2">Faster than 94% of hosts</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/local/bookings"
          className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex flex-col justify-between group"
        >
          <div>
            <span className="material-symbols-outlined text-3xl text-primary mb-3">calendar_month</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Manage Bookings & Escrow
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Review incoming traveler requests, approve slots, and confirm completed tours.
            </p>
          </div>
          <span className="text-primary font-bold text-xs mt-4 flex items-center gap-1">
            Open Bookings →
          </span>
        </Link>

        <Link
          href="/local/experiences"
          className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex flex-col justify-between group"
        >
          <div>
            <span className="material-symbols-outlined text-3xl text-secondary mb-3">palette</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Curated Experiences
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Create and edit unscripted itineraries, set maximum group sizes, and update pricing.
            </p>
          </div>
          <span className="text-primary font-bold text-xs mt-4 flex items-center gap-1">
            Manage Catalog →
          </span>
        </Link>

        <Link
          href="/local/earnings"
          className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex flex-col justify-between group"
        >
          <div>
            <span className="material-symbols-outlined text-3xl text-tertiary mb-3">account_balance</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Payouts & Financials
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Configure direct bank account transfers and review milestone release history.
            </p>
          </div>
          <span className="text-primary font-bold text-xs mt-4 flex items-center gap-1">
            View Statements →
          </span>
        </Link>
      </div>
    </div>
  );
}
