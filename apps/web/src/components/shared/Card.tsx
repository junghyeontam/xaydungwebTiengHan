"use client";

import React from "react";

export type CardVariant =
  | "surface"       // Default: filled surface #F7F9FC with NO border
  | "outline"       // White with 1px hairline border & soft shadow
  | "standard"      // Synonym for outline
  | "selected"      // Selected/Active: tint fill #E3F0FF + 1.5px primary border
  | "growth"        // Green tint #E8F6F1 for growth/success
  | "locked"        // Inactive / locked: reduced opacity, muted text, no extra border
  | "interactive";  // Hoverable: surface fill or white, raises 2px on hover with focus ring

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Universal Card Container adhering to clean, airy modern SaaS guidelines:
 * - Default: filled surface #F7F9FC with NO border.
 * - Single level of containment: never stack heavy bordered boxes inside bordered boxes.
 * - Never thick black borders.
 * - Focus-visible: 2px primary ring with offset.
 */
export function Card({
  variant = "surface",
  padding = "md",
  children,
  className = "",
  as: Component = "div",
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-4 sm:p-5",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  }[padding];

  const variantClasses = {
    surface:
      "bg-brand-surface text-brand-body rounded-card shadow-xs transition-colors",
    outline:
      "bg-brand-bg text-brand-body border border-brand-border rounded-card shadow-xs transition-colors",
    standard:
      "bg-brand-bg text-brand-body border border-brand-border rounded-card shadow-xs transition-colors",
    selected:
      "bg-brand-tint text-brand-body border-[1.5px] border-brand-primary rounded-card shadow-xs",
    growth:
      "bg-brand-growth text-brand-body rounded-card shadow-xs",
    locked:
      "bg-brand-surface/60 text-brand-muted opacity-60 rounded-card select-none",
    interactive:
      "bg-brand-surface hover:bg-brand-bg text-brand-body border border-transparent hover:border-brand-border rounded-card shadow-xs hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-all duration-200 cursor-pointer",
  }[variant];

  return (
    <Component
      className={`${variantClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
