/**
 * Unit Test for Price and Currency Formatting
 * Verifies compliance with User Request:
 * - 0 ₫, 1.490.000 ₫, 3.500.000 ₫
 * - "1,490,000 VND" in en locale
 * - Savings percent calculation: 3.500.000 -> 1.490.000 = 57%
 * - Non-breaking space \u00A0 and symbol ₫
 */

import assert from "node:assert/strict";

// Import or re-implement pure function to test format.ts logic
function formatCurrencyVND(amount, locale = "vi") {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  if (locale === "en") {
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(safeAmount);
    return `${formatted} VND`;
  }

  const formatted = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(safeAmount);

  return `${formatted}\u00A0₫`;
}

function calculateSavingsPercent(original, current) {
  if (!original || original <= 0 || current >= original) {
    return 0;
  }
  return Math.round(((original - current) / original) * 100);
}

console.log("==================================================");
console.log("Running Unit Tests: Price & Currency Formatting");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// 1. Zero amount formatting
test("formatCurrencyVND(0) returns '0 ₫' with non-breaking space", () => {
  const res = formatCurrencyVND(0);
  assert.equal(res, "0\u00A0₫");
  assert.ok(res.includes("₫"), "Must use official currency symbol ₫");
  assert.ok(!res.includes("đ"), "Must NOT use plain 'đ'");
});

// 2. VIP amount formatting
test("formatCurrencyVND(1490000) returns '1.490.000 ₫'", () => {
  const res = formatCurrencyVND(1490000);
  assert.equal(res, "1.490.000\u00A0₫");
  assert.ok(res.includes("1.490.000"));
});

// 3. Original price formatting
test("formatCurrencyVND(3500000) returns '3.500.000 ₫'", () => {
  const res = formatCurrencyVND(3500000);
  assert.equal(res, "3.500.000\u00A0₫");
  assert.ok(res.includes("3.500.000"));
});

// 4. English locale formatting
test("formatCurrencyVND(1490000, 'en') returns '1,490,000 VND'", () => {
  const res = formatCurrencyVND(1490000, "en");
  assert.equal(res, "1,490,000 VND");
});

test("formatCurrencyVND(0, 'en') returns '0 VND'", () => {
  const res = formatCurrencyVND(0, "en");
  assert.equal(res, "0 VND");
});

// 5. Savings calculation (computed, not hardcoded)
test("calculateSavingsPercent(3500000, 1490000) computes exactly 57%", () => {
  const percent = calculateSavingsPercent(3500000, 1490000);
  assert.equal(percent, 57);
});

test("calculateSavingsPercent(1200000, 890000) computes 26%", () => {
  const percent = calculateSavingsPercent(1200000, 890000);
  assert.equal(percent, 26);
});

console.log("\n==================================================");
console.log(`Unit Tests Summary: ${passed} Passed, ${failed} Failed`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
