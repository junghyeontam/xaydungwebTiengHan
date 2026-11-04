"use client";

import React from "react";
import { ArrowDown } from "lucide-react";

export interface ScrollHintButtonProps {
  targetId?: string;
  className?: string;
}

/**
 * Universal ScrollHintButton:
 * - Small circular white button with down arrow
 * - Centered on the bottom edge of the hero banner with a soft shadow
 * - Smoothly scrolls to target section (default: next element or #features)
 */
export function ScrollHintButton({
  targetId = "next-section",
  className = "",
}: ScrollHintButtonProps) {
  const handleClick = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: 600, behavior: "smooth" });
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Cuá»™n xuá»‘ng xem ná»™i dung tiáº¿p theo"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-brand-surface text-brand-navy border border-[#D5E5FA] dark:border-brand-border hover:border-brand-primary hover:text-brand-primary shadow-sm hover:shadow-card flex items-center justify-center transition-all duration-200 active:scale-95 group cursor-pointer"
      >
        <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}

export default ScrollHintButton;

