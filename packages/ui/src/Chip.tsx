"use client";

import React from "react";

export type ChipVariant =
  | "tint"        // Blue tint #E3F0FF
  | "growth"      // Green tint #E8F6F1 for growth / success
  | "gold"        // Gold tint #FEF5E7 for PRO / XP stars
  | "coral"       // Coral tint for urgent signals
  | "surface"     // Neutral surface #F7F9FC
  | "outline";    // Hairline outline

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  size?: "xs" | "sm" | "md";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Universal Chip / Micro-Badge:
 * - Airy tint background, soft contrast typography.
 * - No heavy black borders or outlines.
 */
export function Chip({
  variant = "tint",
  size = "sm",
  icon,
  children,
  className = "",
  ...props
}: ChipProps) {
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
  }[size];

  const variantClasses = {
    tint: "bg-brand-tint text-brand-primary font-semibold",
    growth: "bg-brand-growth text-[#1F9D6B] dark:text-[#2CD693] font-semibold",
    gold: "bg-[#FEF5E7] dark:bg-[#F5B93A]/15 text-[#D97706] dark:text-[#FAC44F] font-semibold",
    coral: "bg-[#FDE8E4] dark:bg-[#E8604C]/15 text-[#E8604C] font-semibold",
    surface: "bg-brand-surface text-brand-secondary font-medium",
    outline: "bg-transparent text-brand-secondary border border-brand-border font-medium",
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-pill select-none tracking-tight ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Chip;

