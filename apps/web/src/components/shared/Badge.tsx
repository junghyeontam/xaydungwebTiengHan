"use client";

import React from "react";

export type BadgeVariant =
  | "tint"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "free"
  | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Universal Badge / Status Chip component.
 * - Flat, clean tinted pills with soft hairline borders.
 * - Conforms to the modern SaaS design tokens.
 */
export function Badge({
  variant = "tint",
  size = "md",
  icon,
  children,
  className = "",
}: BadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5";

  const variantClasses = {
    tint: "bg-brand-tint text-brand-primary border border-brand-frame/60 font-semibold",
    free: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold",
    success: "bg-brand-success/10 text-brand-success border border-brand-success/20 font-semibold",
    warning: "bg-brand-warning/10 text-brand-warning border border-brand-warning/20 font-semibold",
    danger: "bg-brand-danger/10 text-brand-danger border border-brand-danger/20 font-semibold",
    outline: "bg-transparent text-brand-secondary border border-brand-border font-medium",
    neutral: "bg-brand-surface text-brand-secondary border border-brand-border font-medium",
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full select-none tracking-tight ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
