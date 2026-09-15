'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getExperiences, Experience } from '@/services/api';

export default function HostExperiencesManagerPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getExperiences()
      .then((res) => {
        if (res?.items && res.items.length > 0) {
          setExperiences(
            res.items.map((e) => ({
              id: e.id,
              title: e.title,
              price: e.pricePerPerson,
              duration: `${e.durationHours} Hours`,
              maxGuests: e.maxGroupSize,
              status: 'PUBLISHED',
              rating: e.rating,
              bookingsCount: e.reviewCount,
            })),
          );
        } else {
          setExperiences([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load host experiences:', err);
        setExperiences([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-container-high">
        <div>
          <span className="font-label-caps uppercase text-secondary font-bold text-xs">Host Offerings</span>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface mt-1">Curated Experiences Manager</h1>
        </div>
        <button
          onClick={() => alert('New experience creator modal!')}
          className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-all shadow-sm"
        >
          + Create New Experience
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8 border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-outline mb-2">palette</span>
          <h3 className="font-headline-sm text-lg font-bold text-on-surface">No curated experiences created yet</h3>
          <p className="font-body-md text-sm text-on-surface-variant mt-1 mb-6">
            Share your passion for hidden alleyways, pottery, food or wine with global travelers.
          </p>
          <button
            onClick={() => alert('New experience creator modal!')}
            className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-xs font-bold shadow-md hover:bg-primary-container transition-all"
          >
            Create Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {exp.status}
                  </span>
                  <span className="text-xs text-on-surface-variant">{exp.duration} · Max {exp.maxGuests} Guests</span>
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">{exp.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">
                  ${exp.price} / person · {exp.bookingsCount} completed bookings · ⭐ {exp.rating}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/experiences/${exp.id}`}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
                >
                  Preview Public Page
                </Link>
                <button
                  onClick={() => alert('Edit experience modal!')}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
