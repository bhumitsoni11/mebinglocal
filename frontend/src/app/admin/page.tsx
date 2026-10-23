'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminDashboard, getVerificationApplications, getExperiences, getLocals } from '@/services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalGMV: 142800,
    localsCount: 5,
    experiencesCount: 6,
    pendingVerifications: 0,
    activeBookings: 18,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      getAdminDashboard(),
      getVerificationApplications('SUBMITTED'),
      getExperiences(),
      getLocals(),
    ]).then(([dashResult, verifResult, expResult, localsResult]) => {
      if (!isMounted) return;

      let localsCount = 5;
      let experiencesCount = 6;
      let pendingVerifications = 0;
      let totalGMV = 142800;

      if (dashResult.status === 'fulfilled' && dashResult.value?.metrics) {
        const m = dashResult.value.metrics;
        if (m.totalLocals) localsCount = m.totalLocals;
        if (m.pendingVerifications !== undefined) pendingVerifications = m.pendingVerifications;
        if (m.totalRevenue) totalGMV = m.totalRevenue;
      }

      if (verifResult.status === 'fulfilled' && Array.isArray(verifResult.value)) {
        pendingVerifications = verifResult.value.filter((v: any) => v.status === 'SUBMITTED' || v.status === 'PENDING').length;
      }

      if (expResult.status === 'fulfilled' && expResult.value?.items) {
        experiencesCount = expResult.value.items.length;
      }

      if (localsResult.status === 'fulfilled' && localsResult.value?.items && localsResult.value.items.length > 0) {
        localsCount = localsResult.value.items.length;
      }

      setStats({
        totalGMV,
        localsCount,
        experiencesCount,
        pendingVerifications,
        activeBookings: 18,
      });
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-xs font-bold uppercase mb-2">
            <span className="material-symbols-outlined text-sm">shield_person</span>
            Platform Administration
          </div>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface">MebingLocal Admin Console</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/verifications"
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">how_to_reg</span>
            Review Applications ({stats.pendingVerifications} Pending)
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Total Platform GMV</span>
          <div className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
            ${stats.totalGMV.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-2">+$18,400 this month</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Verified Local Hosts</span>
          <div className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
            {stats.localsCount} Hosts
          </div>
          <p className="text-[11px] text-secondary font-bold mt-2">Active in Tokyo, Kyoto, Florence, CDMX, Paris</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Published Experiences</span>
          <div className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
            {stats.experiencesCount} Curated
          </div>
          <p className="text-[11px] text-primary font-bold mt-2">100% Unscripted & Verified</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
          <span className="font-label-caps uppercase text-on-surface-variant text-[10px] font-bold">Escrow In-Transit</span>
          <div className="font-headline-xl text-3xl font-bold text-tertiary mt-1">$38,240</div>
          <p className="text-[11px] text-on-surface-variant mt-2">{stats.activeBookings} Protected active bookings</p>
        </div>
      </div>

      {/* Admin Quick Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/verifications"
          className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex flex-col justify-between group"
        >
          <div>
            <span className="material-symbols-outlined text-3xl text-primary mb-3">how_to_reg</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Host Verification Workspace
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Review government ID documents, video interview logs, and grant Verified Emerald Badges.
            </p>
          </div>
          <span className="text-primary font-bold text-xs mt-4 flex items-center gap-1">
            Open Verification Queue ({stats.pendingVerifications}) →
          </span>
        </Link>

        <Link
          href="/admin/users"
          className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex flex-col justify-between group"
        >
          <div>
            <span className="material-symbols-outlined text-3xl text-secondary mb-3">manage_accounts</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              User & Host Directory
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Search, filter, update roles, manage bans, and inspect host ratings.
            </p>
          </div>
          <span className="text-primary font-bold text-xs mt-4 flex items-center gap-1">
            Browse Directory ({stats.localsCount} Hosts) →
          </span>
        </Link>

        <Link
          href="/admin/experiences"
          className="p-6 rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex flex-col justify-between group"
        >
          <div>
            <span className="material-symbols-outlined text-3xl text-tertiary mb-3">local_activity</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              Experience Moderation
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Approve new unscripted itinerary submissions, price adjustments, and review safety compliance.
            </p>
          </div>
          <span className="text-primary font-bold text-xs mt-4 flex items-center gap-1">
            Moderate Experiences ({stats.experiencesCount} Active) →
          </span>
        </Link>
      </div>
    </div>
  );
}
