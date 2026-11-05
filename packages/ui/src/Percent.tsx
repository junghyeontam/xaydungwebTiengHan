"use client";

import React from "react";
import { formatPercent } from "@junghyeon/features";
import { useI18n } from "@junghyeon/i18n";

export interface PercentProps {
  /** Numerical percentage value (e.g. 0.784 or 78.4) */
  value: number;
  /** Whether the input value is a decimal ratio (0..1) or already 0..100 */
  isDecimal?: boolean;
  /** Whether digits should align tabularly */
  tabular?: boolean;
  /** Custom locale override */
  locale?: string;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Single source of truth for percentage representations.
 * - Proportional lining figures by default.
 * - Max 1 decimal place without trailing zero (e.g. 78,4% or 78%).
 * - Never monospace; never breaks lines.
 */
export function Percent({
  value,
  isDecimal,
  tabular = false,
  locale: propLocale,
  className = "",
}: PercentProps) {
  let contextLocale = "vi";
  try {
    const i18n = useI18n();
    if (i18n?.locale) contextLocale = i18n.locale;
  } catch {
    // Context fallback
  }
  const activeLocale = propLocale || contextLocale;
  const formatted = formatPercent(value, activeLocale, { isDecimal });

  return (
    <span
      data-num="true"
      className={`${tabular ? "num-tabular" : "num"} whitespace-nowrap select-text ${className}`}
    >
      {formatted}
    </span>
  );
}
export default Percent;

