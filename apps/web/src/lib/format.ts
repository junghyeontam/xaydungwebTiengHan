/**
 * ==============================================================================
 * JungHyeon Single Formatting Layer (src/lib/format.ts)
 * Unified numeral and currency formatting across Learner and Admin portals.
 *
 * Rules:
 * - Uses Intl with the active locale ("vi" or "en").
 * - Lining figures, plain zero (no slash, no dot).
 * - Non-breaking space (\u00A0) between numbers and currency symbols in Vietnamese ("₫").
 * - vi "1,9 N" is strictly forbidden -> outputs "1,9 nghìn" or full "1.900".
 * ==============================================================================
 */

export type Locale = "vi" | "en";

/**
 * Normalizes locale to "vi" or "en".
 */
export function normalizeLocale(locale?: string): Locale {
  if (!locale) return "vi";
  return locale.toLowerCase().startsWith("en") ? "en" : "vi";
}

/**
 * Format numbers with proportional/lining figures.
 *
 * Examples:
 * - formatNumber(14250, "vi") -> "14.250"
 * - formatNumber(14250, "en") -> "14,250"
 * - formatNumber(0, "vi") -> "0"
 */
export function formatNumber(
  value: number,
  localeInput?: string,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const loc = normalizeLocale(localeInput);

  return new Intl.NumberFormat(loc === "en" ? "en-US" : "vi-VN", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(safeValue);
}

/**
 * Format compact numbers for revenue or large counts.
 * - Revenue: 48500000 -> vi "48,5 triệu", en "48.5M"
 * - Counts: Default to full number when under 100,000 (e.g. 1900 -> "1.900").
 *   When compact is forced or >= 100,000: vi "1,9 nghìn" (never "1,9 N"), en "1.9k".
 */
export function formatCompact(
  value: number,
  options?: {
    locale?: string;
    isCurrency?: boolean;
    forceCompact?: boolean;
  }
): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const loc = normalizeLocale(options?.locale);
  const isCurrency = options?.isCurrency ?? false;
  const forceCompact = options?.forceCompact ?? false;

  const abs = Math.abs(safeValue);

  // For non-currency counts under 100,000, default to the full number unless forceCompact is requested
  if (!isCurrency && !forceCompact && abs < 100000) {
    return formatNumber(safeValue, loc);
  }

  // Format 1 decimal place without trailing zero (e.g. 48.5 -> "48,5", 48.0 -> "48")
  const formatDecimal = (num: number): string => {
    const fixed = Math.round(num * 10) / 10;
    const str = fixed.toFixed(1).replace(/\.0$/, "");
    return loc === "vi" ? str.replace(".", ",") : str;
  };

  if (loc === "vi") {
    if (abs >= 1e9) {
      return `${formatDecimal(safeValue / 1e9)} tỷ`;
    }
    if (abs >= 1e6) {
      return `${formatDecimal(safeValue / 1e6)} triệu`;
    }
    if (abs >= 1e3) {
      return `${formatDecimal(safeValue / 1e3)} nghìn`;
    }
    return formatNumber(safeValue, "vi");
  }

  // English compact format
  if (abs >= 1e9) {
    return `${formatDecimal(safeValue / 1e9)}B`;
  }
  if (abs >= 1e6) {
    return `${formatDecimal(safeValue / 1e6)}M`;
  }
  if (abs >= 1e3) {
    return `${formatDecimal(safeValue / 1e3)}k`;
  }
  return formatNumber(safeValue, "en");
}

/**
 * Format currency in VND with full or compact style.
 *
 * Examples:
 * - formatCurrencyVND(1490000, "vi") -> "1.490.000 ₫"
 * - formatCurrencyVND(1490000, "en") -> "1,490,000 VND"
 * - formatCurrencyVND(48500000, { locale: "vi", compact: true }) -> "48,5 tr ₫"
 * - formatCurrencyVND(48500000, { locale: "en", compact: true }) -> "48.5M VND"
 * - formatCurrencyVND(0, "vi") -> "0 ₫"
 */
export function formatCurrencyVND(
  amount: number,
  optionsOrLocale?: { locale?: string; compact?: boolean } | string
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  let loc: Locale = "vi";
  let compact = false;

  if (typeof optionsOrLocale === "string") {
    loc = normalizeLocale(optionsOrLocale);
  } else if (optionsOrLocale && typeof optionsOrLocale === "object") {
    loc = normalizeLocale(optionsOrLocale.locale);
    compact = Boolean(optionsOrLocale.compact);
  }

  if (compact) {
    const abs = Math.abs(safeAmount);
    const formatDecimal = (num: number): string => {
      const fixed = Math.round(num * 10) / 10;
      const str = fixed.toFixed(1).replace(/\.0$/, "");
      return loc === "vi" ? str.replace(".", ",") : str;
    };

    if (loc === "vi") {
      if (abs >= 1e9) {
        return `${formatDecimal(safeAmount / 1e9)} tỷ\u00A0₫`;
      }
      if (abs >= 1e6) {
        return `${formatDecimal(safeAmount / 1e6)} tr\u00A0₫`;
      }
      return `${formatNumber(safeAmount, "vi")}\u00A0₫`;
    } else {
      if (abs >= 1e9) {
        return `${formatDecimal(safeAmount / 1e9)}B VND`;
      }
      if (abs >= 1e6) {
        return `${formatDecimal(safeAmount / 1e6)}M VND`;
      }
      return `${formatNumber(safeAmount, "en")} VND`;
    }
  }

  if (loc === "en") {
    return `${formatNumber(safeAmount, "en")} VND`;
  }

  return `${formatNumber(safeAmount, "vi")}\u00A0₫`;
}

