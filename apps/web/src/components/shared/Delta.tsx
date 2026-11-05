"use client";

import React from "react";
import { formatDelta } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nContext";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface DeltaProps {
  /** Delta value (e.g. 0.128 or 12.8, or -0.052 or -5.2) */
  value: number;
  /** Whether the value is given as decimal ratio (e.g. 0.128) */
  isDecimal?: boolean;
  /** Icon style variant */
  iconVariant?: "trend" | "arrow" | "none";
  /** Optional comparison period text (e.g. "so với tháng trước") */
  period?: string;
  /** Custom locale override */
  locale?: string;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Standard Delta representation with trend icon and semantic coloring.
 * - Displays "+12,8%" or "-5,2%"
 * - Proportional lining numerals, never monospace
 */
export function Delta({
  value,
  isDecimal,
  iconVariant = "trend",
  period,
  locale: propLocale,
  className = "",
}: DeltaProps) {
  let contextLocale = "vi";
  try {
    const i18n = useI18n();
    if (i18n?.locale) contextLocale = i18n.locale;
  } catch {
    // Context fallback
  }
  const activeLocale = propLocale || contextLocale;

  const { formatted, isPositive } = formatDelta(value, activeLocale, { isDecimal });

  const colorClass = isPositive
    ? "text-admin-success dark:text-emerald-400"
    : "text-admin-danger dark:text-red-400";

  const renderIcon = () => {
    if (iconVariant === "none") return null;
    if (iconVariant === "arrow") {
      return isPositive ? (
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
      );
    }
    return isPositive ? (
      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
    ) : (
      <TrendingDown className="w-3.5 h-3.5 shrink-0" />
    );
  };

  return (
    <span
      data-num="true"
      className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap select-text ${colorClass} ${className}`}
    >
      {renderIcon()}
      <span className="num">{formatted}</span>
      {period && (
        <span className="text-muted-foreground/80 dark:text-admin-text-muted text-[11px] font-normal ml-0.5">
          {period}
        </span>
      )}
    </span>
  );
}
export default Delta;
