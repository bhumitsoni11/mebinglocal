"use client";

import React from "react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatCurrency, cn } from "@/lib/utils";

export interface LocalFriendCardProps {
  local?: {
    id: string;
    name: string;
    avatar: string;
    city: string;
    country?: string;
    tagline?: string;
    bio?: string;
    hourlyRate: number | string;
    rating?: number;
    ratingScore?: number;
    reviewCount?: number;
    languages?: string[];
    isVerified?: boolean;
    isSuperhost?: boolean;
    badgeLevel?: "VERIFIED" | "SUPERHOST" | "TOP_HOST" | string;
  };
  id?: string;
  name?: string;
  avatar?: string;
  city?: string;
  country?: string;
  tagline?: string;
  bio?: string;
  hourlyRate?: number | string;
  ratingScore?: number;
  rating?: number;
  reviewCount?: number;
  languages?: string[];
  isSuperhost?: boolean;
  badgeLevel?: "VERIFIED" | "SUPERHOST" | "TOP_HOST" | string;
  className?: string;
}

export function LocalFriendCard(props: LocalFriendCardProps) {
  const data = props.local || props;

  const id = data.id || "local-1";
  const name = data.name || "Local Friend";
  const avatar = data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80";
  const city = data.city || "Florence";
  const country = data.country;
  const tagline = data.tagline;
  const bio = data.bio;
  const hourlyRate = data.hourlyRate || 35;
  const score = data.rating || data.ratingScore || 5.0;
  const reviewCount = data.reviewCount || 0;
  const languages = data.languages || ["English"];
  const badgeLevel = data.badgeLevel || (data.isSuperhost ? "SUPERHOST" : "VERIFIED");

  return (
    <div
      className={cn(
        "group bg-white rounded-xl overflow-hidden border border-surface-container-highest shadow-warm-xs hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between",
        props.className,
      )}
    >
      {/* Media Box */}
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Verified Pill */}
        <div className="absolute top-3 left-3">
          <VerifiedBadge level={badgeLevel} />
        </div>

        {/* Save Bookmark button */}
        <button
          type="button"
          aria-label="Save Local Friend"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-base">favorite</span>
        </button>

        {/* Location & Rating Strip */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center justify-between text-on-surface shadow-xs border border-white/40">
          <span className="font-headline font-bold text-xs truncate">
            {city}{country ? `, ${country}` : ""}
          </span>
          <RatingStars score={score} reviewCount={reviewCount} />
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/local-friends/${id}`}>
            <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          <p className="font-body text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
            {bio || tagline || "Verified resident host sharing authentic neighborhood culture."}
          </p>

          {/* Languages */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {languages.slice(0, 3).map((lang) => (
              <span
                key={lang}
                className="font-body text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-3 border-t border-surface-container-low flex items-center justify-between">
          <div>
            <span className="font-body text-xs text-on-surface-variant">From</span>
            <span className="font-headline font-bold text-base text-primary ml-1">
              {formatCurrency(hourlyRate)}
            </span>
            <span className="font-body text-[11px] text-on-surface-variant">/hr</span>
          </div>

          <Link
            href={`/local-friends/${id}`}
            className="px-4 py-1.5 bg-surface-container hover:bg-primary hover:text-white text-on-surface font-headline text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
          >
            Connect
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LocalFriendCard;