/**
 * Format percentages with max 1 decimal and no trailing ,0.
 *
 * Examples:
 * - formatPercent(0.784, "vi") -> "78,4%"
 * - formatPercent(0.784, "en") -> "78.4%"
 * - formatPercent(0.78, "vi") -> "78%"
 * - formatPercent(78.4, "vi", { isDecimal: false }) -> "78,4%"
 */
export function formatPercent(
  value: number,
  localeInput?: string,
  options?: {
    isDecimal?: boolean;
  }
): string {
  if (!Number.isFinite(value)) return "0%";
  const loc = normalizeLocale(localeInput);

  // If isDecimal is not specified, auto-detect (<= 1 is decimal)
  const isDecimal = options?.isDecimal ?? (Math.abs(value) <= 1 && value !== 0);
  const percentValue = isDecimal ? value * 100 : value;

  const fixed = Math.round(percentValue * 10) / 10;
  const str = fixed.toFixed(1).replace(/\.0$/, "");
  const formatted = loc === "vi" ? str.replace(".", ",") : str;

  return `${formatted}%`;
}

/**
 * Format delta changes with + / - indicator.
 *
 * Examples:
 * - formatDelta(0.128, "vi") -> { formatted: "+12,8%", isPositive: true, raw: 12.8 }
 * - formatDelta(-5.2, "vi", { isDecimal: false }) -> { formatted: "-5,2%", isPositive: false, raw: -5.2 }
 */
export function formatDelta(
  delta: number,
  localeInput?: string,
  options?: {
    isDecimal?: boolean;
  }
): { formatted: string; isPositive: boolean; raw: number } {
  if (!Number.isFinite(delta)) {
    return { formatted: "0%", isPositive: true, raw: 0 };
  }

  const isDecimal = options?.isDecimal ?? (Math.abs(delta) <= 1 && delta !== 0);
  const percentValue = isDecimal ? delta * 100 : delta;
  const isPositive = percentValue >= 0;

  const percentStr = formatPercent(percentValue, localeInput, { isDecimal: false });
  const formatted = isPositive ? `+${percentStr}` : percentStr;

  return { formatted, isPositive, raw: percentValue };
}

/**
 * Format Vietnamese phone numbers cleanly in 4-3-3 sans format.
 * Never monospace.
 *
 * Examples:
 * - formatPhoneVN("0988112233") -> "0988 112 233"
 * - formatPhoneVN("+84988112233") -> "0988 112 233"
 * - formatPhoneVN("0903778899") -> "0903 778 899"
 */
export function formatPhoneVN(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^\d+]/g, "");
  let digits = cleaned;

  if (digits.startsWith("+84")) {
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("84") && digits.length >= 11) {
    digits = "0" + digits.slice(2);
  }

  const pureDigits = digits.replace(/\D/g, "");

  if (pureDigits.length === 10) {
    // Standard Vietnamese mobile 10-digit: 0xxx xxx xxx (4-3-3)
    return `${pureDigits.slice(0, 4)} ${pureDigits.slice(4, 7)} ${pureDigits.slice(7)}`;
  }

  if (pureDigits.length === 11) {
    // 11 digits: 0xxx xxx xxxx
    return `${pureDigits.slice(0, 4)} ${pureDigits.slice(4, 7)} ${pureDigits.slice(7)}`;
  }

  return phone.trim();
}

/**
 * Format localized dates.
 * - vi: "02/11/2026"
 * - en: "11/02/2026"
 */
export function formatDate(
  dateInput: string | number | Date,
  localeInput?: string
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const loc = normalizeLocale(localeInput);

  if (loc === "en") {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Format localized 24h time: "15:13".
 */
export function formatTime(dateInput: string | number | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Format relative duration / timestamp.
 * - vi: "15 phút trước", "2 giờ trước", "vừa xong"
 * - en: "15 minutes ago", "2 hours ago", "just now"
 */
export function formatDuration(
  dateInput: string | number | Date,
  localeInput?: string
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }

  const loc = normalizeLocale(localeInput);
  const now = Date.now();
  const diffSec = Math.floor((now - date.getTime()) / 1000);

  if (diffSec < 45) {
    return loc === "vi" ? "vừa xong" : "just now";
  }

  const rtf = new Intl.RelativeTimeFormat(loc === "en" ? "en-US" : "vi-VN", {
    numeric: "always",
  });

  if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return rtf.format(-mins, "minute");
  }

  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return rtf.format(-hours, "hour");
  }

  const days = Math.floor(diffSec / 86400);
  if (days < 30) {
    return rtf.format(-days, "day");
  }

  return formatDate(date, loc);
}

/**
 * Calculate savings percentage between original and sale prices.
 * e.g., (3500000, 1490000) -> 57
 */
export function calculateSavingsPercent(original: number, current: number): number {
  if (!original || original <= 0 || current >= original) {
    return 0;
  }
  return Math.round(((original - current) / original) * 100);
}
