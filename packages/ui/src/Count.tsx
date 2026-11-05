"use client";

import React from "react";
import { formatCompact, formatNumber } from "@junghyeon/features";
import { useI18n } from "@junghyeon/i18n";

export interface CountProps {
  /** Numerical count */
  count: number | string;
  /** Visual variant */
  variant?: "sidebar" | "alert" | "subtle" | "plain";
  /** Whether to force compact format for large numbers */
  forceCompact?: boolean;
  /** Custom locale override */
  locale?: string;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Standard Badge / Counter component (e.g. sidebar navigation badges).
 * - 12px, font-weight 500, tabular alignment so "3", "128", "1.900" align vertically.
 * - Always uses primary sans font (never monospace).
 * - Counts under 100,000 default to full number (e.g. 1900 -> "1.900").
 * - Never breaks across lines (white-space: nowrap).
 */
export function Count({
  count,
  variant = "plain",
  forceCompact = false,
  locale: propLocale,
  className = "",
}: CountProps) {
  let contextLocale = "vi";
  try {
    const i18n = useI18n();
    if (i18n?.locale) contextLocale = i18n.locale;
  } catch {
    // Context fallback
  }
  const activeLocale = propLocale || contextLocale;

  let display: string;
  if (typeof count === "number") {
    display = formatCompact(count, {
      locale: activeLocale,
      forceCompact,
      isCurrency: false,
    });
  } else {
    // If string like "1.9k" was passed, parse or clean
    const num = parseFloat(count.replace(/[kKmM]/g, "")) * (count.toLowerCase().includes("k") ? 1000 : count.toLowerCase().includes("m") ? 1000000 : 1);
    if (!isNaN(num) && num > 0) {
      display = formatCompact(num, {
        locale: activeLocale,
        forceCompact,
        isCurrency: false,
      });
    } else {
      display = count;
    }
  }

  const variantStyles = {
    plain: "text-inherit",
    sidebar: "px-1.5 py-0.5 rounded-full text-xs font-medium bg-admin-subtle text-admin-text-muted border border-admin-border/80",
    alert: "px-1.5 py-0.5 rounded-full text-xs font-medium bg-admin-brand-coral/10 text-admin-brand-coral border border-admin-brand-coral/20",
    subtle: "px-1.5 py-0.5 rounded-full text-xs font-medium bg-admin-brand-teal/10 text-admin-brand-teal border border-admin-brand-teal/20",
  }[variant];

  return (
    <span
      data-num="true"
      className={`num-tabular font-medium text-xs whitespace-nowrap select-text ${variantStyles} ${className}`}
    >
      {display}
    </span>
  );
}
export default Count;

