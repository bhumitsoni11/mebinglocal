'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import RatingStars from '@/components/common/RatingStars';

import { getExperienceById, Experience } from '@/services/api';

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [exp, setExp] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('2025-10-18');
  const [guestsCount, setGuestsCount] = useState<number>(2);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getExperienceById(id)
      .then((item) => {
        if (!item) {
          setExp(null);
          return;
        }
        setExp({
          id: item.id,
          title: item.title,
          description: item.description,
          coverImage: item.heroImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
          location: `${item.city || 'Tokyo'} · ${item.country || 'Japan'}`,
          city: item.city,
          category: item.category || 'Food & Natural Wine',
          durationHours: item.durationHours || 3,
          maxGuests: item.maxGroupSize || 6,
          languages: item.languages || ['English'],
          price: item.pricePerPerson || 50,
          rating: item.rating || 5.0,
          reviewCount: item.reviewCount || 0,
          host: item.host || {
            id: 'guide',
            name: 'Local Host',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            isVerified: true,
            badgeLevel: 'SUPERHOST',
            bio: 'Verified resident guide.',
          },
          inclusions: item.inclusions && item.inclusions.length > 0 ? item.inclusions : [
            'Personal guide and neighborhood insider story sharing',
            'All primary tastings and materials included',
            'Curated local recommendations list',
          ],
          timeline: item.itinerarySteps && item.itinerarySteps.length > 0
            ? item.itinerarySteps.map((s: any, idx: number) => ({
                time: s.time || `Step ${idx + 1}`,
                title: s.title || `Highlight ${idx + 1}`,
                desc: s.description || '',
              }))
            : [
                { time: 'Start', title: 'Meetup & Context Intro', desc: 'Meet your guide and discover neighborhood background.' },
                { time: 'Middle', title: 'Curated Artisan / Tasting Experience', desc: 'Step inside private workshops and sample authentic regional goods.' },
                { time: 'Wrap-up', title: 'Reflections & Insider Tips', desc: 'Conclude with local refreshments and secret spot suggestions.' },
              ],
        });
      })
      .catch((err) => {
        console.warn(`Failed to fetch experience ${id}:`, err);
        setExp(null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full bg-background min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="h-8 w-48 bg-surface-container rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-80 rounded-3xl bg-surface-container animate-pulse" />
              <div className="h-40 rounded-3xl bg-surface-container animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 rounded-3xl bg-surface-container animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="w-full bg-background min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">explore_off</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mb-2">Experience Not Found</h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mb-6">
          The curated experience you are looking for might have been updated or does not exist.
        </p>
        <Link
          href="/experiences"
          className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow-md hover:bg-primary-container transition-all"
        >
          Explore All Experiences
        </Link>
      </div>
    );
  }

  const subtotal = exp.price * guestsCount;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handleBook = () => {
    router.push(`/checkout?experienceId=${exp.id}&date=${selectedDate}&guests=${guestsCount}&total=${total}`);
  };

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* Top Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/experiences" className="hover:text-primary transition-colors">Experiences</Link>
          <span>/</span>
          <span className="text-on-surface font-semibold truncate">{exp.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase">
                {exp.category}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {exp.location}
              </span>
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl font-bold text-on-surface mb-3 tracking-tight">
              {exp.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-body-sm">
              <RatingStars rating={exp.rating} reviewCount={exp.reviewCount} />
              <span className="text-outline">·</span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {exp.durationHours} Hours
              </span>
              <span className="text-outline">·</span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">group</span>
                Max {exp.maxGuests} Guests
              </span>
              <span className="text-outline">·</span>
              <span className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">translate</span>
                {exp.languages.join(', ')}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video w-full bg-surface-container">
            <img src={exp.coverImage} alt={exp.title} className="w-full h-full object-cover" />
          </div>

          {/* Host Card */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <img src={exp.host.avatar} alt={exp.host.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-label-lg text-lg font-bold text-on-surface">{exp.host.name}</h3>
                  <VerifiedBadge level={exp.host.badgeLevel} />
                </div>
                <p className="text-xs text-on-surface-variant">{exp.host.bio}</p>
              </div>
            </div>
            <Link
              href={`/local-friends/${exp.host.id}`}
              className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors shrink-0"
            >
              View Profile
            </Link>
          </div>

          {/* Experience Narrative */}
          <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-4">The Experience</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
              {exp.description}
            </p>

            {/* Inclusions */}
            <div className="mt-8 pt-6 border-t border-surface-container-low">
              <h3 className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold mb-4">
                What’s Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exp.inclusions.map((inc: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-sm text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-body-md text-on-surface text-sm">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-step Timeline */}
            <div className="mt-8 pt-6 border-t border-surface-container-low">
              <h3 className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold mb-4">
                Experience Timeline
              </h3>
              <div className="space-y-4">
                {exp.timeline.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-md text-xs font-bold shrink-0">
                      {step.time}
                    </div>
                    <div>
                      <h4 className="font-label-md text-sm font-semibold text-on-surface">{step.title}</h4>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Checkout Widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-surface-container-high flex flex-col gap-6">
            <div className="flex items-baseline justify-between pb-4 border-b border-surface-container-high">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-xl text-3xl font-bold text-primary">${exp.price}</span>
                <span className="text-body-sm text-on-surface-variant">/ person</span>
              </div>
              <RatingStars rating={exp.rating} reviewCount={exp.reviewCount} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1.5 block">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none"
                />
              </div>

              <div>
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1.5 block">
                  Number of Explorers
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                  <span className="font-body-md text-on-surface">{guestsCount} Guest{guestsCount > 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuestsCount(Math.min(exp.maxGuests, guestsCount + 1))}
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="p-4 rounded-2xl bg-surface-container-low space-y-2 text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>${exp.price} × {guestsCount} guests</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Escrow Protection & 24/7 Support</span>
                <span>${serviceFee}</span>
              </div>
              <div className="pt-2 border-t border-surface-container-high flex justify-between font-bold text-on-surface text-base">
                <span>Total</span>
                <span className="text-primary">${total}</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="w-full py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-all active:scale-98"
            >
              Instant Reserve with Escrow
            </button>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary-container/30 text-xs text-on-secondary-container">
              <span className="material-symbols-outlined text-secondary text-xl">shield</span>
              <span>Free cancellation up to 48 hours before start time. 100% Escrow Protection.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
