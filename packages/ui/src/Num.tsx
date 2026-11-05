"use client";

import React from "react";
import { formatNumber, formatCompact, formatPercent } from "@junghyeon/features";
import { useI18n } from "@junghyeon/i18n";

export interface NumProps {
  /** Numeric or string value */
  value: number | string;
  /** Format style */
  format?: "number" | "compact" | "percent" | "raw";
  /** Whether digits must line up vertically (tables, charts, countdowns) */
  tabular?: boolean;
  /** Large KPI format (32px-36px, weight 600, tight spacing) */
  kpi?: boolean;
  /** Optional prefix e.g. "+", "-" */
  prefix?: string;
  /** Optional suffix e.g. " XP", " bÃ i", "%" */
  suffix?: string;
  /** Fraction digits for floating point numbers */
  fractionDigits?: number;
  /** Specific locale override ("vi" | "en") */
  locale?: string;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Single source of truth for numbers, counts, and stats.
 * - Always renders in primary UI font (Be Vietnam Pro / Plus Jakarta Sans).
 * - Proportional lining figures by default; tabular lining when tabular={true}.
 * - Never monospace; never breaks across lines (white-space: nowrap).
 */
export function Num({
  value,
  format = "number",
  tabular = false,
  kpi = false,
  prefix = "",
  suffix = "",
  fractionDigits = 0,
  locale: propLocale,
  className = "",
}: NumProps) {
  let contextLocale = "vi";
  try {
    const i18n = useI18n();
    if (i18n?.locale) contextLocale = i18n.locale;
  } catch {
    // Context fallback for standalone testing or outside provider
  }
  const activeLocale = propLocale || contextLocale;

  let displayValue: string = String(value);

  if (typeof value === "number") {
    if (format === "percent") {
      displayValue = formatPercent(value, activeLocale);
    } else if (format === "compact") {
      displayValue = formatCompact(value, {
        locale: activeLocale,
        isCurrency: false,
      });
    } else if (format === "number") {
      displayValue = formatNumber(value, activeLocale, {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
      });
    }
  }

  const baseClass = tabular ? "num-tabular" : "num";
  const kpiClass = kpi ? "text-3xl sm:text-4xl font-semibold tracking-[-0.02em]" : "";

  return (
    <span
      data-num="true"
      className={`${baseClass} whitespace-nowrap select-text ${kpiClass} ${className}`}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
export default Num;

