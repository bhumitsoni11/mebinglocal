import { useRouter } from 'next/navigation';

import { Search, Utensils, Map, Camera, ShoppingBag, Star, Sparkles, Heart, Users, ArrowRight, TrendingUp } from "lucide-react";
import { useLocalFriends } from "@/hooks/useLocalFriends";
import { useEvents } from "@/hooks/useEvents";

const CATEGORIES = [
  { icon: Utensils, label: "Food Tours", color: "#C96F52", bg: "#FCFAF53EE" },
  { icon: Map, label: "Cultural Walks", color: "#C96F52", bg: "#ECFDF5" },
  { icon: Sparkles, label: "Hidden Gems", color: "#C96F52", bg: "#F5F3FF" },
  { icon: Camera, label: "Photography", color: "#3B82F6", bg: "#EFF6FF" },
  { icon: ShoppingBag, label: "Shopping", color: "#C96F52", bg: "#FCFAF5BEB" },
  { icon: Heart, label: "Women-Only", color: "#EC4899", bg: "#FDF2F8" },
];

export function Home() {
  const router = useRouter();
  const { data: localFriends = [], isLoading: friendsLoading } = useLocalFriends({ limit: 3 });
  const { data: events = [], isLoading: eventsLoading } = useEvents({ limit: 3 });

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-10 py-5"
        style={{ borderBottom: "1px solid var(--border)", background: "#FCFAF5" }}
      >
        <div>
          <p style={{ fontSize: 13, color: "#8B9E94" }}>Good morning 👋</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1A3B2B", letterSpacing: "-0.02em" }}>
            Where would you like to explore?
          </h1>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3 cursor-pointer"
          style={{ background: "#F4E9D8", width: 340, border: "1.5px solid #8B9E94" }}
          onClick={() => router.push("/app/discover")}
        >
          <Search size={18} color="#8B9E94" />
          <span style={{ fontSize: 14, color: "#8B9E94" }}>Search city, companion, experience…</span>
        </div>
      </div>

      {/* Main grid: left content + right panel */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 340px", minHeight: "calc(100vh - 81px)" }}>

        {/* ── Left: main feed ── */}
        <div className="px-10 py-8" style={{ borderRight: "1px solid var(--border)" }}>

          {/* AI Banner */}
          <div
            className="rounded-3xl p-6 mb-8 flex items-center gap-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #C96F52 0%, #D97A5E 60%, #FFB347 100%)" }}
          >
            <div
              className="absolute right-0 top-0 rounded-full opacity-10"
              style={{ width: 300, height: 300, background: "#FCFAF5", transform: "translate(30%, -40%)" }}
            />
            <div
              className="rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ width: 56, height: 56, background: "rgba(255,255,255,0.2)" }}
            >
              <Sparkles size={26} color="#FCFAF5" />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                ✨ AI Pick for You
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#FCFAF5", marginTop: 4, letterSpacing: "-0.01em" }}>
                Street Food Tour · Mumbai
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                Based on your interests · from $12/hr · Responds in &lt;1 hr
              </div>
            </div>
            <button
              onClick={() => router.push("/app/profile/lf1")}
              className="flex items-center gap-2 rounded-2xl px-5 py-3 flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", color: "#FCFAF5", fontSize: 14, fontWeight: 700, border: "1px solid rgba(255,255,255,0.3)" }}
            >
              Meet Priya <ArrowRight size={16} />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A3B2B" }}>Explore by Category</h2>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => router.push("/app/discover")}
                  className="rounded-2xl p-4 flex flex-col items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: cat.bg, border: `1px solid ${cat.color}20` }}
                >
                  <div
                    className="rounded-xl flex items-center justify-center"
                    style={{ width: 48, height: 48, background: cat.color + "20" }}
                  >
                    <cat.icon size={22} color={cat.color} strokeWidth={1.8} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2C4F3E", textAlign: "center", lineHeight: 1.3 }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Top Companions grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A3B2B" }}>Top Companions</h2>
              <button
                onClick={() => router.push("/app/discover")}
                className="flex items-center gap-1"
                style={{ fontSize: 13, fontWeight: 600, color: "#C96F52" }}
              >
                See all <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {friendsLoading ? <p>Loading...</p> : localFriends.slice(0, 3).map((lf) => (
                <button
                  key={lf.id}
                  onClick={() => router.push(`/app/profile/${lf.id}`)}
                  className="rounded-3xl overflow-hidden text-left w-full transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: "#FCFAF5", border: "1px solid #F4E9D8" }}
                >
                  <div className="relative">
                    <img src={lf.coverPhoto} alt={lf.city} className="w-full object-cover" style={{ height: 140 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                    {lf.womenOnly && (
                      <span className="absolute top-3 right-3 rounded-full px-2 py-1" style={{ fontSize: 10, fontWeight: 700, background: "#C96F52", color: "#FCFAF5" }}>
                        Women-Only
                      </span>
                    )}
                    <img
                      src={lf.avatar}
                      alt={lf.name}
                      className="absolute rounded-2xl object-cover"
                      style={{ width: 44, height: 44, bottom: -16, left: 16, border: "3px solid #FCFAF5" }}
                    />
                  </div>
                  <div className="px-4 pt-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3B2B" }}>{lf.name}</div>
                        <div style={{ fontSize: 12, color: "#8B9E94" }}>📍 {lf.city}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#1A3B2B" }}>${lf.hourlyRate}<span style={{ fontSize: 11, fontWeight: 400, color: "#8B9E94" }}>/hr</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} color="#C96F52" fill="#C96F52" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#2C4F3E" }}>{lf.rating}</span>
                      <span style={{ fontSize: 12, color: "#8B9E94" }}>({lf.reviewCount})</span>
                      {lf.verified && (
                        <span className="ml-auto rounded-full px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, background: "#ECFDF5", color: "#059669" }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {lf.interests.slice(0, 2).map((i) => (
                        <span key={i} className="rounded-full px-2.5 py-1" style={{ fontSize: 11, background: "#F4E9D8", color: "#2C4F3E" }}>
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="px-6 py-8 flex flex-col gap-6" style={{ background: "#F4E9D8" }}>

          {/* Women-only banner */}
          <div className="rounded-3xl overflow-hidden relative" style={{ height: 160 }}>
            <img
              src="https://images.unsplash.com/photo-1762331653506-ce47db22df53?w=400&h=320&fit=crop&auto=format"
              alt="Women travelers"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-5"
              style={{ background: "linear-gradient(to top, rgba(139,92,246,0.9) 0%, rgba(139,92,246,0.3) 100%)" }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>For Women Travelers</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FCFAF5" }}>Women-Only Companions</div>
              <button
                onClick={() => router.push("/app/discover")}
                className="mt-2 rounded-xl px-3 py-1.5 self-start"
                style={{ background: "#FCFAF5", color: "#C96F52", fontSize: 12, fontWeight: 700 }}
              >
                Explore <Users size={12} className="inline ml-1" />
              </button>
            </div>
          </div>

          {/* Upcoming events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B" }}>Upcoming Events</h3>
              <button onClick={() => router.push("/app/events")} style={{ fontSize: 12, fontWeight: 600, color: "#C96F52" }}>
                See all
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {eventsLoading ? <p>Loading...</p> : events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="flex gap-3 rounded-2xl p-3" style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}>
                  <img src={ev.image} alt={ev.title} className="rounded-xl object-cover flex-shrink-0" style={{ width: 52, height: 52 }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A3B2B", lineHeight: 1.3 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: "#8B9E94", marginTop: 2 }}>📅 {ev.date}</div>
                    <div style={{ fontSize: 11, color: "#8B9E94" }}>📍 {ev.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl p-4" style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} color="#C96F52" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A3B2B" }}>Platform Stats</span>
            </div>
            {[
              { label: "Active Companions", value: "50,000+", color: "#C96F52" },
              { label: "Cities covered", value: "150+", color: "#C96F52" },
              { label: "Happy travelers", value: "200,000+", color: "#C96F52" },
              { label: "Avg. rating", value: "4.95 ★", color: "#C96F52" },
            ].map((s) => (
              <div key={s.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid #F4E9D8" }}>
                <span style={{ fontSize: 12, color: "#8B9E94" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
