'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPulsePosts, upvotePulsePost, PulsePost } from '@/services/api';

export default function LocalPulsePage() {
  const [selectedCity, setSelectedCity] = useState<string>('Tokyo, Japan');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const city = selectedCity.split(',')[0].trim();
    getPulsePosts(city, selectedVibe !== 'all' ? selectedVibe : undefined)
      .then((items) => {
        if (items && items.length > 0) {
          setPosts(
            items.map((p) => ({
              id: p.id,
              author: p.authorName,
              authorAvatar: p.authorAvatar,
              authorRole: p.authorRole,
              city: p.city,
              neighborhood: p.city,
              category: p.category,
              title: p.title,
              content: p.content,
              image: p.image || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
              timeAgo: p.timeAgo,
              likesCount: p.upvotesCount,
              commentsCount: p.commentsCount,
            })),
          );
        } else {
          setPosts([]);
        }
      })
      .catch((err) => {
        console.warn('Failed to load pulse posts:', err);
        setPosts([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedCity, selectedVibe]);

  const toggleLike = async (id: string) => {
    const isCurrentlyLiked = !!likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likesCount: p.likesCount + (isCurrentlyLiked ? -1 : 1) } : p,
      ),
    );
    try {
      await upvotePulsePost(id);
    } catch (err) {
      console.warn('Failed to register upvote on backend:', err);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-fixed mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-caps text-label-caps uppercase tracking-wider">Live Community Wire</span>
            </div>
            <h1 className="font-headline-xl text-4xl sm:text-5xl text-on-surface tracking-tight font-bold">Local Pulse</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Live recommendations, pop-up events, seasonal flavors, and neighborhood whispers shared directly by residents this week.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-5 py-3 rounded-full bg-surface-container-lowest shadow-sm border border-surface-container-high text-on-surface font-headline-sm text-base focus:outline-none cursor-pointer"
              >
                <option value="Tokyo, Japan">Tokyo, Japan</option>
                <option value="Florence, Italy">Florence, Italy</option>
                <option value="Mexico City, Mexico">Mexico City, Mexico</option>
                <option value="Lisbon, Portugal">Lisbon, Portugal</option>
                <option value="Paris, France">Paris, France</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center p-1 bg-surface-container rounded-full">
              <button className="px-4 py-2 rounded-full font-label-md text-xs bg-surface-container-lowest text-on-surface shadow-xs font-semibold">
                Happening This Week
              </button>
            </div>
          </div>
        </div>

        {/* Vibe Filter Pills */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedVibe('all')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md transition-all ${
              selectedVibe === 'all'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setSelectedVibe('food')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md transition-all ${
              selectedVibe === 'food'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'
            }`}
          >
            Food & Drink Whispers
          </button>
          <button
            onClick={() => setSelectedVibe('markets')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md transition-all ${
              selectedVibe === 'markets'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'
            }`}
          >
            Pop-up Markets
          </button>
          <button
            onClick={() => setSelectedVibe('music')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md transition-all ${
              selectedVibe === 'music'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'
            }`}
          >
            Underground Music & Art
          </button>
          <button
            onClick={() => setSelectedVibe('seasonal')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md transition-all ${
              selectedVibe === 'seasonal'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high'
            }`}
          >
            Seasonal Spots
          </button>
        </div>
      </div>

      {/* Neighborhood Spotlight Banner */}
      <section className="w-full max-w-7xl mx-auto px-6 py-6">
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low shadow-sm border border-surface-container-high">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary font-label-caps text-label-caps uppercase font-bold">
                    Neighborhood Spotlight
                  </span>
                  <span className="text-on-surface-variant text-xs">Curated 2 days ago</span>
                </div>
                <h2 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">Yanaka, Tokyo</h2>
                <p className="font-headline-sm text-primary font-semibold mt-1">The Nostalgic Low-City Craft Quarter</p>
                <blockquote className="mt-6 p-4 rounded-xl bg-surface-container-lowest shadow-xs text-on-surface-variant font-body-md text-sm relative border border-surface-container-high">
                  <p className="italic">
                    "While Shibuya races toward the future, Yanaka pauses. Here, iron kettles hiss softly behind sliding cedar doors, cats sunbathe on stone steps, and every artisan has an hour to share a warm cup of sencha."
                  </p>
                  <footer className="mt-3 flex items-center gap-3">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      alt="Kenji Tanaka"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdEDqEnENZAo4pE6aA_DwF0YLyNV5UMbJCOGDigbOEtDl5427MxzCYLaBgwlUDGnUUFxYbP12igYOFCcUYMz8PdMiDhA-OeFCb899dj6lKDYN8BjVGTnbFkYrqy61b1b93QvoJ346QBCNpli_xq2cTqQ7hDfFZsmAYJtAXpxP0y2pbmbZoOOsInAt7h5gRRvv1oYDXmb9r6DxAklr_psCUVTa3LBPxwUbqfoGbEhjOzG0SxYFZwKgMGg"
                    />
                    <div>
                      <span className="font-label-md text-xs text-on-surface font-semibold block">Kenji Tanaka</span>
                      <span className="text-[11px] text-on-surface-variant block">Wood artisan & Yanaka resident (19 yrs)</span>
                    </div>
                  </footer>
                </blockquote>
              </div>
              <div className="pt-6">
                <Link
                  href="/local-friends/local-kenji-tokyo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg hover:bg-primary-container shadow-sm transition-all"
                >
                  <span>Explore Yanaka with Kenji</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 p-6 lg:p-8 bg-surface-container">
              <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container-high">
                <div className="h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    alt="Kikumi Senbei"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEcXu2tHf9gkTFtZ2hY017lEoZfVGrv27i-kdWKj4XrE5Z_g5xkieWXbeNqN3ooy5cn_bP44a3ivTpbpGzcJsPfeTZU1MlQgZIDhVv3Y_4pNqFYWlS_AmdJx8OhrMkubbn2T4pjcgcPWGY93iy5hIK0Qr0c_KTKZbxrnQe3uiugFS3F4Nj3-nlP2yswitPgl5YIiYEEDwimmo0Cv4Va442ORor5P7EHwyULCh9FNlUov7AO0ej__iRqw"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] uppercase text-tertiary font-bold">Spot 01 · 70-Yr Senbei Stand</span>
                    <h3 className="font-label-lg font-bold text-on-surface mt-1">Kikumi Senbei</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1.5">Square soy sauce crackers hand-flipped over binchotan coals since 1940.</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Yanaka Ginza Alley</span>
                    <span className="material-symbols-outlined text-primary text-sm">pin_drop</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container-high">
                <div className="h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    alt="Kayaba Coffee"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgJE9hFGEabWspiwtF-nji3EB387chwmsJWxAjIamULduKAYp09ucdt9tPFWcTHkuYvcRtyjaeihLrJxAWj181oUpvJTwv3cwuAaDXZ3l3alvS2nDb9_JbAAQVW2SYPsuVw7NcW5N6UL64g1bR8owSQgr2_yMRj8IwAOrvk_JdPy6FAzqI493Mq2ZfWmPxEcZB9S5VpuKMRdIWGq4NNj-5pFKorCHC1OzcDHUrXrCXwBsYCKB1o-lw9w"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] uppercase text-tertiary font-bold">Spot 02 · Hidden Kissaten</span>
                    <h3 className="font-label-lg font-bold text-on-surface mt-1">Kayaba Coffee Corner</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1.5">Built in 1916. Sip matcha seated on tatami straw mats beneath raw timber joists.</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Near Nezu Shrine</span>
                    <span className="material-symbols-outlined text-primary text-sm">pin_drop</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-surface-container-high">
                <div className="h-44 overflow-hidden">
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    alt="Toubou Touka"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC2-at8rqVgxinFHqDCO1cw7Nydz1Rul1BhekOcPF7j70WcaMkSWUx3g79Iaz2nbqnbmSJROp00Xulm8cOLU0hXYwrh3b2BP0SifGqdl9fGpzw5CUliOitjlaMgxeUoqPB0pkwStAbhA3prjePNECAjnQQgqgWJ-ubr5tZf9zXb79GgGxuv2po_2m-63GBRRrlh9Yue2L7pBg58-OvcPhhFGI_I0D0W-BQ9-3T8BFZQe5r0kDVdh0lsg"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] uppercase text-tertiary font-bold">Spot 03 · Ceramic Studio</span>
                    <h3 className="font-label-lg font-bold text-on-surface mt-1">Toubou Touka</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1.5">Earthenware teacups and antique celadon sake decanters from Bizen kilns.</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Hebi-michi Curve</span>
                    <span className="material-symbols-outlined text-primary text-sm">pin_drop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Feed */}
      <section className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">Live Neighborhood Pulse</h2>
            <p className="font-body-md text-on-surface-variant text-sm">Real-time alerts, seasonal updates, and gatherings curated by verified locals.</p>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
            <span>Auto-refreshed 8m ago</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-surface-container animate-pulse" />
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-surface-container-low rounded-2xl p-8 border border-surface-container-high">
              <span className="material-symbols-outlined text-5xl text-outline mb-2">rss_feed</span>
              <h3 className="font-headline-sm text-lg font-semibold text-on-surface">No local pulse posts found</h3>
              <p className="font-body-md text-on-surface-variant mt-1">Select another destination or category to view real-time whispers from locals.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container-high hover:shadow-md transition-shadow">
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-caps text-label-caps uppercase font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                      <div>
                        <h4 className="font-label-md text-sm font-bold text-on-surface">{post.author}</h4>
                        <span className="text-[11px] text-on-surface-variant">{post.authorRole} · {post.timeAgo}</span>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2 leading-snug">{post.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{post.content}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          likedPosts[post.id] ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: likedPosts[post.id] ? "'FILL' 1" : "'FILL' 0" }}>
                          favorite
                        </span>
                        <span>{post.likesCount + (likedPosts[post.id] ? 1 : 0)}</span>
                      </button>
                      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-base">chat_bubble</span>
                        <span>{post.commentsCount}</span>
                      </span>
                    </div>

                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                      {post.neighborhood}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
