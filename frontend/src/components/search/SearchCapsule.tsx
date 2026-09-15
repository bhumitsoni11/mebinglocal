"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/lib/utils";

interface SearchCapsuleProps {
  className?: string;
  onExplore?: () => void;
}

export function SearchCapsule({ className, onExplore }: SearchCapsuleProps) {
  const router = useRouter();
  const {
    destination,
    dates,
    passion,
    setDestination,
    setDates,
    setPassion,
  } = useSearchStore();

  const handleExplore = (e: React.FormEvent) => {
    e.preventDefault();
    if (onExplore) {
      onExplore();
    } else {
      const query = new URLSearchParams();
      if (destination) query.set("search", destination);
      if (passion) query.set("passion", passion);
      router.push(`/discover?${query.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleExplore}
      className={cn(
        "w-full max-w-4xl bg-white rounded-full shadow-2xl p-2 md:p-3 border border-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-2 transition-all hover:shadow-[0_20px_40px_-10px_rgba(31,36,33,0.12)]",
        className,
      )}
    >
      {/* Segment 1: Where */}
      <div className="w-full md:w-1/3 flex items-center gap-3 px-5 py-2.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer text-left group">
        <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">
          location_on
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-headline font-bold text-[11px] uppercase text-on-surface-variant tracking-wider">
            Where
          </span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Tokyo, Florence, CDMX..."
            className="bg-transparent font-headline text-xs font-semibold text-on-surface outline-none w-full truncate placeholder:text-outline/70"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-surface-container-highest" />

      {/* Segment 2: When */}
      <div className="w-full md:w-1/4 flex items-center gap-3 px-5 py-2.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer text-left group">
        <span className="material-symbols-outlined text-secondary text-2xl group-hover:scale-110 transition-transform">
          calendar_today
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-headline font-bold text-[11px] uppercase text-on-surface-variant tracking-wider">
            When
          </span>
          <input
            type="text"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder="Oct 12 – Oct 18"
            className="bg-transparent font-headline text-xs font-semibold text-on-surface outline-none w-full truncate placeholder:text-outline/70"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-surface-container-highest" />

      {/* Segment 3: Passion */}
      <div className="w-full md:w-1/3 flex items-center gap-3 px-5 py-2.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer text-left group">
        <span className="material-symbols-outlined text-tertiary text-2xl group-hover:scale-110 transition-transform">
          local_activity
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-headline font-bold text-[11px] uppercase text-on-surface-variant tracking-wider">
            Passion
          </span>
          <input
            type="text"
            value={passion}
            onChange={(e) => setPassion(e.target.value)}
            placeholder="Hidden Gems, Wine, Ceramics..."
            className="bg-transparent font-headline text-xs font-semibold text-on-surface outline-none w-full truncate placeholder:text-outline/70"
          />
        </div>
      </div>

      {/* Explore Button CTA */}
      <button
        type="submit"
        className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-headline text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">search</span>
        <span>Explore</span>
      </button>
    </form>
  );
}
