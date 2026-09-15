'use client';

import React from 'react';
import Link from 'next/link';

export default function SafetyPage() {
  return (
    <div className="w-full bg-background pb-20">
      {/* Header */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-caps text-label-caps uppercase tracking-wider mb-4 font-bold">
            <span className="material-symbols-outlined text-sm">shield</span>
            MebingLocal Safety & Escrow Standard
          </div>
          <h1 className="font-headline-xl text-4xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight mb-4">
            Travel deeply, with absolute peace of mind.
          </h1>
          <p className="font-body-xl text-lg sm:text-xl text-on-surface-variant leading-relaxed">
            Every local friend is vetted. Every transaction is held in secure escrow. Every journey is backed by our 24/7 global concierge.
          </p>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-3">100% Identity Verification</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-4">
              Before receiving the Emerald Verified badge, all hosts undergo a 4-stage background check: government photo ID verification, proof of address, public record screening, and a 1-on-1 video interview with our community leads.
            </p>
            <ul className="space-y-2 text-sm text-on-surface font-medium">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Government Passport / National ID encryption
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Proof of local residence & neighborhood presence
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Personal interview & hospitality ethos check
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-3">Milestone Escrow Protection</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-4">
              Your money is never sent directly to hosts upfront. Instead, funds are securely held in encrypted escrow until after your experience concludes and you mutually confirm completion.
            </p>
            <ul className="space-y-2 text-sm text-on-surface font-medium">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Zero upfront cash risk for travelers
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Guaranteed automated payout for hosts upon completion
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Free cancellation up to 48 hours prior
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">support_agent</span>
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-3">24/7 Global Concierge</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-4">
              Whether you need translation assistance in a Kyoto alley, emergency itinerary re-routing in Florence, or urgent support anywhere on earth, our concierge is reachable instantly.
            </p>
            <ul className="space-y-2 text-sm text-on-surface font-medium">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Under 3-minute average response time
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Direct in-app emergency line & WhatsApp support
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Multilingual staff in 12 languages
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-3">Traveler Satisfaction Guarantee</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-4">
              If an experience does not match what the host described or if there is a cancellation, we provide an immediate 100% refund or rebook you with a top-rated host at no extra charge.
            </p>
            <ul className="space-y-2 text-sm text-on-surface font-medium">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                100% full money-back guarantee
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Priority same-day rebooking with Superhosts
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                Transparent review system with zero censored feedback
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/local-friends"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all"
          >
            <span>Explore Verified Local Friends</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
