import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


import { ArrowLeft, Star, Shield, Globe, Heart, ChevronLeft, ChevronRight, MessageCircle, MapPin, Clock } from "lucide-react";
import { useLocalFriend } from "@/hooks/useLocalFriends";
import { useReviews } from "@/hooks/useReviews";

const JUNE_DATES = [
  { day: 18, avail: true }, { day: 19, avail: false }, { day: 20, avail: true },
  { day: 21, avail: true }, { day: 22, avail: false }, { day: 23, avail: true },
  { day: 24, avail: true }, { day: 25, avail: false }, { day: 26, avail: true },
  { day: 27, avail: true }, { day: 28, avail: true }, { day: 29, avail: false },
  { day: 30, avail: true },
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Profile() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: lf, isLoading: lfLoading } = useLocalFriend(id as string);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(id as string);

  if (lfLoading) return <div className="p-10">Loading profile...</div>;
  if (!lf) return <div className="p-10">Profile not found</div>;

  return (
    <div className="flex h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Left: cover + info ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Cover */}
        <div className="relative">
          <img src={lf.coverPhoto} alt={lf.city} className="w-full object-cover" style={{ height: 280 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.6))" }} />

          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 rounded-full flex items-center justify-center gap-2 px-4 py-2"
            style={{ background: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, color: "#2C4F3E" }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button className="absolute top-6 right-6 rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: "rgba(255,255,255,0.9)" }}>
            <Heart size={18} color="#2C4F3E" />
          </button>

          {/* Profile card overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-0">
            <div
              className="rounded-t-3xl px-8 py-6 flex items-end gap-6"
              style={{ background: "#FCFAF5" }}
            >
              <div className="relative flex-shrink-0" style={{ marginTop: -48 }}>
                <img src={lf.avatar} alt={lf.name} className="rounded-3xl object-cover" style={{ width: 90, height: 90, border: "4px solid #FCFAF5" }} />
                {lf.verified && (
                  <div className="absolute rounded-full flex items-center justify-center" style={{ width: 26, height: 26, background: "#C96F52", bottom: -4, right: -4, border: "3px solid #FCFAF5" }}>
                    <Shield size={13} color="#FCFAF5" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A3B2B", letterSpacing: "-0.02em" }}>{lf.name}, {lf.age}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={14} color="#8B9E94" />
                      <span style={{ fontSize: 14, color: "#8B9E94" }}>{lf.city}, {lf.country}</span>
                      {lf.womenOnly && (
                        <span className="rounded-full px-3 py-1" style={{ fontSize: 11, fontWeight: 700, background: "#FDF2F8", color: "#EC4899" }}>
                          💜 Women-Only
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} color="#C96F52" fill="#C96F52" />
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#1A3B2B" }}>{lf.rating}</span>
                    <span style={{ fontSize: 14, color: "#8B9E94" }}>({lf.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 flex flex-col gap-6">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Tours Completed", value: lf.completedTours, icon: "🗺️" },
              { label: "Response Time", value: lf.responseTime, icon: "⚡" },
              { label: "Languages", value: lf.languages.length, icon: "🌐" },
              { label: "Member Since", value: "2023", icon: "📅" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: "#F8F9FE", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1A3B2B", marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#8B9E94", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* About */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1A3B2B", marginBottom: 10 }}>About {lf.name.split(" ")[0]}</h3>
            <p style={{ fontSize: 15, color: "#2C4F3E", lineHeight: 1.8 }}>{lf.bio}</p>
          </div>

          {/* Languages + Interests side by side */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B", marginBottom: 10 }}>
                <Globe size={15} className="inline mr-2" />Languages
              </h3>
              <div className="flex gap-2 flex-wrap">
                {lf.languages.map((lang) => (
                  <span key={lang} className="rounded-full px-4 py-2" style={{ fontSize: 13, background: "#EFF6FF", color: "#3B82F6", fontWeight: 600, border: "1px solid #BFDBFE" }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B", marginBottom: 10 }}>Expertise</h3>
              <div className="flex gap-2 flex-wrap">
                {lf.interests.map((interest) => (
                  <span key={interest} className="rounded-full px-4 py-2" style={{ fontSize: 13, background: "#FCFAF53EE", color: "#C96F52", fontWeight: 600, border: "1px solid #FFD6C2" }}>
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1A3B2B" }}>Recent Reviews</h3>
                <button onClick={() => router.push(`/app/reviews/${lf.id}`)} style={{ fontSize: 13, fontWeight: 600, color: "#C96F52" }}>
                  See all {lf.reviewCount} →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl p-5" style={{ background: "#F4E9D8", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={r.avatar} alt={r.author} className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
                      <div className="flex-1">
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1A3B2B" }}>{r.author}</div>
                        <div style={{ fontSize: 11, color: "#8B9E94" }}>{r.date} · {r.tripType}</div>
                      </div>
                      <div className="flex">
                        {[...Array(r.rating)].map((_, i) => <span key={i} style={{ color: "#C96F52" }}>★</span>)}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#2C4F3E", lineHeight: 1.7 }}>"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel: book ── */}
      <div
        className="flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ width: 340, borderLeft: "1px solid var(--border)", background: "#FCFAF5", scrollbarWidth: "none" }}
      >
        <div className="px-6 py-6 flex-1">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-5">
            <span style={{ fontSize: 32, fontWeight: 800, color: "#1A3B2B" }}>${lf.hourlyRate}</span>
            <span style={{ fontSize: 15, color: "#8B9E94" }}>/ hour</span>
          </div>

          {/* Availability Calendar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1A3B2B" }}>June 2025</span>
              <div className="flex gap-1">
                <button className="rounded-lg p-1.5" style={{ background: "#F4E9D8" }}><ChevronLeft size={14} /></button>
                <button className="rounded-lg p-1.5" style={{ background: "#F4E9D8" }}><ChevronRight size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center" style={{ fontSize: 10, fontWeight: 600, color: "#8B9E94", paddingBottom: 4 }}>{d}</div>
              ))}
              {[null, null, null].map((_, i) => <div key={`e${i}`} />)}
              {JUNE_DATES.map(({ day, avail }) => (
                <button
                  key={day}
                  disabled={!avail}
                  className="rounded-xl py-1.5 text-center transition-all"
                  style={{
                    fontSize: 12, fontWeight: 600,
                    background: avail ? "#FCFAF53EE" : "transparent",
                    color: avail ? "#C96F52" : "#8B9E94",
                    border: avail ? "1px solid #FFD6C2" : "1px solid transparent",
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Quick info */}
          <div className="flex flex-col gap-2 mb-5">
            {[
              { icon: Clock, text: `Responds ${lf.responseTime}` },
              { icon: Shield, text: "ID Verified & Background Checked" },
              { icon: Globe, text: lf.languages.join(" · ") },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid #F4E9D8" }}>
                <Icon size={15} color="#C96F52" />
                <span style={{ fontSize: 13, color: "#2C4F3E" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <button
            onClick={() => router.push(`/app/booking/${lf.id}`)}
            className="w-full rounded-2xl py-4 transition-all hover:shadow-lg"
            style={{ background: "#C96F52", color: "#FCFAF5", fontSize: 16, fontWeight: 700 }}
          >
            Book Now
          </button>
          <button
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2"
            style={{ background: "#F4E9D8", color: "#2C4F3E", fontSize: 15, fontWeight: 600 }}
          >
            <MessageCircle size={18} />
            Send a Message
          </button>
          <p className="text-center" style={{ fontSize: 12, color: "#8B9E94" }}>Free cancellation · 24hr in advance</p>
        </div>
      </div>
    </div>
  );
}
