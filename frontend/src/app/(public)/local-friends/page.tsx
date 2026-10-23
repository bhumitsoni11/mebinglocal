'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import LocalFriendCard from '@/components/common/LocalFriendCard';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import RatingStars from '@/components/common/RatingStars';
import { useSearchStore } from '@/store/searchStore';
import { getLocals, LocalFriend } from '@/services/api';

function LocalFriendsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialDestination = searchParams.get('destination') || '';

  const [searchQuery, setSearchQuery] = useState(initialDestination);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxRate, setMaxRate] = useState<number>(100);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'reviews'>('rating');
  const [filterMode, setFilterMode] = useState<'all' | 'top_rated' | 'fast' | 'superhosts'>('all');
  const [showMap, setShowMap] = useState<boolean>(false);
  const [localsList, setLocalsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state if search params change
  useEffect(() => {
    if (initialDestination) setSearchQuery(initialDestination);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialDestination, initialCategory]);

  useEffect(() => {
    setIsLoading(true);
    getLocals({
      search: searchQuery || undefined,
      interest: selectedCategory || undefined,
      maxRate: maxRate < 150 ? maxRate : undefined,
      verifiedOnly,
    })
      .then((res) => {
        if (res?.items) {
          setLocalsList(res.items);
        } else {
          setLocalsList([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load locals:', err);
        setLocalsList([]);
      })
      .finally(() => setIsLoading(false));
  }, [searchQuery, selectedCategory, maxRate, verifiedOnly]);

  const filteredLocals = useMemo(() => {
    const list = localsList.filter((local) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = (local.name || '').toLowerCase().includes(q);
        const matchCity = (local.city || '').toLowerCase().includes(q);
        const matchCountry = (local.country || '').toLowerCase().includes(q);
        const matchTag = (local.tagline || '').toLowerCase().includes(q);
        const matchBio = (local.bio || '').toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchCountry && !matchTag && !matchBio) return false;
      }

      if (selectedCategory) {
        const cat = selectedCategory.toLowerCase();
        const matchPassion = (local.passions || []).some((p: string) => p.toLowerCase().includes(cat));
        const matchTag = (local.tagline || '').toLowerCase().includes(cat);
        const matchBio = (local.bio || '').toLowerCase().includes(cat);
        if (!matchPassion && !matchTag && !matchBio) return false;
      }

      if (local.hourlyRate > maxRate) return false;
      if (verifiedOnly && !local.isVerified) return false;

      if (selectedLanguage !== 'all') {
        const langMatch = (local.languages || []).some((l: string) => l.toLowerCase().includes(selectedLanguage.toLowerCase()));
        if (!langMatch) return false;
      }

      if (filterMode === 'top_rated' && local.rating < 4.98) return false;
      if (filterMode === 'superhosts' && !local.isSuperhost && local.badgeLevel !== 'SUPERHOST') return false;
      if (filterMode === 'fast' && (local.responseTimeMin || 10) > 10) return false;

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_asc') return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      if (sortBy === 'price_desc') return (b.hourlyRate || 0) - (a.hourlyRate || 0);
      if (sortBy === 'reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0;
    });
  }, [localsList, searchQuery, selectedCategory, maxRate, verifiedOnly, selectedLanguage, filterMode, sortBy]);

  const PASSION_CHIPS = [
    { label: 'Food & Culinary', icon: 'restaurant' },
    { label: 'Architecture', icon: 'account_balance' },
    { label: 'Photography', icon: 'photo_camera' },
    { label: 'Wine & Cantinas', icon: 'wine_bar' },
    { label: 'Local Crafts', icon: 'palette' },
    { label: 'Live Jazz', icon: 'music_note' },
  ];

  const CITIES_RADAR = [
    { name: 'Tokyo', country: 'Japan', count: 1, flag: '🗾' },
    { name: 'Kyoto', country: 'Japan', count: 1, flag: '⛩️' },
    { name: 'Florence', country: 'Italy', count: 1, flag: '🍷' },
    { name: 'Mexico City', country: 'Mexico', count: 1, flag: '🌮' },
    { name: 'Paris', country: 'France', count: 1, flag: '🥐' },
  ];

  const spotlightLocals = filteredLocals.length > 0 ? filteredLocals.slice(0, 3) : localsList.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* Top Editorial Header & Discovery Intro */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-container-high">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-caps text-label-caps uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>1,420+ Certified Resident Hosts Worldwide</span>
            </div>
            <h1 className="font-display-hero text-4xl sm:text-5xl text-on-surface tracking-tight font-bold mb-3 leading-tight">
              Meet Local Friends Around the World
            </h1>
            <p className="font-body-xl text-lg sm:text-xl text-on-surface-variant leading-relaxed">
              Connect with verified architects, chefs, vinyl collectors, and neighborhood storytellers ready to share their city unscripted.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowMap(!showMap)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shadow-sm font-label-lg text-label-lg ${
                showMap
                  ? 'bg-secondary text-on-secondary ring-2 ring-secondary/30'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg text-primary">map</span>
              <span>{showMap ? 'Hide Radar Map' : 'Open Split Map'}</span>
            </button>
            <Link
              href={`/planner?destination=${encodeURIComponent(searchQuery || 'Kyoto, Japan')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary hover:bg-secondary/90 transition-all shadow-sm font-label-lg text-label-lg"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>AI Match</span>
            </Link>
          </div>
        </div>

        {/* Elevated Floating Multi-Segment Filter Capsule */}
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-md p-4 mt-6 border border-surface-container-high">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* City / Name Search */}
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <div className="flex flex-col w-full min-w-0">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant/80 text-[10px]">
                  Destination or Host
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-on-surface-variant/60 w-full truncate"
                  placeholder="e.g. Kyoto, Camille, Florence, Tokyo..."
                  type="text"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Availability Window */}
            <div className="md:col-span-2 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
              <div className="flex flex-col min-w-0 w-full">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant/80 text-[10px]">
                  Availability
                </span>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="bg-transparent text-on-surface font-body-md text-body-md focus:outline-none cursor-pointer"
                >
                  <option value="all">Any Dates</option>
                  <option value="weekend">This Weekend</option>
                  <option value="next7">Next 7 Days</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Primary Language */}
            <div className="md:col-span-2 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">translate</span>
              <div className="flex flex-col min-w-0 w-full">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant/80 text-[10px]">
                  Language
                </span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-on-surface font-body-md text-body-md focus:outline-none cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  <option value="english">English</option>
                  <option value="japanese">Japanese</option>
                  <option value="italian">Italian</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="portuguese">Portuguese</option>
                </select>
              </div>
            </div>

            {/* Hourly Budget Slider */}
            <div className="md:col-span-2 px-4 py-2.5 rounded-xl bg-surface-container-low">
              <div className="flex items-center justify-between font-label-caps text-label-caps uppercase text-on-surface-variant/80 mb-1 text-[10px]">
                <span>Hourly Rate</span>
                <span className="font-label-md text-label-md text-primary font-bold">Up to ${maxRate}/h</span>
              </div>
              <input
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-surface-container-high rounded cursor-pointer"
                max={150}
                min={20}
                step={5}
                type="range"
              />
            </div>

            {/* Verified Toggle & Clear */}
            <div className="md:col-span-2 flex items-center justify-between gap-2 px-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="sr-only peer"
                  type="checkbox"
                />
                <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary relative" />
                <span className="font-label-md text-label-md text-on-surface font-medium">Verified</span>
              </label>

              {(searchQuery || selectedCategory || selectedLanguage !== 'all' || maxRate < 150) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedLanguage('all');
                    setSelectedAvailability('all');
                    setMaxRate(150);
                    setFilterMode('all');
                  }}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Quick Passion Filter Chips & Sort Selector */}
          <div className="pt-4 mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-surface-container-low">
            {/* Mode Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 ${
                  filterMode === 'all'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                All Locals
              </button>
              <button
                onClick={() => setFilterMode('top_rated')}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 ${
                  filterMode === 'top_rated'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Top Rated 5.0
              </button>
              <button
                onClick={() => setFilterMode('superhosts')}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 ${
                  filterMode === 'superhosts'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Superhosts
              </button>
              <button
                onClick={() => setFilterMode('fast')}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 ${
                  filterMode === 'fast'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Fast Response (&lt;10m)
              </button>
            </div>

            {/* Sort & Count */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-xl text-xs text-on-surface">
                <span className="text-on-surface-variant">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>{filteredLocals.length} verified guides</span>
              </div>
            </div>
          </div>

          {/* Passion Chips */}
          <div className="pt-3 mt-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-surface-container-low/60">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-[10px] shrink-0">
              Passions:
            </span>
            {PASSION_CHIPS.map((chip) => {
              const isActive = selectedCategory.toLowerCase() === chip.label.toLowerCase();
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setSelectedCategory(isActive ? '' : chip.label)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Global Resident Radar Map (Split Map) */}
      {showMap && (
        <section className="w-full max-w-7xl mx-auto px-6 mb-8 transition-all animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden bg-surface-container-lowest shadow-md border border-surface-container-high p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xl">radar</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">Interactive Global Resident Radar</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Click any city below to filter verified resident hosts in real-time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="px-4 py-1.5 rounded-full bg-surface-container text-on-surface font-label-md text-xs shadow-sm hover:bg-surface-container-high transition-colors"
                type="button"
              >
                Close Map View
              </button>
            </div>

            {/* City Radar Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
              {CITIES_RADAR.map((city) => {
                const isCityActive = searchQuery.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => setSearchQuery(isCityActive ? '' : city.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isCityActive
                        ? 'bg-secondary text-on-secondary border-secondary shadow-md scale-102'
                        : 'bg-surface-container-low border-surface-container hover:border-secondary/40 hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{city.flag}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCityActive ? 'bg-on-secondary/20 text-on-secondary' : 'bg-surface-container text-primary'
                      }`}>
                        Active
                      </span>
                    </div>
                    <span className="font-headline-sm text-sm font-bold truncate">{city.name}</span>
                    <span className={`text-[11px] ${isCityActive ? 'text-secondary-fixed' : 'text-on-surface-variant'}`}>
                      {city.country}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Local Spotlight Showcase */}
      <section className="w-full max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
              Editor’s Curated Spotlights
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-on-surface tracking-tight font-bold mt-0.5">
              Featured Local Friends This Month
            </h2>
          </div>
        </div>

        {/* 3 Editorial Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-surface-container animate-pulse" />
            ))
          ) : spotlightLocals.map((local) => (
            <div
              key={local.id}
              className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container-high"
            >
              <Link href={`/local-friends/${local.id}`} className="relative h-64 overflow-hidden block">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={local.name}
                  src={local.avatar}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
                  <span className="material-symbols-outlined text-xs text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span className="font-label-caps text-label-caps text-secondary uppercase">Verified Resident</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface font-label-caps text-label-caps">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Response &lt;10m • 100% Rate</span>
                </div>
              </Link>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                      <span>{local.city}, {local.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-bold">{(local.rating || 5).toFixed(2)}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">({local.reviewCount || 0})</span>
                    </div>
                  </div>

                  <Link href={`/local-friends/${local.id}`}>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1 group-hover:text-primary transition-colors">
                      {local.name}
                    </h3>
                  </Link>

                  {local.tagline && (
                    <div className="bg-surface-container-low rounded-xl p-3.5 my-3">
                      <p className="font-body-md text-body-md italic text-on-surface line-clamp-2">
                        “{local.tagline}”
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(local.passions || []).map((p: string) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedCategory(p)}
                        className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">From</span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold ml-1">${local.hourlyRate}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/hr</span>
                  </div>
                  <Link
                    href={`/local-friends/${local.id}`}
                    className="px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm transform active:scale-95"
                  >
                    Connect
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Filtered Local Friends Grid */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold">
            All Verified Guides ({filteredLocals.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : filteredLocals.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl p-8 border border-surface-container-high">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">person_search</span>
            <h3 className="font-headline-sm text-lg font-semibold text-on-surface">No local friends match your filters</h3>
            <p className="font-body-md text-on-surface-variant mt-1">Try resetting filters or expanding your budget range.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedLanguage('all');
                setMaxRate(150);
                setFilterMode('all');
              }}
              className="mt-4 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs shadow-sm hover:bg-primary-container transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLocals.map((local) => (
              <LocalFriendCard key={local.id} local={local} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function LocalFriendsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body-md text-on-surface-variant">Loading local friends...</div>}>
      <LocalFriendsContent />
    </Suspense>
  );
}
