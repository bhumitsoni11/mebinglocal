'use client';

import React from 'react';

export default function HostEarningsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="mb-8 pb-4 border-b border-surface-container-high">
        <span className="font-label-caps uppercase text-secondary font-bold text-xs">Financial Statements</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Earnings & Bank Transfers</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Current Escrow Balance</span>
          <div className="font-headline-xl text-3xl font-bold text-on-surface mt-1">$485.00</div>
          <p className="text-[11px] text-on-surface-variant mt-2">Will release upon tour completion</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Lifetime Disbursed</span>
          <div className="font-headline-xl text-3xl font-bold text-primary mt-1">$4,365.00</div>
          <p className="text-[11px] text-on-surface-variant mt-2">Transferred to Bank of Tokyo ****4821</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Host Platform Fee</span>
          <div className="font-headline-xl text-3xl font-bold text-secondary mt-1">0% (Promotional)</div>
          <p className="text-[11px] text-on-surface-variant mt-2">3 months remaining on zero-fee tier</p>
        </div>
      </div>
    </div>
  );
}
