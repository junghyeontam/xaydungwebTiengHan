"use client";

import React from "react";
import { Crown } from "lucide-react";

export interface ProBadgeProps {
  label?: string;
  size?: "sm" | "md";
  variant?: "pill" | "icon";
  className?: string;
}

/**
 * Standard PRO / VIP Badge component.
 * - Gold #F5B93A accent crown symbol for premium/PRO signals.
 * - Clean, non-neon, elegant modern SaaS styling.
 */
export function ProBadge({
  label = "PRO",
  size = "md",
  variant = "pill",
  className = "",
}: ProBadgeProps) {
  if (variant === "icon") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-brand-gold text-white shadow-xs ${
          size === "sm" ? "w-5 h-5" : "w-6 h-6"
        } ${className}`}
        title="PRO Feature"
      >
        <Crown className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      </span>
    );
  }

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full bg-brand-gold-tint text-amber-700 dark:text-yellow-400 border border-brand-gold/30 shadow-2xs select-none ${sizeClasses} ${className}`}
    >
      <Crown className={size === "sm" ? "w-3 h-3 text-brand-gold" : "w-3.5 h-3.5 text-brand-gold"} />
      <span>{label}</span>
    </span>
  );
}

export default ProBadge;

