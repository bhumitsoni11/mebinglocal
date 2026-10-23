'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getExperiences } from '@/services/api';
import { Experience } from '@/services/api/types';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'reviews'>('rating');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getExperiences()
      .then((res) => {
        if (isMounted) {
          setExperiences(res.items || []);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch experiences for admin:', err);
        if (isMounted) {
          setExperiences([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    experiences.forEach((exp) => {
      if (exp.category) set.add(exp.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [experiences]);

  const filteredExperiences = useMemo(() => {
    return experiences
      .filter((exp) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          exp.title?.toLowerCase().includes(query) ||
          exp.city?.toLowerCase().includes(query) ||
          exp.host?.name?.toLowerCase().includes(query) ||
          exp.category?.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === 'ALL' ||
          exp.category?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
        if (sortBy === 'price-asc') return (a.pricePerPerson || 0) - (b.pricePerPerson || 0);
        if (sortBy === 'price-desc') return (b.pricePerPerson || 0) - (a.pricePerPerson || 0);
        return 0;
      });
  }, [experiences, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-xs font-bold uppercase mb-2">
            <span className="material-symbols-outlined text-sm">local_activity</span>
            Catalog Moderation & Auditing
          </div>
          <h1 className="font-headline-xl text-3xl font-bold text-on-surface">Platform Experiences</h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Live unscripted local experiences, tastings, ateliers, and artisan workshops across global cities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Admin Console
          </Link>
          <Link
            href="/experiences"
            className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            Public Directory
          </Link>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, Sort */}
      <div className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences by title, city, host, or passion..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-xs placeholder:text-outline border border-transparent focus:border-primary/40 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-2xl bg-surface-container-low text-on-surface text-xs font-medium border border-surface-container-high focus:outline-none cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mr-1 whitespace-nowrap">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header / Counter */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="font-label-caps uppercase text-xs font-bold text-on-surface-variant">
          Live Experiences ({filteredExperiences.length} of {experiences.length})
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="text-xs font-bold text-primary hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-3xl bg-surface-container animate-pulse border border-surface-container-high"
            />
          ))
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl p-8 border border-surface-container-high">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">local_activity</span>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">No experiences found</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'ALL'
                ? `No experiences matched "${searchQuery || selectedCategory}". Try adjusting your filters.`
                : 'No published experiences currently available in the platform database.'}
            </p>
            {(searchQuery || selectedCategory !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high hover:border-primary/30 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                {/* Image Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-surface-container-high">
                  <Image
                    src={exp.heroImage || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400&auto=format&fit=crop&q=80'}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase">
                    {exp.city}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-caps font-bold text-[10px] tracking-wide">
                      PUBLISHED
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps font-semibold text-[10px]">
                      {exp.category || 'Culture & Food'}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                      ⭐ {exp.rating?.toFixed(1) || '5.0'}
                      <span className="text-on-surface-variant font-normal text-[10px]">
                        ({exp.reviewCount || 0})
                      </span>
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {exp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant mt-1.5">
                    {exp.host ? (
                      <Link
                        href={`/local-friends/${exp.host.id}`}
                        className="inline-flex items-center gap-1.5 text-on-surface hover:text-primary font-medium"
                      >
                        <span className="w-5 h-5 rounded-full overflow-hidden relative bg-surface-container shrink-0 inline-block align-middle">
                          <Image
                            src={exp.host.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={exp.host.name}
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </span>
                        <span>{exp.host.name}</span>
                      </Link>
                    ) : (
                      <span>Resident Host</span>
                    )}

                    <span>·</span>
                    <span>{exp.city}, {exp.country}</span>
                    <span>·</span>
                    <span className="font-bold text-primary">
                      ${exp.pricePerPerson} <span className="font-normal text-on-surface-variant text-[11px]">/ guest</span>
                    </span>
                    <span>·</span>
                    <span>⏱ {exp.durationHours || 3} hrs</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <Link
                  href={`/experiences/${exp.id}`}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Preview
                </Link>
                {exp.host && (
                  <Link
                    href={`/local-friends/${exp.host.id}`}
                    className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    Host
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
