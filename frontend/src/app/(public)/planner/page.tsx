'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { generateItinerary } from '@/services/api';

const SAMPLE_DAYS = [
  {
    dayNumber: 1,
    title: 'Arashiyama & Zen Bamboo Forests',
    subtitle: 'Quiet temple courtyards and private riverside tea houses.',
    activities: [
      {
        time: '08:30 AM',
        title: 'Morning Silence Walk in Sagano Bamboo Grove',
        desc: 'Before crowds arrive. Guided meditation by the bamboo rustle.',
        location: 'Arashiyama',
        type: 'Free Exploration',
      },
      {
        time: '11:00 AM',
        title: 'Historic Tenryu-ji Zen Garden & Shojin Ryori Lunch',
        desc: 'Taste refined vegetarian monastic cuisine with temple views.',
        location: 'Tenryu-ji',
        type: 'Cultural Dining',
      },
      {
        time: '02:30 PM',
        title: 'Riverside Wooden Skiff Row on the Oi River',
        desc: 'Traditional boatman drifting beneath autumn foliage.',
        location: 'Togetsukyo Bridge',
        type: 'Scenic Activity',
      },
    ],
  },
  {
    dayNumber: 2,
    title: 'Kiyomizu Ceramic Workshops & Artisan Alleyways',
    subtitle: 'Hands-on clay pottery wheel with 5th-gen master Satoshi Mori.',
    matchedHost: {
      id: 'local-satoshi-kyoto',
      name: 'Satoshi Mori',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFMerRDbJLDV-wwGfj9QOAY0wKJmAzIgFWn46UioYG5vmkw_KWEE9Yhv8aSO4kTFfbb67kq4xZemlwCshbhLNaFxXYlNSNgXnwTm8TtPnffaAse2tYjPrvmX-T1rz5ZHzw4QLReZ2M-YIGjbYnWUd4yxpTRz-Oquh1aZMTk9yVWlcki2J6TZawP_LJ7HaxubsVVi8zi1iiLE6KRHMiJYZYdBt3JeuD8_br0vvujeqiLe1umKGs58GceQ',
      role: '5th Generation Kiyomizu Potter',
      badgeLevel: 'SUPERHOST' as const,
    },
    activities: [
      {
        time: '09:30 AM',
        title: 'Private Studio Visit & Waterwheel Clay Prep',
        desc: 'Touch raw local clays used exclusively in historic tea bowls.',
        location: 'Higashiyama Atelier',
        type: 'Host Experience',
        hostJoined: true,
      },
      {
        time: '01:30 PM',
        title: 'Hands-on Chawan Throwing & Glazing',
        desc: 'Create your bespoke tea ceremony bowl guided by master Satoshi.',
        location: 'Kiyomizu Kiln',
        type: 'Host Experience',
        hostJoined: true,
      },
      {
        time: '05:00 PM',
        title: 'Hidden Obanzai Dinner & Rare Kyoto Microbrew Tasting',
        desc: 'Seasonal heirloom vegetables and small-batch sake in Gion alley.',
        location: 'Gion Backstreet',
        type: 'Culinary Night',
      },
    ],
  },
  {
    dayNumber: 3,
    title: 'Historic Gion & Natural Fermentations',
    subtitle: 'Secret temple gates and private sake warehouse tastings.',
    matchedHost: {
      id: 'local-kenji-tokyo',
      name: 'Kenji Tanaka',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqfU5FIabnja1SwcN3cXbWR69mESaI9Zgpe-PrdyVDRQhyTvlR0JMuxEHnU34s-537bZnr1RV-YqqlMqgLIPWYt_vrF6IlDuMP3pmCaLIoPp-iICBrXe4A9fB_DCO0U8fuuc8MW9xPLkOmoJICvUFSOMbtEfrAUS5qwHzCNPTzvs8_RakwWALP2D51pBEItW6QHo2rSiIsr4yGvYQdJDpm0ub-kZUQCh-ccn6_LBzvlWwLKBqOVkOxCw',
      role: 'Master Brewer & Culinary Historian',
      badgeLevel: 'SUPERHOST' as const,
    },
    activities: [
      {
        time: '10:00 AM',
        title: 'Kennin-ji Zen Stone Garden Contemplation',
        desc: 'Twin Dragon ceiling scrolls and peaceful courtyard tea.',
        location: 'Gion',
        type: 'Heritage Visit',
      },
      {
        time: '02:30 PM',
        title: '300-Year-Old Sake Warehouse Tour & Namazake Tasting',
        desc: 'Unfiltered wild-fermented sakes not sold in retail shops.',
        location: 'Fushimi District',
        type: 'Host Experience',
        hostJoined: true,
      },
      {
        time: '07:00 PM',
        title: 'Evening Jazz Kissa & Vinyl Sessions',
        desc: 'Analog tube amp listening at a 1950s Kyoto jazz landmark.',
        location: 'Kawaramachi',
        type: 'Nightlife',
      },
    ],
  },
];

function AIPlannerContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams?.get('prompt') || 'Planning a 5-day autumn trip to Kyoto & Osaka focusing on ceramic studios, tranquil Zen gardens, natural wine, and authentic neighborhood dining with local artists.';

  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [travelStyle, setTravelStyle] = useState('Slow Cultural');
  const [pace, setPace] = useState('2-3 spots / day');
  const [budget, setBudget] = useState('$150 - $250/d');

  const [days, setDays] = useState<any[]>(SAMPLE_DAYS);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res: any = await generateItinerary({
        destination,
        prompt,
        travelStyle,
        pace,
        budgetRange: budget,
        durationDays: 3,
      });
      if (res && res.itinerary && Array.isArray(res.itinerary.days) && res.itinerary.days.length > 0) {
        setDays(
          res.itinerary.days.map((d: any, idx: number) => ({
            dayNumber: d.dayNumber || idx + 1,
            title: d.title || `Day ${idx + 1}`,
            subtitle: d.summary || '',
            matchedHost: d.matchedHost || SAMPLE_DAYS[idx % SAMPLE_DAYS.length]?.matchedHost,
            activities: d.activities || SAMPLE_DAYS[idx % SAMPLE_DAYS.length]?.activities,
          })),
        );
      }
    } catch (err) {
      console.warn('Backend AI Concierge fallback:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDay = days[selectedDayIndex] || days[0] || SAMPLE_DAYS[0];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Editorial Masthead Section */}
      <section className="relative w-full px-6 pt-10 pb-12 overflow-hidden bg-gradient-to-b from-surface-container-low/60 via-background to-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Overline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-caps uppercase tracking-wider mb-4 shadow-sm">
            <span className="material-symbols-outlined text-sm text-secondary">auto_awesome</span>
            <span>MebingLocal Intelligent Concierge</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-on-surface max-w-4xl tracking-tight mb-4 font-bold leading-tight">
            Your Trip, Planned Around You. <span className="text-primary">Co-created with Real Locals.</span>
          </h1>
          <p className="font-body-xl text-lg sm:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8">
            Describe your dream journey in plain words. Our travel intelligence pairs deep destination knowledge with verified resident hosts to weave a seamless, authentic itinerary.
          </p>

          {/* Planner Console Box */}
          <div className="w-full max-w-4xl bg-surface-container-lowest rounded-3xl shadow-xl p-6 md:p-8 text-left border border-surface-container-high">
            {/* Input Textarea Area */}
            <div className="relative bg-surface-container-low rounded-2xl p-5 transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md border border-surface-container-high">
              <div className="flex items-start gap-3 mb-2">
                <span className="material-symbols-outlined text-primary mt-1 text-2xl">psychology_alt</span>
                <div className="flex-1">
                  <label className="block font-label-caps uppercase text-on-surface-variant tracking-wider text-xs mb-1 font-semibold">
                    Conversational Journey Vision
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none resize-none leading-relaxed"
                    placeholder="Tell us what you love: food, pottery, morning silence, jazz kissa, craft distillers..."
                  />
                </div>
              </div>

              {/* Live Sample Chips */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-surface-container-high">
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-[10px] mr-1">
                  Inspirations:
                </span>
                <button
                  type="button"
                  onClick={() => setPrompt('3 days in Florence hunting hidden terracotta workshops, natural Chianti basements, and riverside fresco painting.')}
                  className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface text-xs transition-colors"
                >
                  Florence Artisans
                </button>
                <button
                  type="button"
                  onClick={() => setPrompt('7 days slow trail around Mexico City culinary markets, quiet brutalist courtyards, and Mezcal master distilleries with bilingual chef hosts.')}
                  className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface text-xs transition-colors"
                >
                  Oaxaca & CDMX Flavors
                </button>
                <button
                  type="button"
                  onClick={() => setPrompt('4 tranquil days in Kyoto Arashiyama tea forests, morning Zen meditation, and private lacquerware studio sessions.')}
                  className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface text-xs transition-colors"
                >
                  Kyoto Zen & Teahouses
                </button>
              </div>
            </div>

            {/* Dynamic Parameter Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 my-5">
              <div className="bg-surface-container p-3 rounded-xl flex flex-col justify-center">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider text-[10px]">
                  Destination
                </span>
                <div className="flex items-center gap-1 mt-0.5 font-label-md text-sm text-on-surface font-semibold truncate">
                  <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                  {destination}
                </div>
              </div>
              <div className="bg-surface-container p-3 rounded-xl flex flex-col justify-center">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider text-[10px]">
                  Travel Style
                </span>
                <div className="flex items-center gap-1 mt-0.5 font-label-md text-sm text-on-surface font-semibold truncate">
                  <span className="material-symbols-outlined text-sm text-secondary">spa</span>
                  {travelStyle}
                </div>
              </div>
              <div className="bg-surface-container p-3 rounded-xl flex flex-col justify-center">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider text-[10px]">
                  Pace
                </span>
                <div className="flex items-center gap-1 mt-0.5 font-label-md text-sm text-on-surface font-semibold truncate">
                  <span className="material-symbols-outlined text-sm text-tertiary">timer</span>
                  {pace}
                </div>
              </div>
              <div className="bg-surface-container p-3 rounded-xl flex flex-col justify-center">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider text-[10px]">
                  Target Budget
                </span>
                <div className="flex items-center gap-1 mt-0.5 font-label-md text-sm text-on-surface font-semibold truncate">
                  <span className="material-symbols-outlined text-sm text-primary">payments</span>
                  {budget}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-surface-container-low">
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-xs">
                <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
                <span>AI model cross-checks 1,420+ vetted Kyoto neighborhood hosts</span>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span className={`material-symbols-outlined text-lg ${isGenerating ? 'animate-spin' : ''}`}>
                  {isGenerating ? 'autorenew' : 'auto_awesome'}
                </span>
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Bespoke Itinerary'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Synthesized Itinerary Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Itinerary Status & Match Header */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-md p-6 md:p-8 mb-8 border border-surface-container-high">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wide">
                  Synthesized in 1.4s
                </span>
                <span className="text-outline">·</span>
                <span className="font-label-md text-xs text-on-surface-variant">Host Concierge Sync Active</span>
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                Kyoto Autumn Cultural Journey
              </h2>
              <p className="font-body-md text-on-surface-variant mt-1 text-sm">
                5 Days • Solo Immersive Pace • 3 Verified Resident Artisans Joined
              </p>
            </div>

            {/* Metrics & Match Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-secondary-container/40 px-5 py-2.5 rounded-2xl">
                <div className="relative w-10 h-10 flex items-center justify-center font-bold text-on-secondary-container text-sm">
                  98%
                </div>
                <div>
                  <div className="font-label-md text-xs font-bold text-on-secondary-container">Deep Profile Match</div>
                  <div className="font-body-sm text-[11px] text-secondary">Zero generic tourist stops</div>
                </div>
              </div>
            </div>
          </div>

          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pt-6 pb-2 scrollbar-none border-t border-surface-container-high mt-6">
            {SAMPLE_DAYS.map((d, idx) => (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`shrink-0 px-5 py-2.5 rounded-xl font-label-md text-xs font-bold transition-all ${
                  selectedDayIndex === idx
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Day {d.dayNumber}: {d.title}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Timeline of Activities */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-label-caps uppercase text-primary text-xs font-bold">
                    Day {currentDay.dayNumber} Schedule
                  </span>
                  <h3 className="font-headline-md text-xl font-bold text-on-surface mt-0.5">{currentDay.title}</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">{currentDay.subtitle}</p>
                </div>
              </div>

              {/* Matched Host Banner */}
              {currentDay.matchedHost && (
                <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary-container flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentDay.matchedHost.avatar}
                      alt={currentDay.matchedHost.name}
                      className="w-12 h-12 rounded-full object-cover shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-label-lg font-bold text-on-surface text-sm">{currentDay.matchedHost.name}</h4>
                        <VerifiedBadge level={currentDay.matchedHost.badgeLevel} />
                      </div>
                      <p className="text-xs text-on-surface-variant">{currentDay.matchedHost.role}</p>
                    </div>
                  </div>
                  <Link
                    href={`/local-friends/${currentDay.matchedHost.id}`}
                    className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm shrink-0"
                  >
                    Host Details
                  </Link>
                </div>
              )}

              {/* Activities list */}
              <div className="space-y-6">
                {(currentDay.activities || []).map((act: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-surface-container-low border border-surface-container-high">
                    <div className="px-3 py-1.5 rounded-xl bg-surface-container font-label-md text-primary font-bold text-xs shrink-0">
                      {act.time}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-label-lg font-bold text-on-surface text-sm">{act.title}</h4>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                          {act.type}
                        </span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1">{act.desc}</p>
                      <div className="flex items-center gap-1 text-[11px] text-primary mt-2">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span>{act.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high shadow-md flex flex-col gap-4">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">Book Complete Journey</h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Reserve all matched local guides and private studio slots in one unified checkout protected with milestone escrow.
              </p>

              <div className="p-4 rounded-2xl bg-surface-container-low space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>3 Verified Local Guide Bookings</span>
                  <span className="font-semibold text-on-surface">$240</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Private Studio & Clay Materials</span>
                  <span className="font-semibold text-on-surface">$85</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Escrow & 24/7 Global Concierge</span>
                  <span className="font-semibold text-on-surface">$32</span>
                </div>
                <div className="pt-2 border-t border-surface-container-high flex justify-between font-bold text-sm text-on-surface">
                  <span>Total Estimated</span>
                  <span className="text-primary font-bold text-base">$357</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('Itinerary saved to your traveler dashboard!')}
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg font-bold shadow-md transition-all active:scale-98"
              >
                Save & Lock Itinerary
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AIPlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-body-md text-on-surface-variant">Loading AI Travel Concierge...</div>}>
      <AIPlannerContent />
    </Suspense>
  );
}
