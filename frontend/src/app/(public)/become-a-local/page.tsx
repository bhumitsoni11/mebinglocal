'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CITY_RATES: Record<string, number> = {
  tokyo: 55,
  florence: 60,
  mexico: 42,
  lisbon: 48,
  newyork: 75,
  kyoto: 58,
  paris: 65,
};

export default function BecomeALocalPage() {
  const [city, setCity] = useState('florence');
  const [formatMultiplier, setFormatMultiplier] = useState(1.0);
  const [hoursPerWeek, setHoursPerWeek] = useState(6);

  const baseRate = CITY_RATES[city] || 50;
  const effectiveHourly = Math.round(baseRate * formatMultiplier);
  const monthlyEarnings = effectiveHourly * hoursPerWeek * 4;

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Editorial Hero & Dynamic Calculator Section */}
      <section className="relative w-full overflow-hidden px-6 lg:px-12 py-16 lg:py-24">
        {/* Ambient organic light glow */}
        <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-secondary-container/30 text-secondary font-label-caps text-label-caps uppercase tracking-wider font-bold">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Verified Community of Insiders
            </div>
            <h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight font-bold leading-tight">
              Turn your love for your city into <span className="text-primary">meaningful income</span> and human connection.
            </h1>
            <p className="font-body-xl text-lg sm:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              Welcome curious, respectful travelers into your world. Share unscripted neighborhood haunts, secret dining, artisanal craft, or your local creative scene entirely on your schedule.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high">
                <span className="material-symbols-outlined text-primary text-xl">percent</span>
                <span className="font-label-md text-sm text-on-surface font-semibold">Zero platform fees for first 3 months</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high">
                <span className="material-symbols-outlined text-secondary text-xl">security</span>
                <span className="font-label-md text-sm text-on-surface font-semibold">$1,000,000 Host Protection included</span>
              </div>
            </div>

            {/* Micro Hosts Testimonial Avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <img
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-surface shadow-sm"
                  alt="Elena Rossi"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC01zPXzIKGzm7sn1XNsHYDkjcrHeiVpfUxzqP1t2LXby_oTTPaTYekLjOi0Ojqd-jIA6C530l_wi73snHfrA39XYourpLv_XJRBfSsjTkSw6sfxybFf2_w38498jBl6Tp0Dpy23aemyAQv6g-tQ0JeCDFLZAvaRhDz90rNFfO8_dchE3JPvJQ0iT6rWQqQGRkww0ePLFNXIzpPOjxHIrUcNFKCNB0d6uE7nQEugjV76TRqoQfmZ2qG5Q"
                />
                <img
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-surface shadow-sm"
                  alt="Kenji Tanaka"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqfU5FIabnja1SwcN3cXbWR69mESaI9Zgpe-PrdyVDRQhyTvlR0JMuxEHnU34s-537bZnr1RV-YqqlMqgLIPWYt_vrF6IlDuMP3pmCaLIoPp-iICBrXe4A9fB_DCO0U8fuuc8MW9xPLkOmoJICvUFSOMbtEfrAUS5qwHzCNPTzvs8_RakwWALP2D51pBEItW6QHo2rSiIsr4yGvYQdJDpm0ub-kZUQCh-ccn6_LBzvlWwLKBqOVkOxCw"
                />
                <img
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-surface shadow-sm"
                  alt="Camila Morales"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABhSmY-Q8fI-jv7P4Dpk390MsFHFMBDGbXNqiARlGOuX8-XSXEyt_F3cC9qMOWr2WfCQTwfvR02hvZEn7jUeYDLKqK3jMapjuKerRHVFEZHtRYm0y3M1omKRVrUFYKRSXbL5pUe3Tuikmg26Jfq_UAWe-gdbbqTsRSdhnYwWLwdPqGxArF6eexHi0_scipFqJHf3qK9dEX2NxJc2r61zwDWl5JahXVec4r75KGUBpeiaxfyMQQSseBBw"
                />
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Joined by <strong className="text-on-surface font-semibold">2,480+ local friends & makers</strong> across 42 heritage cities.
              </p>
            </div>
          </div>

          {/* Right Interactive Calculator Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col space-y-6 border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider font-bold">
                    Host Earnings Estimator
                  </span>
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface mt-0.5">Calculate your potential</h2>
                </div>
                <span className="p-2 rounded-full bg-surface-container-low text-primary">
                  <span className="material-symbols-outlined text-2xl">calculate</span>
                </span>
              </div>

              {/* Selector Group */}
              <div className="space-y-4">
                {/* City Selection */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-xs text-on-surface-variant flex items-center gap-1.5 font-semibold">
                    <span className="material-symbols-outlined text-sm text-primary">pin_drop</span> City / Region
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-body-md rounded-xl px-4 py-3 border border-surface-container-high focus:outline-none cursor-pointer"
                  >
                    <option value="tokyo">Tokyo, Japan (Avg $55/h)</option>
                    <option value="florence">Florence, Italy (Avg $60/h)</option>
                    <option value="mexico">Mexico City, Mexico (Avg $42/h)</option>
                    <option value="lisbon">Lisbon, Portugal (Avg $48/h)</option>
                    <option value="paris">Paris, France (Avg $65/h)</option>
                    <option value="kyoto">Kyoto, Japan (Avg $58/h)</option>
                    <option value="newyork">New York City, USA (Avg $75/h)</option>
                  </select>
                </div>

                {/* Hosting Format Tabs */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-xs text-on-surface-variant font-semibold">Hosting Format</label>
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-xl border border-surface-container-high">
                    <button
                      type="button"
                      onClick={() => setFormatMultiplier(1.0)}
                      className={`py-2 px-3 rounded-lg font-label-md text-xs text-center transition-all ${
                        formatMultiplier === 1.0
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Local Friend Walk
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormatMultiplier(1.35)}
                      className={`py-2 px-3 rounded-lg font-label-md text-xs text-center transition-all ${
                        formatMultiplier === 1.35
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Craft / Food Masterclass
                    </button>
                  </div>
                </div>

                {/* Hours Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-xs text-on-surface-variant font-semibold">
                      Hours committed per week
                    </label>
                    <span className="font-headline-sm text-lg text-primary font-bold">
                      {hoursPerWeek} hrs / wk
                    </span>
                  </div>
                  <input
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    max={24}
                    min={2}
                    step={2}
                    type="range"
                    className="w-full h-2 bg-surface-container rounded-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between font-body-sm text-[11px] text-on-surface-variant">
                    <span>Casual (2h)</span>
                    <span>Weekend (8h)</span>
                    <span>Enthusiast (24h)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Output Box */}
              <div className="bg-surface-container-low rounded-2xl p-5 flex items-center justify-between border border-surface-container-high">
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px]">
                    Estimated Monthly Payout
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-headline-xl text-3xl text-on-surface font-bold tracking-tight">
                      ${monthlyEarnings.toLocaleString()}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">/ month</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-caps text-label-caps text-[10px] font-bold">
                    Direct Escrow Payout
                  </span>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">Paid directly after each experience</p>
                </div>
              </div>

              {/* Application CTA */}
              <div className="flex flex-col space-y-2.5">
                <Link
                  href="/become-a-local/application"
                  className="w-full text-center py-4 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Start Your Host Application</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <div className="flex items-center justify-center gap-2 font-body-sm text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                  <span>Takes ~10 minutes to submit · 100% Free background check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="w-full bg-surface-container-low px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-bold">
                Built For Genuine People
              </span>
              <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface mt-2 font-bold tracking-tight">
                Human hospitality, not commercial tour mills.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-3">
                Legacy booking directories treat locals as gig labor and tourists as barcodes. MebingLocal is designed for creative residents who want meaningful cultural exchanges and fair economic agency.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">tune</span>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Autonomy</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1 mb-2">You Set Rules & Pace</h3>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  No mandatory quotas or rigid itineraries. Accept only guests who share your passions, define your blackout dates, and host intimate groups of 1 to 4 travelers max.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center gap-1.5 text-on-surface font-label-md text-xs font-semibold">
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                100% calendar flexibility
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Fair Economics</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1 mb-2">Direct Milestone Escrow</h3>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  Earn $35 to $90+ per hour depending on your craft and locale. Instant escrow release disburses funds directly to your preferred bank within 24 hours.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center gap-1.5 text-on-surface font-label-md text-xs font-semibold">
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                Direct bank payouts
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">diversity_1</span>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Soul & Context</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1 mb-2">Community, Not Commodity</h3>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  Skip megaphone bus tours and pre-scripted speeches. You are an insider friend, cultural custodian, artisan, or wine collector sharing what genuinely moves you.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center gap-1.5 text-on-surface font-label-md text-xs font-semibold">
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                Meaningful human bonds
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Protection</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1 mb-2">Comprehensive Insurance</h3>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  Every booking is automatically protected with $1M USD host liability insurance, 24/7 incident helpline, and strict traveler identity verification before arrival.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center gap-1.5 text-on-surface font-label-md text-xs font-semibold">
                <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                Total peace of mind
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Vetting Process */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest font-bold">
            The Pathway to Becoming a Local Friend
          </span>
          <h2 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">
            Simple, rigorous 4-step onboarding
          </h2>
          <p className="font-body-lg text-sm text-on-surface-variant mt-2">
            We maintain high trust standards so you can host with pride and safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h4 className="font-label-lg text-base font-bold text-on-surface mb-1">Digital Application</h4>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Tell us about your background, spoken languages, and neighborhood secrets. Upload official photo ID.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h4 className="font-label-lg text-base font-bold text-on-surface mb-1">15-Min Video Chat</h4>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              A quick informal chat with our host community lead to align on hospitality values and safety norms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high">
            <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h4 className="font-label-lg text-base font-bold text-on-surface mb-1">Craft Your Profile</h4>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Co-create your profile, define your hourly rate, set your availability calendar, and publish your first experience.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mb-4">
              4
            </div>
            <h4 className="font-label-lg text-base font-bold text-on-surface mb-1">Welcome Travelers</h4>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Receive your Emerald Verified badge and start connecting with curious travelers from around the world.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/become-a-local/application"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-lg transition-all transform active:scale-95"
          >
            <span>Start Your Application Now</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
