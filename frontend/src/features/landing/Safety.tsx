import { useState } from "react";
import { useRouter } from 'next/navigation';

import { ArrowLeft, Shield, MapPin, Phone, AlertTriangle, Users, ChevronRight, CheckCircle } from "lucide-react";

const SAFETY_FEATURES = [
  { icon: Shield, title: "ID Verified Companions", desc: "Every Companion submits government-issued ID and passes a background check before joining.", color: "#C96F52", bg: "#ECFDF5" },
  { icon: MapPin, title: "Live Location Sharing", desc: "Share your real-time location with up to 5 trusted contacts during your experience.", color: "#3B82F6", bg: "#EFF6FF" },
  { icon: Phone, title: "One-Tap SOS", desc: "Emergency button sends your GPS location to local authorities and trusted contacts instantly.", color: "#EF4444", bg: "#FEF2F2" },
  { icon: Users, title: "Women-Only Option", desc: "Female travelers can filter exclusively for verified women companions.", color: "#C96F52", bg: "#F5F3FF" },
];

const GUIDELINES = [
  "Always meet your Companion in a public place first",
  "Share your booking details with someone you trust",
  "Keep the in-app chat active throughout your experience",
  "Rate and review after every session",
  "Contact support immediately if anything feels wrong",
];

export function Safety() {
  const router = useRouter();
  const [sosActive, setSosActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const contacts = [
    { name: "Mom", phone: "+1 555 0123", avatar: "👩" },
    { name: "David", phone: "+1 555 0456", avatar: "👨" },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-4 px-10 py-5"
        style={{ borderBottom: "1px solid var(--border)", background: "#FCFAF5" }}
      >
        <button onClick={() => router.back()} className="rounded-xl p-2" style={{ background: "#F4E9D8" }}>
          <ArrowLeft size={16} color="#2C4F3E" />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A3B2B" }}>Safety Center</h1>
          <p style={{ fontSize: 13, color: "#8B9E94" }}>Your protection tools and trusted contacts</p>
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: "#ECFDF5" }}>
          <CheckCircle size={16} color="#059669" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>You're protected</span>
        </div>
      </div>

      <div className="grid px-10 py-8 gap-8" style={{ gridTemplateColumns: "1fr 1fr" }}>

        {/* ── Left column ── */}
        <div className="flex flex-col gap-6">
          {/* SOS Panel */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3B2B, #1E293B)" }}>
            <div className="p-8 flex flex-col items-center text-center">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#FCFAF5", marginBottom: 6 }}>Emergency SOS</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 28, lineHeight: 1.6 }}>
                Tap once to alert your trusted contacts and local emergency services with your GPS location.
              </p>
              <button
                onClick={() => setSosActive(!sosActive)}
                className="rounded-full flex flex-col items-center justify-center transition-all"
                style={{
                  width: 130,
                  height: 130,
                  background: sosActive ? "#EF4444" : "rgba(239,68,68,0.12)",
                  border: `3px solid ${sosActive ? "#EF4444" : "rgba(239,68,68,0.35)"}`,
                  boxShadow: sosActive ? "0 0 0 24px rgba(239,68,68,0.15), 0 0 0 48px rgba(239,68,68,0.06)" : "none",
                  transition: "all 0.35s",
                }}
              >
                <AlertTriangle size={40} color={sosActive ? "#FCFAF5" : "#EF4444"} />
                <span style={{ fontSize: 14, fontWeight: 800, color: sosActive ? "#FCFAF5" : "#EF4444", marginTop: 8 }}>
                  {sosActive ? "ACTIVE" : "SOS"}
                </span>
              </button>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
                {sosActive ? "🔴 Emergency services notified · Contacts alerted" : "Tap to activate"}
              </p>
            </div>
          </div>

          {/* Location toggle */}
          <div className="rounded-2xl p-5" style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, background: "#EFF6FF" }}>
                  <MapPin size={20} color="#3B82F6" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3B2B" }}>Live Location Sharing</div>
                  <div style={{ fontSize: 12, color: "#8B9E94" }}>{locationShared ? "Sharing with 2 contacts" : "Not sharing currently"}</div>
                </div>
              </div>
              <button
                onClick={() => setLocationShared(!locationShared)}
                className="rounded-full transition-colors"
                style={{ width: 50, height: 28, background: locationShared ? "#3B82F6" : "#8B9E94", position: "relative" }}
              >
                <span
                  className="absolute rounded-full"
                  style={{ width: 22, height: 22, background: "#FCFAF5", top: 3, left: locationShared ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
                />
              </button>
            </div>
          </div>

          {/* Trusted contacts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1A3B2B" }}>Trusted Contacts</h3>
              <button className="rounded-xl px-4 py-2" style={{ fontSize: 13, fontWeight: 600, background: "#FCFAF53EE", color: "#C96F52" }}>
                + Add Contact
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {contacts.map((c) => (
                <div key={c.name} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}>
                  <div className="rounded-full flex items-center justify-center text-2xl" style={{ width: 50, height: 50, background: "#F4E9D8" }}>
                    {c.avatar}
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1A3B2B" }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: "#8B9E94" }}>{c.phone}</div>
                  </div>
                  <button className="rounded-xl px-4 py-2" style={{ fontSize: 12, fontWeight: 700, background: "#EFF6FF", color: "#3B82F6" }}>
                    Share Location
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-6">
          {/* Safety features */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1A3B2B", marginBottom: 14 }}>Safety Features</h3>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {SAFETY_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}
                >
                  <div className="rounded-xl flex items-center justify-center" style={{ width: 48, height: 48, background: f.bg }}>
                    <f.icon size={22} color={f.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A3B2B" }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: "#8B9E94", lineHeight: 1.6, marginTop: 4 }}>{f.desc}</div>
                  </div>
                  <div className="flex items-center gap-1 mt-auto" style={{ color: f.color, fontSize: 12, fontWeight: 600 }}>
                    Learn more <ChevronRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Guidelines */}
          <div className="rounded-2xl p-6" style={{ background: "#FCFAF5BEB", border: "1px solid #FDE68A" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#92400E", marginBottom: 14 }}>Safety Guidelines</h3>
            <div className="flex flex-col gap-3">
              {GUIDELINES.map((g, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ width: 24, height: 24, background: "#C96F52", fontSize: 11, fontWeight: 800, color: "#FCFAF5", marginTop: 1 }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: "#78350F", lineHeight: 1.6 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 24/7 support */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, #C96F52, #D97A5E)", boxShadow: "0 4px 24px rgba(255,107,53,0.25)" }}
          >
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.2)" }}>
              <Phone size={24} color="#FCFAF5" />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FCFAF5" }}>24/7 Traveler Support</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Our team is always here for you — chat, call, or email.</div>
            </div>
            <button className="rounded-xl px-5 py-2.5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)", color: "#FCFAF5", fontSize: 14, fontWeight: 700, border: "1px solid rgba(255,255,255,0.3)" }}>
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
