import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Camera, ThumbsUp, X } from "lucide-react";
import { useLocalFriend } from "@/hooks/useLocalFriends";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useTravelerBookings } from "@/hooks/useBooking";
import { toast } from "sonner";

const EXPERIENCE_PHOTOS = [
  "https://images.unsplash.com/photo-1780241925740-23c28c23faef?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1599033183537-54ff77f58f75?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1670852453934-4ff54fbe77be?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1774223146898-04bbc014a444?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1551883709-2516220df0bc?w=400&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1778532747860-c730f283fc7a?w=400&h=300&fit=crop&auto=format",
];

// Reviews fetched from API
function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span style={{ fontSize: 13, color: "#8B9E94", width: 100, flexShrink: 0 }}>{label}</span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: "#F4E9D8" }}>
        <div className="rounded-full h-full transition-all" style={{ width: `${(value / 5) * 100}%`, background: "linear-gradient(90deg, #C96F52, #D97A5E)" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#2C4F3E", width: 28 }}>{value.toFixed(1)}</span>
    </div>
  );
}

export function Reviews() {
  const { id } = useParams();
  const router = useRouter();

  const { data: lf, isLoading: lfLoading } = useLocalFriend(id as string);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(id as string);
  const { data: bookings = [] } = useTravelerBookings();
  const createReview = useCreateReview();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (lfLoading) return <div className="p-10">Loading profile...</div>;
  if (!lf) return <div className="p-10">Profile not found</div>;

  const handleReviewSubmit = () => {
    // Find a completed booking for this local friend
    const eligibleBooking = bookings.find((b: any) => 
      b.localFriendId === id && b.status === "COMPLETED"
    );

    if (!eligibleBooking) {
      toast.error("You can only review a companion after completing a booking with them.");
      return;
    }

    createReview.mutate({
      bookingId: eligibleBooking.id,
      rating,
      comment
    }, {
      onSuccess: () => {
        toast.success("Review submitted!");
        setShowReviewForm(false);
        setComment("");
        setRating(5);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to submit review");
      }
    });
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div
        className="flex items-center gap-4 px-10 py-5"
        style={{ borderBottom: "1px solid var(--border)", background: "#FCFAF5" }}
      >
        <button onClick={() => router.back()} className="rounded-xl p-2.5 flex items-center gap-2" style={{ background: "#F4E9D8", fontSize: 14, fontWeight: 600, color: "#2C4F3E" }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A3B2B" }}>Reviews for {lf.name}</h1>
          <p style={{ fontSize: 13, color: "#8B9E94" }}>{lf.reviewCount} verified reviews · {lf.city}</p>
        </div>
        <button onClick={() => setShowReviewForm(true)} className="ml-auto rounded-2xl px-5 py-3" style={{ background: "#C96F52", color: "#FCFAF5", fontSize: 14, fontWeight: 700 }}>
          Rate & Review
        </button>
      </div>

      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowReviewForm(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 rounded-full bg-gray-100">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold text-[#1A3B2B] mb-4">Write a Review</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star size={28} color={star <= rating ? "#C96F52" : "#CBD5E1"} fill={star <= rating ? "#C96F52" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#2C4F3E] mb-2">Your Experience</label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your time with this companion?"
                rows={4}
                className="w-full rounded-xl px-4 py-3 outline-none resize-none bg-[#FCFAF5] border border-gray-200"
              />
            </div>
            
            <button 
              onClick={handleReviewSubmit} 
              disabled={createReview.isPending}
              className="w-full rounded-xl py-3 text-white font-bold transition-all"
              style={{ background: "#C96F52", opacity: createReview.isPending ? 0.7 : 1 }}
            >
              {createReview.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      <div className="grid px-10 py-8 gap-8" style={{ gridTemplateColumns: "320px 1fr" }}>

        {/* ── Left: summary ── */}
        <div className="flex flex-col gap-5">
          {/* Overall score */}
          <div className="rounded-3xl p-7" style={{ background: "linear-gradient(135deg, #FCFAF53EE, #FCFAF5BEB)", border: "1px solid #FFD6C2" }}>
            <div className="flex items-center gap-4 mb-5">
              <div style={{ fontSize: 72, fontWeight: 800, color: "#1A3B2B", lineHeight: 1 }}>{lf.rating}</div>
              <div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} color="#C96F52" fill={i < Math.floor(lf.rating) ? "#C96F52" : "none"} />
                  ))}
                </div>
                <div style={{ fontSize: 14, color: "#8B9E94" }}>out of 5</div>
                <div style={{ fontSize: 13, color: "#8B9E94", marginTop: 2 }}>{lf.reviewCount} total reviews</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <RatingBar label="Friendliness" value={4.9} />
              <RatingBar label="Local Knowledge" value={5.0} />
              <RatingBar label="Safety" value={4.8} />
              <RatingBar label="Value" value={4.9} />
              <RatingBar label="Experience" value={5.0} />
            </div>
          </div>

          {/* Traveler breakdown */}
          <div className="rounded-2xl p-5" style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B", marginBottom: 14 }}>Traveler Types</h3>
            {[
              { label: "Solo Travelers", pct: 52, color: "#C96F52" },
              { label: "Couples", pct: 28, color: "#C96F52" },
              { label: "Groups", pct: 20, color: "#C96F52" },
            ].map((t) => (
              <div key={t.label} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontSize: 13, color: "#2C4F3E" }}>{t.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.pct}%</span>
                </div>
                <div className="rounded-full" style={{ height: 6, background: "#F4E9D8" }}>
                  <div className="rounded-full h-full" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Experience photos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera size={16} color="#2C4F3E" />
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A3B2B" }}>Experience Photos</h3>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {EXPERIENCE_PHOTOS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Experience"
                  className="rounded-2xl object-cover w-full transition-all hover:opacity-90"
                  style={{ height: 100 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: reviews ── */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A3B2B", marginBottom: 16 }}>
            All Reviews ({lf.reviewCount})
          </h2>

          <div className="flex flex-col gap-5">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "#FCFAF5", border: "1px solid var(--border)" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img src={r.avatar} alt={r.author} className="rounded-2xl object-cover flex-shrink-0" style={{ width: 52, height: 52 }} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1A3B2B" }}>{r.author}</div>
                        <div style={{ fontSize: 12, color: "#8B9E94" }}>{r.date} · {r.tripType}</div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} color="#C96F52" fill={i < r.rating ? "#C96F52" : "none"} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 15, color: "#2C4F3E", lineHeight: 1.8 }}>"{r.comment}"</p>

                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #F4E9D8" }}>
                  <button className="flex items-center gap-1.5 rounded-xl px-3 py-1.5" style={{ background: "#F4E9D8", fontSize: 12, fontWeight: 600, color: "#2C4F3E" }}>
                    <ThumbsUp size={13} /> Helpful ({Math.floor(Math.random() * 20)})
                  </button>
                  <span style={{ fontSize: 12, color: "#8B9E94", marginLeft: "auto" }}>Verified booking</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
