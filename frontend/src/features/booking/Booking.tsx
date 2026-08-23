import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


import { ArrowLeft, CheckCircle, CreditCard, Clock, Shield, Star } from "lucide-react";
import { useLocalFriend } from "@/hooks/useLocalFriends";

const JUNE_DATES = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const AVAILABLE = [18, 20, 21, 23, 24, 26, 27, 28, 30];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const DURATIONS = [1, 2, 3, 4, 5, 6];
const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export function Booking() {
  const { id } = useParams();
  const router = useRouter();

  const { data: lf, isLoading: lfLoading } = useLocalFriend(id as string);

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (lfLoading) return <div className="p-10">Loading booking...</div>;
  if (!lf) return <div className="p-10">Companion not found</div>;

  const subtotal = lf.hourlyRate * duration;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  if (confirmed) {
    return (
      <div className="flex items-center justify-center h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#F8F9FE" }}>
        <div className="flex flex-col items-center text-center" style={{ maxWidth: 480 }}>
          <div className="rounded-full flex items-center justify-center mb-6" style={{ width: 120, height: 120, background: "#ECFDF5" }}>
            <CheckCircle size={60} color="#C96F52" />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1A3B2B", marginBottom: 12 }}>Booking Confirmed! 🎉</h2>
          <p style={{ fontSize: 16, color: "#8B9E94", lineHeight: 1.7, marginBottom: 12 }}>
            Your adventure with <strong style={{ color: "#1A3B2B" }}>{lf.name}</strong> is booked for
          </p>
          <div className="rounded-3xl px-8 py-5 mb-8" style={{ background: "#FCFAF53EE", border: "1px solid #FFD6C2" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#C96F52" }}>June {selectedDate}, 2025 · {selectedTime}</div>
            <div style={{ fontSize: 15, color: "#8B9E94", marginTop: 4 }}>{duration} hour{duration > 1 ? "s" : ""} · {lf.city}</div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/app")} className="rounded-2xl px-8 py-4" style={{ background: "#C96F52", color: "#FCFAF5", fontSize: 15, fontWeight: 700 }}>
              Back to Home
            </button>
            <button onClick={() => router.push("/app/safety")} className="rounded-2xl px-8 py-4" style={{ background: "#F4E9D8", color: "#2C4F3E", fontSize: 15, fontWeight: 600 }}>
              Safety Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Left: Date & Time picker ── */}
      <div className="flex-1 overflow-y-auto px-10 py-8" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: "#F4E9D8", fontSize: 14, fontWeight: 600, color: "#2C4F3E" }}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1A3B2B", letterSpacing: "-0.02em" }}>Book Your Experience</h1>
            <p style={{ fontSize: 14, color: "#8B9E94" }}>with {lf.name} in {lf.city}</p>
          </div>
        </div>

        {/* Date picker */}
        <div className="mb-8">
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1A3B2B", marginBottom: 16 }}>Select a Date</h2>
          <div className="flex gap-3 flex-wrap">
            {JUNE_DATES.map((d, i) => {
              const avail = AVAILABLE.includes(d);
              const selected = selectedDate === d;
              return (
                <button
                  key={d}
                  disabled={!avail}
                  onClick={() => setSelectedDate(d)}
                  className="rounded-2xl flex flex-col items-center py-4 px-5 transition-all"
                  style={{
                    background: selected ? "#C96F52" : avail ? "#FCFAF5" : "#F4E9D8",
                    color: selected ? "#FCFAF5" : avail ? "#1A3B2B" : "#8B9E94",
                    border: selected ? "2px solid #C96F52" : avail ? "1.5px solid #8B9E94" : "1.5px solid #F4E9D8",
                    boxShadow: selected ? "0 4px 16px rgba(255,107,53,0.3)" : "none",
                    minWidth: 70,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>{DAY_LABELS[i]}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{d}</span>
                  <span style={{ fontSize: 10, marginTop: 2, opacity: avail ? 0.7 : 0.5 }}>{avail ? "Open" : "Busy"}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time */}
        {selectedDate && (
          <div className="mb-8">
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1A3B2B", marginBottom: 16 }}>Select a Time</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className="rounded-2xl py-3.5 transition-all"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    background: selectedTime === t ? "#C96F52" : "#FCFAF5",
                    color: selectedTime === t ? "#FCFAF5" : "#2C4F3E",
                    border: selectedTime === t ? "2px solid #C96F52" : "1.5px solid #8B9E94",
                    boxShadow: selectedTime === t ? "0 4px 16px rgba(255,107,53,0.25)" : "none",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1A3B2B" }}>How long?</h2>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#C96F52" }}>{duration} hour{duration > 1 ? "s" : ""}</span>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className="rounded-2xl py-4 flex flex-col items-center transition-all"
                style={{
                  background: duration === d ? "#1A3B2B" : "#FCFAF5",
                  color: duration === d ? "#FCFAF5" : "#2C4F3E",
                  border: duration === d ? "2px solid #1A3B2B" : "1.5px solid #8B9E94",
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                {d}
                <span style={{ fontSize: 10, fontWeight: 500, marginTop: 2, opacity: 0.7 }}>hr{d > 1 ? "s" : ""}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Summary ── */}
      <div
        className="flex-shrink-0 flex flex-col"
        style={{ width: 360, borderLeft: "1px solid var(--border)", background: "#FCFAF5" }}
      >
        {/* Friend summary */}
        <div className="p-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <img src={lf.avatar} alt={lf.name} className="rounded-2xl object-cover" style={{ width: 64, height: 64 }} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#1A3B2B" }}>{lf.name}</div>
              <div style={{ fontSize: 13, color: "#8B9E94" }}>📍 {lf.city}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={13} color="#C96F52" fill="#C96F52" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{lf.rating}</span>
                <span style={{ fontSize: 12, color: "#8B9E94" }}>({lf.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking summary */}
        <div className="p-6 flex-1">
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B", marginBottom: 16 }}>Booking Summary</h3>

          {[
            { label: "Date", value: selectedDate ? `June ${selectedDate}, 2025` : "Not selected", empty: !selectedDate },
            { label: "Time", value: selectedTime ?? "Not selected", empty: !selectedTime },
            { label: "Duration", value: `${duration} hour${duration > 1 ? "s" : ""}`, empty: false },
          ].map((row) => (
            <div key={row.label} className="flex justify-between py-3" style={{ borderBottom: "1px solid #F4E9D8" }}>
              <span style={{ fontSize: 13, color: "#8B9E94" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.empty ? "#8B9E94" : "#1A3B2B" }}>{row.value}</span>
            </div>
          ))}

          {/* Price */}
          <div className="mt-4 rounded-2xl p-4" style={{ background: "#F4E9D8" }}>
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: 13, color: "#8B9E94" }}>${lf.hourlyRate} × {duration} hr{duration > 1 ? "s" : ""}</span>
              <span style={{ fontSize: 13, color: "#2C4F3E" }}>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span style={{ fontSize: 13, color: "#8B9E94" }}>Service fee (12%)</span>
              <span style={{ fontSize: 13, color: "#2C4F3E" }}>${serviceFee}</span>
            </div>
            <div className="flex justify-between pt-3" style={{ borderTop: "1px solid #8B9E94" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B" }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#C96F52" }}>${total}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl p-4 flex items-center gap-3 mt-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <CreditCard size={20} color="#3B82F6" />
            <div className="flex-1">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2C4F3E" }}>Visa ending in 4242</div>
              <div style={{ fontSize: 12, color: "#8B9E94" }}>Default payment method</div>
            </div>
            <button style={{ fontSize: 13, fontWeight: 600, color: "#3B82F6" }}>Edit</button>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl p-3" style={{ background: "#ECFDF5" }}>
            <Shield size={15} color="#059669" className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: 12, color: "#047857", lineHeight: 1.5 }}>
              Secure payment · Free cancellation up to 24 hours before your experience
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => selectedDate && selectedTime && setConfirmed(true)}
            className="w-full rounded-2xl py-4 transition-all"
            style={{
              background: selectedDate && selectedTime ? "#C96F52" : "#8B9E94",
              color: selectedDate && selectedTime ? "#FCFAF5" : "#8B9E94",
              fontSize: 16,
              fontWeight: 700,
              boxShadow: selectedDate && selectedTime ? "0 4px 20px rgba(255,107,53,0.3)" : "none",
            }}
          >
            {selectedDate && selectedTime ? `Confirm Booking · $${total}` : "Select date & time to continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
