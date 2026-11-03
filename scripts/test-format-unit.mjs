import assert from "assert";
import {
  formatNumber,
  formatCompact,
  formatCurrencyVND,
  formatPercent,
  formatDelta,
  formatPhoneVN,
  formatDate,
  formatTime,
  formatDuration,
} from "../src/lib/format.ts";

console.log("=== Running Unit Tests for format.ts ===");

// 1. formatNumber
assert.strictEqual(formatNumber(14250, "vi"), "14.250", "formatNumber 14250 vi should be 14.250");
assert.strictEqual(formatNumber(14250, "en"), "14,250", "formatNumber 14250 en should be 14,250");
assert.strictEqual(formatNumber(0, "vi"), "0", "formatNumber 0 vi should be 0");
console.log("✓ formatNumber passed");

// 2. formatCompact
assert.strictEqual(formatCompact(48500000, { locale: "vi", isCurrency: true }), "48,5 triệu", "formatCompact revenue vi should be 48,5 triệu");
assert.strictEqual(formatCompact(48500000, { locale: "en", isCurrency: true }), "48.5M", "formatCompact revenue en should be 48.5M");
// Counts: 1900 under 100k defaults to full 1.900, never '1,9 N'
assert.strictEqual(formatCompact(1900, { locale: "vi" }), "1.900", "formatCompact 1900 count vi should be 1.900");
assert.strictEqual(formatCompact(1900, { locale: "vi", forceCompact: true }), "1,9 nghìn", "formatCompact 1900 forced vi should be 1,9 nghìn");
assert.ok(!formatCompact(1900, { locale: "vi", forceCompact: true }).includes("N"), "Must never contain 'N'");
console.log("✓ formatCompact passed");

// 3. formatCurrencyVND
assert.strictEqual(formatCurrencyVND(1490000, "vi"), "1.490.000\u00A0₫", "formatCurrencyVND vi should be 1.490.000 ₫");
assert.strictEqual(formatCurrencyVND(1490000, "en"), "1,490,000 VND", "formatCurrencyVND en should be 1,490,000 VND");
assert.strictEqual(formatCurrencyVND(0, "vi"), "0\u00A0₫", "formatCurrencyVND 0 vi should be 0 ₫");
assert.strictEqual(formatCurrencyVND(48500000, { locale: "vi", compact: true }), "48,5 tr\u00A0₫", "formatCurrencyVND compact vi should be 48,5 tr ₫");
assert.strictEqual(formatCurrencyVND(48500000, { locale: "en", compact: true }), "48.5M VND", "formatCurrencyVND compact en should be 48.5M VND");
console.log("✓ formatCurrencyVND passed");

// 4. formatPercent
assert.strictEqual(formatPercent(0.784, "vi"), "78,4%", "formatPercent 0.784 vi should be 78,4%");
assert.strictEqual(formatPercent(0.784, "en"), "78.4%", "formatPercent 0.784 en should be 78.4%");
assert.strictEqual(formatPercent(0.78, "vi"), "78%", "formatPercent 0.78 vi should be 78% (no trailing ,0)");
console.log("✓ formatPercent passed");

// 5. formatDelta
const deltaPosVi = formatDelta(0.128, "vi");
assert.strictEqual(deltaPosVi.formatted, "+12,8%", "formatDelta +0.128 vi should be +12,8%");
assert.strictEqual(deltaPosVi.isPositive, true);
const deltaNegVi = formatDelta(-0.052, "vi");
assert.strictEqual(deltaNegVi.formatted, "-5,2%", "formatDelta -0.052 vi should be -5,2%");
assert.strictEqual(deltaNegVi.isPositive, false);
console.log("✓ formatDelta passed");

// 6. formatPhoneVN
assert.strictEqual(formatPhoneVN("0988112233"), "0988 112 233", "formatPhoneVN raw 10 digits");
assert.strictEqual(formatPhoneVN("+84988112233"), "0988 112 233", "formatPhoneVN +84 digits");
assert.strictEqual(formatPhoneVN("0988 112 233"), "0988 112 233", "formatPhoneVN already spaced");
console.log("✓ formatPhoneVN passed");

// 7. formatDate & formatTime
const testDate = new Date("2026-11-02T15:13:00Z");
assert.strictEqual(formatDate(testDate, "vi"), "02/11/2026", "formatDate vi should be 02/11/2026");
assert.strictEqual(formatDate(testDate, "en"), "11/02/2026", "formatDate en should be 11/02/2026");
console.log("✓ formatDate passed");

console.log("\nALL 7 UNIT TESTS PASSED SUCCESSFULLY! ✓");
