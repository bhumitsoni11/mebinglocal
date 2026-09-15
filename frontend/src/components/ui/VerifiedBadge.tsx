import React from "react";
import { cn } from "@/lib/utils";

export interface VerifiedBadgeProps {
  label?: string;
  level?: "VERIFIED" | "SUPERHOST" | "TOP_HOST" | string;
  className?: string;
  size?: "sm" | "md";
}

export function VerifiedBadge({
  label,
  level,
  className,
  size = "md",
}: VerifiedBadgeProps) {
  const displayLabel = label || (level === "SUPERHOST" ? "Superhost" : level === "TOP_HOST" ? "Top Host" : "Verified Local");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-secondary-container/95 text-on-secondary-container font-headline font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-secondary/15",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        className,
      )}
    >
      <span className="material-symbols-outlined text-secondary fill text-xs">
        verified
      </span>
      <span>{displayLabel}</span>
    </div>
  );
}

export default VerifiedBadge;
