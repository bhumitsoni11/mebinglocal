import React from "react";
import { cn } from "@/lib/utils";

export interface RatingStarsProps {
  score?: number;
  rating?: number;
  reviewCount?: number;
  className?: string;
  showScore?: boolean;
}

export function RatingStars({
  score,
  rating,
  reviewCount,
  className,
  showScore = true,
}: RatingStarsProps) {
  const finalScore = score !== undefined ? score : rating !== undefined ? rating : 5.0;
  const formattedScore = Number(finalScore || 5).toFixed(finalScore % 1 === 0 ? 1 : 2);

  return (
    <div className={cn("inline-flex items-center gap-1 text-on-surface", className)}>
      <span className="material-symbols-outlined text-xs text-rating-gold fill">
        star
      </span>
      {showScore && <span className="font-bold text-xs">{formattedScore}</span>}
      {reviewCount !== undefined && (
        <span className="text-on-surface-variant text-xs">({reviewCount})</span>
      )}
    </div>
  );
}

export default RatingStars;
