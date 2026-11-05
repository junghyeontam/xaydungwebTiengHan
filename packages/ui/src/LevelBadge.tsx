"use client";

import React from "react";
import { Award, Shield, Check } from "lucide-react";
import { Num } from "./Num";

export interface LevelBadgeProps {
  level: string | number;
  label?: string;
  progressPercent?: number; // 0 to 100
  size?: "sm" | "md" | "lg";
  showRing?: boolean;
  className?: string;
}

/**
 * Universal LevelBadge component:
 * - Gold shield/hexagon badge indicating learner level (e.g. "Level 6/8", "TOPIK 2")
 * - Optional progress ring
 */
export function LevelBadge({
  level,
  label = "TOPIK",
  progressPercent,
  size = "md",
  showRing = false,
  className = "",
}: LevelBadgeProps) {
  const sizeMap = {
    sm: {
      box: "w-10 h-10",
      text: "text-xs",
      sub: "text-[8px]",
      stroke: 2.5,
      radius: 16,
    },
    md: {
      box: "w-14 h-14",
      text: "text-sm",
      sub: "text-[9px]",
      stroke: 3,
      radius: 23,
    },
    lg: {
      box: "w-18 h-18 sm:w-20 sm:h-20",
      text: "text-lg",
      sub: "text-[11px]",
      stroke: 3.5,
      radius: 32,
    },
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap.box} ${className}`}>
      {showRing && progressPercent !== undefined && (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={sizeMap.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeMap.stroke}
            className="text-brand-border"
          />
          <circle
            cx="40"
            cy="40"
            r={sizeMap.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeMap.stroke}
            strokeDasharray={2 * Math.PI * sizeMap.radius}
            strokeDashoffset={
              2 * Math.PI * sizeMap.radius * (1 - Math.min(Math.max(progressPercent, 0), 100) / 100)
            }
            strokeLinecap="round"
            className="text-brand-gold transition-all duration-500 ease-out"
          />
        </svg>
      )}

      <div className="relative flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-b from-brand-gold-tint to-amber-500/20 border border-brand-gold/40 p-2 shadow-2xs w-full h-full">
        <span className={`font-black text-amber-800 dark:text-yellow-300 leading-none ${sizeMap.text}`}>
          {level}
        </span>
        {label && (
          <span className={`font-bold tracking-tight text-brand-muted uppercase mt-0.5 ${sizeMap.sub}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  label?: string;
  className?: string;
}

/**
 * Universal ScoreDisplay component:
 * - Big blue score with muted "/200" suffix and a short progress underline
 */
export function ScoreDisplay({
  score,
  maxScore = 200,
  label,
  className = "",
}: ScoreDisplayProps) {
  const percent = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  return (
    <div className={`inline-flex flex-col space-y-1.5 ${className}`}>
      {label && <span className="text-xs font-semibold text-brand-secondary">{label}</span>}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-extrabold text-brand-primary num tracking-tight leading-none">
          <Num value={score} />
        </span>
        <span className="text-sm font-semibold text-brand-muted">
          / <Num value={maxScore} />
        </span>
      </div>
      <div className="w-24 h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border">
        <div
          className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default LevelBadge;

