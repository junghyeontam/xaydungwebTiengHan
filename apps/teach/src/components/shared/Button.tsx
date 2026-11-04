"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "cta" | "secondary" | "ghost" | "icon";
export type ButtonSize = "lg" | "md" | "sm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  href?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Universal Button component adhering to the clean modern SaaS design system:
 * - Primary: Solid primary blue #2347B5, white text, 48px height, 14px radius, hover lift.
 * - CTA: Vibrant coral #E8604C (strictly reserved for main purchase/enroll actions).
 * - Secondary: Clean white with 1px hairline border #E6EAF1 and navy text #1B2A6B.
 * - Ghost: Subtle tint panel hover without border.
 * - Icon: 44px minimum touch-target for mobile accessibility.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      pill = false,
      href,
      loading = false,
      disabled = false,
      icon,
      iconRight,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      lg: `h-12 px-6 text-sm sm:text-base ${pill ? "rounded-pill" : "rounded-control"} tracking-tight`,
      md: `h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm ${pill ? "rounded-pill" : "rounded-control"} tracking-tight`,
      sm: `h-8 sm:h-9 px-3.5 text-xs ${pill ? "rounded-pill" : "rounded-control"}`,
    }[size];

    const variantClasses = {
      primary:
        "bg-brand-primary hover:bg-brand-primary-hover text-white shadow-xs hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 active:scale-[0.98]",
      cta:
        "bg-brand-coral hover:bg-brand-coral-hover text-white shadow-xs hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 active:scale-[0.98]",
      secondary:
        "bg-brand-surface hover:bg-brand-bg text-brand-navy border border-brand-border hover:border-brand-border-strong shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-brand-tint text-brand-secondary hover:text-brand-navy active:scale-[0.98]",
      icon:
        "w-10 h-10 p-0 flex items-center justify-center rounded-control bg-brand-surface hover:bg-brand-tint text-brand-secondary hover:text-brand-navy border border-brand-border active:scale-95",
    }[variant];

    const combinedClasses = `
      inline-flex items-center justify-center gap-2 font-semibold select-none
      transition-all duration-150 ease-out outline-none
      focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
      disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none
      ${variant === "icon" ? "w-10 h-10 p-0 rounded-control" : sizeClasses}
      ${variantClasses}
      ${className}
    `.trim().replace(/\s+/g, " ");

    const content = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </>
    );

    if (href && !disabled && !loading) {
      return (
        <Link href={href} className={combinedClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
