'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import RatingStars from '@/components/common/RatingStars';
import ExperienceCard from '@/components/common/ExperienceCard';

import { getLocalById, LocalFriend } from '@/services/api';

export default function LocalFriendDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [local, setLocal] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedHours, setSelectedHours] = useState<number>(3);
  const [selectedDate, setSelectedDate] = useState<string>('2025-10-15');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getLocalById(id)
      .then((res) => {
        setLocal(res);
      })
      .catch((err) => {
        console.warn(`Failed to fetch local friend ${id}:`, err);
        setLocal(null);
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
              <div className="h-48 rounded-3xl bg-surface-container animate-pulse" />
              <div className="h-64 rounded-3xl bg-surface-container animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 rounded-3xl bg-surface-container animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!local) {
    return (
      <div className="w-full bg-background min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">person_off</span>
        <h1 className="font-headline-xl text-3xl font-bold text-on-surface mb-2">Local Guide Not Found</h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mb-6">
          The local friend profile you are looking for might have been updated or does not exist.
        </p>
        <Link
          href="/local-friends"
          className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow-md hover:bg-primary-container transition-all"
        >
          Explore All Local Friends
        </Link>
      </div>
    );
  }

  const hourlyRate = local.hourlyRate || 35;
  const totalCost = selectedHours * hourlyRate;
  const platformFee = Math.round(totalCost * 0.1);
  const finalTotal = totalCost + platformFee;

  const handleBookNow = () => {
    router.push(`/checkout?hostId=${local.id}&date=${selectedDate}&hours=${selectedHours}&time=${selectedTime}&total=${finalTotal}`);
  };

  const languages = Array.isArray(local.languages)
    ? local.languages.map((l: any) => (typeof l === 'string' ? { name: l, level: 'Fluent' } : l))
    : [{ name: 'English', level: 'Fluent' }];

  const passions = Array.isArray(local.passions) ? local.passions : [];

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/local-friends" className="hover:text-primary transition-colors">Local Friends</Link>
          <span>/</span>
          <span className="text-on-surface font-semibold">{local.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Host Header Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-surface-container-high flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 shadow-md">
              <img src={local.avatar} alt={local.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="font-headline-xl text-3xl font-bold text-on-surface">{local.name}</h1>
                <VerifiedBadge level={local.badgeLevel} />
              </div>

              <div className="flex items-center gap-2 text-on-surface-variant font-body-md mb-3">
                <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                <span>{local.city}, {local.country} {local.neighborhood ? `(${local.neighborhood})` : ''}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-body-sm">
                <RatingStars rating={local.rating || 5.0} reviewCount={local.reviewCount || 0} />
                <span className="text-outline">·</span>
                <span className="flex items-center gap-1 text-secondary font-medium">
                  <span className="material-symbols-outlined text-xs">bolt</span>
                  Responds {local.responseTime || '< 15 mins'}
                </span>
                <span className="text-outline">·</span>
                <span className="text-on-surface-variant font-medium">
                  {local.completedTours || 0} Guided Experiences
                </span>
              </div>
            </div>
          </div>

          {/* About Host Section */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-surface-container-high">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-4">About {local.name}</h2>
            <div className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">
              {local.bio || `${local.name} is a verified local host in ${local.city}, ${local.country}.`}
            </div>

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-surface-container-low">
                <h3 className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold mb-3">
                  Spoken Languages
                </h3>
                <div className="flex flex-wrap gap-3">
                  {languages.map((lang: any) => (
                    <div key={lang.name} className="px-4 py-2 rounded-xl bg-surface-container-low flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-secondary">translate</span>
                      <span className="font-label-md text-on-surface font-semibold">{lang.name}</span>
                      <span className="text-xs text-on-surface-variant">({lang.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passions & Special Haunts */}
            {passions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-surface-container-low">
                <h3 className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold mb-3">
                  Specialties & Passions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {passions.map((p: string) => (
                    <span key={p} className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hosted Experiences */}
          {local.experiences && local.experiences.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-surface-container-high">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-6">
                Curated Experiences with {local.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {local.experiences.map((exp: any) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </div>
          )}

          {/* Traveler Reviews */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-surface-container-high">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface">Traveler Reviews</h2>
              <RatingStars rating={local.rating || 5.0} reviewCount={local.reviewCount || 0} />
            </div>

            <div className="space-y-6">
              {local.reviews && local.reviews.length > 0 ? (
                local.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-label-lg font-bold text-on-surface">{rev.author}</h4>
                        <p className="text-xs text-on-surface-variant">{rev.authorCity} · {rev.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="font-body-md text-on-surface leading-relaxed">{rev.content}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-on-surface-variant font-body-md">
                  No traveler reviews yet. Be the first to experience a journey with {local.name}!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-surface-container-high flex flex-col gap-6">
            <div className="flex items-baseline justify-between pb-4 border-b border-surface-container-high">
              <div>
                <span className="text-xs text-on-surface-variant">Rate per hour</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-xl text-3xl font-bold text-primary">${local.hourlyRate}</span>
                  <span className="text-body-sm text-on-surface-variant">/ hour</span>
                </div>
              </div>
              <RatingStars rating={local.rating} reviewCount={local.reviewCount} />
            </div>

            {/* Date & Time Pickers */}
            <div className="space-y-4">
              <div>
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1.5 block">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1.5 block">
                  Start Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="09:00">09:00 AM (Morning)</option>
                  <option value="11:30">11:30 AM (Lunch & Alleyways)</option>
                  <option value="14:00">02:00 PM (Afternoon)</option>
                  <option value="17:30">05:30 PM (Golden Hour / Aperitivo)</option>
                  <option value="20:00">08:00 PM (Nightlife & Cantinas)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                    Duration
                  </label>
                  <span className="font-label-md text-primary font-bold">{selectedHours} Hours</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={selectedHours}
                  onChange={(e) => setSelectedHours(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-surface-container-high rounded cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
                  <span>2 hours (Quick Walk)</span>
                  <span>8 hours (Full Day)</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-surface-container-low space-y-2 text-body-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>${local.hourlyRate} × {selectedHours} hours</span>
                <span>${totalCost}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>MebingLocal Escrow Protection & Support</span>
                <span>${platformFee}</span>
              </div>
              <div className="pt-2 border-t border-surface-container-high flex justify-between font-bold text-on-surface text-base">
                <span>Total Due</span>
                <span className="text-primary">${finalTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBookNow}
                className="w-full py-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-all transform active:scale-95 text-center"
              >
                Request Booking
              </button>
              <Link
                href={`/app/messages?hostId=${local.id}`}
                className="w-full py-3 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                <span>Message {local.name} First</span>
              </Link>
            </div>

            {/* Trust Assurance Badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary-container/30 text-xs text-on-secondary-container">
              <span className="material-symbols-outlined text-secondary text-xl">verified_user</span>
              <span>100% Escrow Protected: Funds held until experience completion.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
