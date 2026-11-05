"use client";

import React from "react";
import { formatCurrencyVND, calculateSavingsPercent } from "@junghyeon/features";
import { useI18n } from "@junghyeon/i18n";

export interface PriceProps {
  /** Numerical amount in VND */
  amount: number;
  /** Currency code (defaults to "VND") */
  currency?: "VND" | string;
  /** Size token */
  size?: "kpi" | "xl" | "lg" | "md" | "sm";
  /** Compact style for large sums (e.g. 48.500.000 -> 48,5 tr â‚«) */
  compact?: boolean;
  /** Original price before discount for strikethrough comparison */
  originalAmount?: number;
  /** Convenience alias for original price or boolean to strikethrough current price */
  strikethrough?: boolean | number;
  /** Billing period label, e.g. "/ mÃ£i mÃ£i", "/ thÃ¡ng" */
  period?: string;
  /** Custom savings badge label, defaults to "Tiáº¿t kiá»‡m" (or "Save" in EN) */
  savingsLabel?: string;
  /** Language locale ("vi" | "en") */
  locale?: "vi" | "en" | string;
  /** Overall wrapper class */
  className?: string;
  /** Text color variant */
  color?: "default" | "dark" | "teal" | "coral" | "white";
}

/**
 * Single source of truth for price displays across the learner & admin apps.
 * - Always renders in primary UI font with proportional lining figures (never monospace).
 * - Non-breaking space between amount and symbol.
 * - Proportional currency symbol sizing and baseline alignment (55% size, muted color).
 * - Automatic savings % pill computation.
 * - Never breaks across lines (white-space: nowrap).
 */
export function Price({
  amount,
  currency = "VND",
  size = "md",
  compact = false,
  originalAmount: propOriginalAmount,
  strikethrough,
  period,
  savingsLabel,
  locale: propLocale,
  className = "",
  color = "default",
}: PriceProps) {
  let contextLocale = "vi";
  try {
    const i18n = useI18n();
    if (i18n?.locale) contextLocale = i18n.locale;
  } catch {
    // Fallback for standalone/test environments
  }
  const activeLocale = (propLocale || contextLocale) === "en" ? "en" : "vi";

  // Determine if strikethrough original amount was passed
  const originalPrice =
    typeof strikethrough === "number"
      ? strikethrough
      : propOriginalAmount;

  const isCurrentPriceStrikethrough = strikethrough === true;

  const savingsPercent = originalPrice
    ? calculateSavingsPercent(originalPrice, amount)
    : 0;

  const defaultSavingsText = activeLocale === "en" ? "Save" : "Tiáº¿t kiá»‡m";
  const savingsText = savingsLabel || defaultSavingsText;

  // Split formatted price into number and symbol for precise layout
  const rawFormatted = formatCurrencyVND(amount, {
    locale: activeLocale,
    compact,
  });

  let numberPart = rawFormatted;
  let symbolPart = "";

  if (activeLocale === "en") {
    // e.g. "1,490,000 VND" or "48.5M VND"
    const parts = rawFormatted.split(" ");
    numberPart = parts[0] || "0";
    symbolPart = parts[1] || "VND";
  } else {
    // e.g. "1.490.000 â‚«" or "48,5 tr â‚«"
    const parts = rawFormatted.split(/\s|\u00A0/);
    if (parts.length >= 2) {
      numberPart = parts.slice(0, parts.length - 1).join("\u00A0");
      symbolPart = parts[parts.length - 1];
    } else {
      numberPart = rawFormatted.replace(/[â‚«Ä‘]/g, "").trim();
      symbolPart = "â‚«";
    }
  }

  // Color styles
  const colorStyles = {
    default: "text-[#12302F] dark:text-[#E9E9E4]",
    dark: "text-admin-text-primary dark:text-white",
    teal: "text-junghyeon-teal dark:text-teal-400",
    coral: "text-junghyeon-coral",
    white: "text-white",
  }[color];

  // Size styling tokens
  const sizeStyles = {
    kpi: {
      number: "text-3xl sm:text-4xl font-semibold tracking-[-0.02em] leading-none",
      symbol: "text-[55%] text-muted-foreground dark:text-admin-text-muted align-baseline ml-1 font-normal",
      period: "text-xs font-normal text-muted-foreground ml-1.5 align-baseline",
      original: "text-sm text-[#8E9796] line-through decoration-[1.5px] font-normal",
      badge: "px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    xl: {
      number: "text-3xl sm:text-[44px] font-semibold tracking-[-0.02em] leading-none",
      symbol: "text-[55%] text-muted-foreground align-baseline ml-1 font-normal",
      period: "text-sm font-normal text-muted-foreground ml-2 align-baseline",
      original: "text-base text-[#8E9796] line-through decoration-[1.5px] font-normal",
      badge: "px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    lg: {
      number: "text-2xl sm:text-[30px] font-semibold tracking-[-0.015em] leading-none",
      symbol: "text-[55%] text-muted-foreground align-baseline ml-1 font-normal",
      period: "text-xs font-normal text-muted-foreground ml-1.5 align-baseline",
      original: "text-sm text-[#8E9796] line-through decoration-[1.5px] font-normal",
      badge: "px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    md: {
      number: "text-lg sm:text-[22px] font-semibold tracking-tight leading-tight",
      symbol: "text-[60%] text-muted-foreground align-baseline ml-1 font-normal",
      period: "text-xs font-normal text-muted-foreground ml-1.5 align-baseline",
      original: "text-xs text-[#8E9796] line-through decoration-[1.2px] font-normal",
      badge: "px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    sm: {
      number: "text-sm sm:text-base font-semibold leading-normal",
      symbol: "text-[65%] text-muted-foreground align-baseline ml-0.5 font-normal",
      period: "text-[11px] font-normal text-muted-foreground ml-1 align-baseline",
      original: "text-[11px] text-[#8E9796] line-through decoration-[1px] font-normal",
      badge: "px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
  }[size];

  return (
    <div
      data-num="true"
      className={`inline-flex flex-col whitespace-nowrap select-text ${className}`}
    >
      {/* Strikethrough original price & savings pill */}
      {originalPrice && originalPrice > amount && (
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`num ${sizeStyles.original}`}>
            {formatCurrencyVND(originalPrice, activeLocale)}
          </span>
          {savingsPercent > 0 && (
            <span className={sizeStyles.badge}>
              {savingsText} {savingsPercent}%
            </span>
          )}
        </div>
      )}

      {/* Main active price */}
      <div className="flex items-baseline whitespace-nowrap">
        <span
          className={`num ${sizeStyles.number} ${colorStyles} ${
            isCurrentPriceStrikethrough ? "line-through text-[#8E9796] decoration-[1.5px]" : ""
          }`}
        >
          {numberPart}
        </span>

        {symbolPart && (
          <span className={`num ${sizeStyles.symbol}`}>
            {symbolPart}
          </span>
        )}

        {period && (
          <span className={sizeStyles.period}>
            {period}
          </span>
        )}
      </div>
    </div>
  );
}
export default Price;

