"use client";

import React from "react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";

export interface ExperienceCardProps {
  experience?: {
    id: string;
    title: string;
    description: string;
    category?: string;
    price?: number | string;
    pricePerPerson?: number | string;
    durationHours?: number;
    coverImage?: string;
    imageUrl?: string;
    location?: string;
    locationLabel?: string;
    city?: string;
    host?: {
      name: string;
      avatar: string;
      isVerified?: boolean;
    };
    hostName?: string;
    hostAvatar?: string;
    rating?: number;
    ratingScore?: number;
    reviewCount?: number;
  };
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  pricePerPerson?: number | string;
  price?: number | string;
  durationHours?: number;
  coverImage?: string;
  imageUrl?: string;
  location?: string;
  locationLabel?: string;
  city?: string;
  hostName?: string;
  hostAvatar?: string;
  host?: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  ratingScore?: number;
  rating?: number;
  reviewCount?: number;
  className?: string;
}

export function ExperienceCard(props: ExperienceCardProps) {
  const data = props.experience || props;

  const id = data.id || "exp-1";
  const title = data.title || "Curated Experience";
  const description = data.description || "";
  const price = data.pricePerPerson || data.price || 50;
  const durationHours = data.durationHours || 3.0;
  const image = data.imageUrl || data.coverImage || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&fit=crop&q=80";
  const locationLabel = data.locationLabel || data.location || data.city;
  const hostName = data.hostName || data.host?.name;
  const hostAvatar = data.hostAvatar || data.host?.avatar;
  const ratingScore = data.ratingScore || data.rating || 5.0;

  return (
    <div
      className={cn(
        "group bg-white rounded-xl overflow-hidden border border-surface-container-highest shadow-warm-xs hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between",
        props.className,
      )}
    >
      {/* Imagery Box */}
      <div className="relative h-64 overflow-hidden bg-surface-container">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {locationLabel && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-on-surface shadow-xs">
            {locationLabel}
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-on-surface/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-white flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">schedule</span>
          <span>{durationHours} Hours</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {hostName && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-surface-container shrink-0">
                <img
                  src={
                    hostAvatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80"
                  }
                  alt={hostName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-body text-xs text-on-surface-variant">
                Hosted by <strong className="text-on-surface">{hostName}</strong>
              </span>
              <span className="text-xs text-outline">·</span>
              <div className="flex items-center gap-1 text-xs text-on-surface font-bold">
                <span className="material-symbols-outlined text-xs text-rating-gold fill">
                  star
                </span>
                <span>{ratingScore.toFixed(1)}</span>
              </div>
            </div>
          )}

          <Link href={`/experiences/${id}`}>
            <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-snug">
              {title}
            </h3>
          </Link>

          <p className="font-body text-xs text-on-surface-variant mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-surface-container-low flex items-center justify-between">
          <div>
            <span className="font-body text-xs text-on-surface-variant">From</span>
            <span className="font-headline font-bold text-lg text-on-surface ml-1">
              {formatCurrency(price)}
            </span>
            <span className="font-body text-[11px] text-on-surface-variant">/person</span>
          </div>

          <Link
            href={`/experiences/${id}`}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-headline text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all transform active:scale-95"
          >
            Book Experience
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
