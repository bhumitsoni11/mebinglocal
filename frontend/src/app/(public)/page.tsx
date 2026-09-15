'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchCapsule from '@/components/common/SearchCapsule';
import LocalFriendCard from '@/components/common/LocalFriendCard';
import ExperienceCard from '@/components/common/ExperienceCard';
import { useSearchStore } from '@/store/searchStore';
import { getDestinations, getLocals, getExperiences, Destination, LocalFriend, Experience } from '@/services/api';

export default function HomePage() {
  const router = useRouter();
  const { setDestination, setCategory } = useSearchStore();
  const [samplePrompt, setSamplePrompt] = useState('Planning a 4-day trip to Kyoto focusing on pottery, quiet temples, and authentic tea houses with local creators.');
  const [featuredLocals, setFeaturedLocals] = useState<any[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<any[]>([]);
  const [curatedExperiences, setCuratedExperiences] = useState<any[]>([]);
  const [loadingLocals, setLoadingLocals] = useState(true);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);

  useEffect(() => {
    getLocals({ limit: 4 })
      .then((res) => {
        if (res?.items) {
          setFeaturedLocals(res.items);
        }
      })
      .catch((err) => console.warn('Failed to load locals:', err))
      .finally(() => setLoadingLocals(false));

    getDestinations(true)
      .then((dests) => {
        if (dests && dests.length > 0) {
          setTrendingDestinations(
            dests.map((d) => ({
              name: d.city,
              country: d.country,
              slug: d.slug,
              localCount: d.localCount || 10,
              image: d.heroImage,
              tag: d.weatherNote || 'Trending',
            })),
          );
        }
      })
      .catch((err) => console.warn('Failed to load destinations:', err))
      .finally(() => setLoadingDestinations(false));

    getExperiences({ limit: 3 })
      .then((res) => {
        if (res?.items) {
          setCuratedExperiences(
            res.items.map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description || '',
              coverImage: e.heroImage,
              location: `${e.city} · ${e.country}`,
              city: e.city,
              durationHours: e.durationHours,
              price: e.pricePerPerson,
              rating: e.rating,
              reviewCount: e.reviewCount,
              host: e.host
                ? { name: e.host.name, avatar: e.host.avatar, isVerified: e.host.isVerified }
                : { name: 'Local Guide', avatar: '', isVerified: true },
            })),
          );
        }
      })
      .catch((err) => console.warn('Failed to load experiences:', err))
      .finally(() => setLoadingExperiences(false));
  }, []);

  const handleChipClick = (cat: string) => {
    setCategory(cat);
    router.push(`/local-friends?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative w-full -mt-20 overflow-hidden">
        <div
          className="w-full min-h-[640px] lg:min-h-[740px] bg-cover bg-center flex flex-col justify-between pt-36 pb-20 px-6 lg:px-12 relative"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxAmTT3p956XF-6zjdCHMcYH6DnVtQIOvXl8AoZCAgWqTVRph6GRBFIZuMFQXNwCY4xkUhoFsuGCO76mDQ-6TKkQrUP9B4u1IsW9oXYZlZoMjCMgjpXSgL8L6UaRlHoTVCKCJ9dnjEj8E3jFGPDvRO9aqipUbNjkdEC0pR3jJ_xYtgGJ6oCo1hJDNpQxp6mADk7ZiQar0OTNbT_s6Bg_MFtRYWXh6Er5PAkuz0Xof1_WpFvVTZoLpvQA")`,
          }}
        >
          {/* Editorial Gradient Scrims */}
          <div className="absolute inset-0 bg-gradient-to-b from-on-surface/85 via-on-surface/55 to-background pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-on-surface/30 via-on-surface/60 to-on-surface/85 pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
            {/* Pre-header Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-semibold">
                Verified Human Connections in 48 Countries
              </span>
            </div>

            {/* Master Title */}
            <h1 className="font-display-hero text-4xl sm:text-5xl lg:text-6xl text-surface-bright tracking-tight max-w-4xl drop-shadow-sm mb-4 leading-tight">
              Meet the people who know the place.
            </h1>
            <p className="font-body-xl text-lg sm:text-xl text-surface-bright/95 max-w-2xl text-center mb-8 drop-shadow-sm font-normal">
              Connect with verified local friends around the world for authentic, unscripted travel experiences and personalized cultural journeys.
            </p>

            {/* Floating Multi-Segment Search Capsule */}
            <div className="w-full max-w-4xl">
              <SearchCapsule />
            </div>

            {/* Quick Discovery Category Chips */}
            <div className="mt-8 flex items-center justify-center flex-wrap gap-2 max-w-3xl">
              <span className="font-label-md text-label-md text-surface-bright font-medium px-2 py-1 drop-shadow-sm">
                Popular right now:
              </span>
              <button
                onClick={() => handleChipClick('Food & Wine')}
                className="bg-surface-container-lowest/90 hover:bg-surface-container text-on-surface font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-primary">restaurant</span> Food & Wine
              </button>
              <button
                onClick={() => handleChipClick('Hidden Gems')}
                className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-secondary">explore</span> Hidden Alleyways
              </button>
              <button
                onClick={() => handleChipClick('Photography')}
                className="bg-surface-container-lowest/90 hover:bg-surface-container text-on-surface font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-tertiary">photo_camera</span> Photography Walks
              </button>
              <button
                onClick={() => handleChipClick('Local Crafts')}
                className="bg-surface-container-lowest/90 hover:bg-surface-container text-on-surface font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-primary">palette</span> Local Crafts
              </button>
              <button
                onClick={() => handleChipClick('Secret Rooftops')}
                className="hidden sm:inline-flex bg-surface-container-lowest/90 hover:bg-surface-container text-on-surface font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-all items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-secondary">wine_bar</span> Secret Rooftops
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MEET LOCALS, NOT JUST LANDMARKS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-4 bg-primary rounded-full" />
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">
                Authentic Hosts
              </span>
            </div>
            <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
              Meet locals, not just landmarks
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1.5 max-w-2xl">
              Verified locals who open doors to authentic culture, untold stories, and secret spots.
            </p>
          </div>
          <Link
            href="/local-friends"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-lg text-label-lg group transition-colors shrink-0"
          >
            <span>View all 1,420+ Local Friends</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* 4 Local Friend Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingLocals ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-surface-container animate-pulse p-5 flex flex-col justify-end" />
            ))
          ) : featuredLocals.length > 0 ? (
            featuredLocals.map((local) => (
              <LocalFriendCard key={local.id} local={local} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-on-surface-variant font-body-md">
              No featured locals found.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: TRENDING DESTINATIONS */}
      <section className="w-full bg-surface-container-low py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider">
                Where Travelers Wander Next
              </span>
              <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface mt-1 font-bold tracking-tight">
                Trending Destinations
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Immerse yourself where vibrant local communities welcome you as an insider, not an onlooker.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingDestinations ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-surface-container animate-pulse" />
              ))
            ) : trendingDestinations.length > 0 ? (
              trendingDestinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/local-friends?destination=${encodeURIComponent(dest.name)}`}
                  className="relative rounded-2xl overflow-hidden shadow-md h-96 group cursor-pointer block"
                >
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${dest.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-caps text-label-caps uppercase px-3 py-1.5 rounded-full shadow-sm">
                      {dest.localCount || dest.hostsCount || 10}+ Local Friends
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                    <div className="flex items-center gap-1.5 font-label-sm text-xs text-primary-fixed mb-1">
                      <span className="material-symbols-outlined text-sm">wb_sunny</span>
                      <span>{dest.tag}</span>
                    </div>
                    <h3 className="font-headline-md text-2xl font-bold">{dest.name}</h3>
                    <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">{dest.country}</p>
                    <div className="mt-3 pt-2 border-t border-surface-container-lowest/20 flex items-center justify-between text-xs">
                      <span className="text-surface-bright font-label-md">Explore authentic hosts</span>
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-on-surface-variant font-body-md">
                No trending destinations yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: CURATED LOCAL EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-4 bg-tertiary rounded-full" />
              <span className="font-label-caps text-label-caps uppercase text-tertiary tracking-wider">
                Unscripted Journeys
              </span>
            </div>
            <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
              Experiences Made Personal
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1.5">
              Directly crafted and personally hosted by trusted neighborhood insiders.
            </p>
          </div>
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-lg text-label-lg group transition-colors shrink-0"
          >
            <span>Explore all curated experiences</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingExperiences ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-surface-container animate-pulse" />
            ))
          ) : curatedExperiences.length > 0 ? (
            curatedExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-on-surface-variant font-body-md">
              No curated experiences found.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: AI TRAVEL CONCIERGE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="bg-surface-container-lowest rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

          {/* Left Column: Story & Narrative */}
          <div className="lg:w-1/2 flex flex-col relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container w-fit mb-4">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span className="font-label-caps text-label-caps uppercase">MebingLocal AI Concierge</span>
            </div>
            <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface tracking-tight font-bold">
              Your trip, planned around you. Co-created with real locals.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-3 mb-6">
              Describe your dream trip in plain language. Our AI concierge combines deep real-time local knowledge with verified resident hosts to craft a seamless, bespoke itinerary.
            </p>

            {/* Prompt input card preview */}
            <div className="bg-surface-container-low rounded-2xl p-4 mb-6 border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Interactive Prompt</span>
                <span className="text-xs text-primary font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> Live Console
                </span>
              </div>
              <textarea
                value={samplePrompt}
                onChange={(e) => setSamplePrompt(e.target.value)}
                rows={2}
                className="w-full bg-transparent font-body-md text-body-md text-on-surface font-medium italic focus:outline-none resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/planner?prompt=${encodeURIComponent(samplePrompt)}`}
                className="bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-7 py-3.5 rounded-full shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                <span>Customize with AI</span>
              </Link>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Instant matches · Zero booking friction</span>
            </div>
          </div>

          {/* Right Column: Interactive Itinerary & Match Preview Card */}
          <div className="lg:w-1/2 w-full relative z-10">
            <div className="bg-surface rounded-2xl p-6 shadow-md border border-surface-container-high">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-xl">map</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Kyoto Creator Odyssey</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">4 Days · 3 Verified Local Guides</p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps uppercase bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-bold">
                  98% Match
                </span>
              </div>

              {/* Matched Local Host Snapshot */}
              <div className="mt-4 p-3 bg-surface-container-lowest rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt="Satoshi Mori"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFMerRDbJLDV-wwGfj9QOAY0wKJmAzIgFWn46UioYG5vmkw_KWEE9Yhv8aSO4kTFfbb67kq4xZemlwCshbhLNaFxXYlNSNgXnwTm8TtPnffaAse2tYjPrvmX-T1rz5ZHzw4QLReZ2M-YIGjbYnWUd4yxpTRz-Oquh1aZMTk9yVWlcki2J6TZawP_LJ7HaxubsVVi8zi1iiLE6KRHMiJYZYdBt3JeuD8_br0vvujeqiLe1umKGs58GceQ"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">Satoshi Mori</span>
                      <span className="material-symbols-outlined text-xs text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">5th Generation Kiyomizu Potter</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary">Matched for Day 2</span>
              </div>

              {/* Timeline Mockup */}
              <div className="mt-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary mt-1" />
                    <div className="w-0.5 h-10 bg-surface-container-highest" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">09:30 AM · Morning Tea Ceremony</span>
                      <span className="font-body-sm text-body-sm text-outline">Uji Suburb</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Private matcha session at a 180-year-old wooden teahouse off the tourist trail.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                    <div className="w-0.5 h-10 bg-surface-container-highest" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">02:00 PM · Hands-on Ceramic Wheel Session</span>
                      <span className="font-body-sm text-body-sm text-primary font-medium">With Host Satoshi</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Throwing local clay and glazing your own chawan bowl.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary mt-1" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">06:00 PM · Obanzai Dinner & Microbrew Tasting</span>
                      <span className="font-body-sm text-body-sm text-outline">Gion Alley</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Seasonal heirloom vegetables and rare Kyoto craft beers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-5 pt-3 border-t border-surface-container-highest flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">tune</span>
                  Adjust rhythm or budget anytime
                </span>
                <Link href="/planner" className="text-primary font-semibold hover:underline">
                  Launch interactive planner →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TRUST & SAFETY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider font-semibold">
            Uncompromising Standards
          </span>
          <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-surface mt-1 font-bold tracking-tight">
            Travel deeply, with absolute peace of mind
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
            Every local friend is vetted. Every transaction is protected. Every experience is guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-4">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">100% Identity Verified</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Government ID checks, resident proof, and personal video interviews before any host receives the Verified Local badge.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-secondary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span> 4-stage vetting process
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm mb-4">
                <span className="material-symbols-outlined text-2xl">lock</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">Milestone Escrow</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Funds remain securely held in escrow until your experience is completed and mutually confirmed. No upfront cash risks.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-secondary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span> Encrypted payments
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm mb-4">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">24/7 Global Concierge</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Round-the-clock multilingual assistance by phone, in-app messaging, or emergency ground support anywhere you travel.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-secondary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span> 3-minute response SLA
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between hover:bg-surface-container transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-4">
                <span className="material-symbols-outlined text-2xl">shield_with_heart</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">Traveler Guarantee</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                If your experience doesn’t match the host description, we provide an immediate full refund or rebook you with a top-rated guide.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-secondary font-medium">
              <span className="material-symbols-outlined text-sm">check_circle</span> Full happiness warranty
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: BECOME A LOCAL FRIEND BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-secondary text-on-secondary p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjrPYsShKlNQ_Z0uieAHAOU5FuqapyvX9Q4RZmx1hZgtX-uqPh2QbrjKK7X9mIwdKX9iuGa0-81qilhtnrwpsa4wzjXJ3EvIWvmNZ-DnPRf1mF7bzN0CqYDY86TP8QU2Se6ZQvaKecrCv7NKQEfbvpTsBj3L03iVzJ-7o4npkpuaMZzqwJMIYNHBQCkUGjbO6sFqhOu3LYcU_WbByXGPI3zaPPDyAF07QhGblVwCgwMnj1AX5INzBjcw")`,
            }}
          />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-sm">handshake</span>
              <span>Earn on Your Terms</span>
            </div>
            <h2 className="font-headline-xl text-3xl sm:text-4xl text-on-secondary tracking-tight font-bold">
              Turn your love for your city into meaningful connections and income.
            </h2>
            <p className="font-body-lg text-body-lg text-secondary-fixed mt-3">
              Join a global community of architects, historians, chefs, and artists who share their favorite neighborhood haunts with respectful, curious travelers.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-body-sm text-secondary-fixed">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary-fixed-dim">schedule</span>
                <span>Flexible schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary-fixed-dim">payments</span>
                <span>Set your own rates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary-fixed-dim">health_and_safety</span>
                <span>Comprehensive Host Protection</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <Link
              href="/become-a-local"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-full shadow-lg transition-all transform active:scale-95 text-center font-semibold"
            >
              Apply to Host
            </Link>
            <Link
              href="/become-a-local"
              className="w-full sm:w-auto px-6 py-4 bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 backdrop-blur-md text-on-secondary font-label-lg text-label-lg rounded-full transition-colors text-center"
            >
              How Hosting Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
