"use client";

import React from "react";
import { Percent } from "./Percent";

export interface ProgressBarProps {
  value: number; // 0 - 100 or current units
  max?: number;
  variant?: "teal" | "primary" | "gold";
  height?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  label?: string;
}

/**
 * Universal ProgressBar:
 * - 10px rounded bar with smooth gradient on a light subtle track.
 * - No thick borders or heavy outlines.
 */
export function ProgressBar({
  value,
  max = 100,
  variant = "teal",
  height = "md",
  className = "",
  showLabel = false,
  label,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    sm: "h-2",
    md: "h-2.5", // 10px standard
    lg: "h-3.5",
  }[height];

  const fillVariants = {
    teal: "bg-gradient-to-r from-[#3DBBA8] via-[#2FBF9B] to-[#1F9D6B]",
    primary: "bg-gradient-to-r from-[#1E44A8] to-[#3B6FE0]",
    gold: "bg-gradient-to-r from-[#F5B93A] to-[#E39B1B]",
  }[variant];

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold text-brand-body">
          <span>{label}</span>
          <span className="font-semibold text-brand-secondary num-tabular">
            <Percent value={percentage} isDecimal={false} />
          </span>
        </div>
      )}

      <div
        className={`w-full ${heightClasses} rounded-full bg-brand-surface dark:bg-white/10 overflow-hidden p-0.5 border border-brand-border/40`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full ${fillVariants} transition-all duration-500 ease-out shadow-xs`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

