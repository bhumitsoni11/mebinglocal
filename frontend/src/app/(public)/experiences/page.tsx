'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ExperienceCard from '@/components/common/ExperienceCard';
import RatingStars from '@/components/common/RatingStars';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { getExperiences, Experience } from '@/services/api';

const CATEGORIES = [
  'All Experiences',
  'Food & Natural Wine',
  'Hidden Architectural Walks',
  'Secret Speakeasies & Jazz',
  'Artisan Workshops',
  'Twilight Photography',
  'Mountain & Coastal Trails',
];

export default function ExperiencesPage() {
  const [selectedCat, setSelectedCat] = useState<string>('All Experiences');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [expList, setExpList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getExperiences({
      city: cityFilter !== 'all' ? cityFilter : undefined,
      category: selectedCat !== 'All Experiences' ? selectedCat : undefined,
      maxPrice,
    })
      .then((res) => {
        if (res?.items) {
          setExpList(
            res.items.map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description || '',
              coverImage: e.heroImage,
              location: `${e.city} · ${e.country}`,
              city: e.city,
              category: e.category,
              durationHours: e.durationHours,
              maxGroupSize: e.maxGroupSize || 4,
              price: e.pricePerPerson,
              rating: e.rating,
              reviewCount: e.reviewCount,
              host: e.host
                ? { name: e.host.name, avatar: e.host.avatar, isVerified: e.host.isVerified }
                : { name: 'Local Guide', avatar: '', isVerified: true },
            })),
          );
        } else {
          setExpList([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load experiences:', err);
        setExpList([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCat, cityFilter, maxPrice]);

  const filteredExps = useMemo(() => {
    return expList.filter((exp) => {
      if (selectedCat !== 'All Experiences' && exp.category !== selectedCat) return false;
      if (cityFilter !== 'all' && exp.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (exp.price > maxPrice) return false;
      return true;
    });
  }, [expList, selectedCat, cityFilter, maxPrice]);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Page Introduction */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-fixed-variant font-label-caps text-label-caps tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Direct Resident Curation
            </div>
            <h1 className="font-headline-xl text-4xl sm:text-5xl text-on-surface tracking-tight leading-tight font-bold mb-3">
              Unscripted Local Experiences
            </h1>
            <p className="font-body-xl text-lg sm:text-xl text-on-surface-variant max-w-xl">
              Handcrafted, intimate journeys led exclusively by passionate locals. No tour buses. No tourist traps.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant bg-surface-container px-4 py-2 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              100% Identity-Vetted Hosts
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant bg-surface-container px-4 py-2 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm text-secondary">groups</span>
              Max 4-6 Explorers
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-md p-4 md:p-6 mb-8 border border-surface-container-high">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 block text-[10px]">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md focus:outline-none"
              >
                <option value="all">All Global Cities</option>
                <option value="tokyo">Tokyo, Japan</option>
                <option value="kyoto">Kyoto, Japan</option>
                <option value="florence">Florence, Italy</option>
                <option value="mexico city">Mexico City, Mexico</option>
                <option value="paris">Paris, France</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px]">
                  Max Price / Person
                </label>
                <span className="font-label-md text-primary font-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={30}
                max={150}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-high rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-body-sm text-on-surface-variant">Showing {filteredExps.length} curated journeys</span>
            </div>

            <div className="flex justify-end">
              <Link
                href="/planner"
                className="px-5 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md flex items-center gap-2 shadow-sm hover:bg-secondary/90 transition-all"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Plan Custom Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Category Carousel Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-label-md transition-all ${
                selectedCat === cat
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Spotlight Hero Banner */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-inverse-surface text-inverse-on-surface shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-full overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Kyoto rooftop"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSq7I14m_xcIb6Ataa6mHYHhoaZqs4OEJMEqdDb0VrImiDMofvHucaR32ahusy1924L5b8hiCw8i6Cs14Gyburk60mx4bOEGL1riX-H9IzfUmm98pq5NXqVapvIElCCGtoRHDO0dH7Dn8ro563KfjLwK7XRv2_ahLkdD_HTntQZdV9Una-WsKHLyx6lfoC6xd48Vb0gKV2BMY9ilmPNu_bMAx2feAbwxvs9wazQ1ITijQpjkAAY007nw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-inverse-surface/30 to-inverse-surface" />
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1.5 shadow-md font-bold">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  Spotlight of the Week
                </span>
                <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                  Kyoto · Gion Secret Terrace
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Kenji Tanaka"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVWZ-4lCdmxp3-oolmjHJRfazgBoguG9EJ6zFkziGZVXQx_WnY8fOlzN1qwj1NhV9BN8ONRny792v9e_tNBWz6oXWygy8Kml4vVIS3XvhdbI7l7D0-vOw7NarGuxNZoiNqX7OFWRyUHPZTOt3nSItQt6OSK2cs0D7nbNlHNe_39j1HEjjmCBE4qM66B8rp7B2zGuH_qyfAbWMKmj8RUCM4z5cyQSNqDpSE0SKCp3L7DRD8p23ReFN9Rg"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-sm text-sm font-semibold text-inverse-on-surface">Kenji Tanaka</span>
                      <span className="material-symbols-outlined text-secondary-fixed text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                    <span className="text-xs text-inverse-on-surface/70">Master Brewer & Culinary Historian</span>
                  </div>
                </div>

                <h2 className="font-headline-xl text-2xl sm:text-3xl text-inverse-on-surface mb-3 tracking-tight font-bold">
                  Secret Rooftops & Natural Fermentations in Kyoto
                </h2>
                <p className="font-body-md text-inverse-on-surface/80 mb-6 leading-relaxed">
                  Step past closed temple gates at dusk to access a 300-year-old family warehouse and panoramic rooftop. Taste rare unpasteurized namazake and fermented seasonal pairings.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3 rounded-xl">
                    <span className="material-symbols-outlined text-primary-fixed block mb-1 text-lg">timelapse</span>
                    <span className="text-[10px] uppercase text-inverse-on-surface/70 block">Duration</span>
                    <span className="font-label-md text-inverse-on-surface font-semibold">3.5 Hours</span>
                  </div>
                  <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3 rounded-xl">
                    <span className="material-symbols-outlined text-secondary-fixed block mb-1 text-lg">diversity_3</span>
                    <span className="text-[10px] uppercase text-inverse-on-surface/70 block">Intimacy</span>
                    <span className="font-label-md text-inverse-on-surface font-semibold">Max 4 Guests</span>
                  </div>
                  <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-3 rounded-xl">
                    <span className="material-symbols-outlined text-tertiary-fixed block mb-1 text-lg">payments</span>
                    <span className="text-[10px] uppercase text-inverse-on-surface/70 block">Price</span>
                    <span className="font-label-md text-inverse-on-surface font-semibold">$85 / person</span>
                  </div>
                </div>
              </div>

              <Link
                href="/experiences/exp-kenji-tsukiji"
                className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-label-lg rounded-full text-center font-bold shadow-md transition-all active:scale-98"
              >
                Explore Spotlight Experience
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="w-full max-w-7xl mx-auto px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : filteredExps.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl p-8 border border-surface-container-high">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">explore_off</span>
            <h3 className="font-headline-sm text-lg font-semibold text-on-surface">No experiences found</h3>
            <p className="font-body-md text-on-surface-variant mt-1">Try selecting a different category or raising your maximum price filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredExps.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
