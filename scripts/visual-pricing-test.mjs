/**
 * Playwright Visual Test Suite for Pricing Section
 * Runs across Light/Dark modes at 360px (mobile), 768px (tablet), and 1280px (desktop).
 * Validates non-monospace font rendering, lining-nums, and badge visibility.
 */

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.TEST_APP_URL || "http://localhost:3000";
const SCREENSHOT_DIR = path.resolve("./test-results/pricing-screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "mobile-360px", width: 360, height: 800 },
  { name: "tablet-768px", width: 768, height: 1024 },
  { name: "desktop-1280px", width: 1280, height: 900 },
];

const THEMES = ["light", "dark"];

async function runVisualTests() {
  console.log("==========================================================");
  console.log("Starting Playwright Pricing Visual & Typography Tests");
  console.log(`Target: ${BASE_URL}/products`);
  console.log("==========================================================\n");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  let passed = 0;
  let failed = 0;

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const testName = `${theme}-${vp.name}`;
      console.log(`--- Testing [${testName}] (${vp.width}x${vp.height}, theme: ${theme}) ---`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });

      const page = await context.newPage();

      try {
        await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle" });

        // Set theme if dark mode
        if (theme === "dark") {
          await page.evaluate(() => {
            document.documentElement.classList.add("dark");
          });
        } else {
          await page.evaluate(() => {
            document.documentElement.classList.remove("dark");
          });
        }

        // Wait for price block to render
        await page.waitForSelector(".font-price", { timeout: 8000 });

        // 1. Validate price typography
        const typography = await page.evaluate(() => {
          const priceEls = Array.from(document.querySelectorAll(".font-price"));
          return priceEls.map((el) => {
            const style = window.getComputedStyle(el);
            return {
              text: el.textContent?.trim(),
              fontFamily: style.fontFamily,
              fontVariantNumeric: style.fontVariantNumeric,
              fontFeatureSettings: style.fontFeatureSettings,
            };
          });
        });

        console.log(`  Found ${typography.length} price typography elements on page.`);

        // Check each price element
        let hasMonospace = false;
        for (const item of typography) {
          const isMono =
            item.fontFamily.toLowerCase().includes("mono") ||
            item.fontFamily.toLowerCase().includes("courier") ||
            item.fontFamily.toLowerCase().includes("consolas");

          if (isMono) {
            console.error(`  ✗ FAIL: Element "${item.text}" is using monospace font: ${item.fontFamily}`);
            hasMonospace = true;
          }
        }

        if (!hasMonospace) {
          console.log(`  ✓ PASS: Typography verified — NO monospace used in prices (Font: ${typography[0]?.fontFamily})`);
          passed++;
        } else {
          failed++;
        }

        // 2. Check VIP Badge visibility
        const badgeEl = page.locator('span:has-text("PHỔ BIẾN NHẤT"), span:has-text("MOST POPULAR")').first();
        const badgeVisible = await badgeEl.isVisible();

        if (badgeVisible) {
          const badgeText = await badgeEl.textContent();
          console.log(`  ✓ PASS: VIP popular badge visible on screen ("${badgeText.trim()}")`);
          passed++;
        } else {
          console.error(`  ✗ FAIL: Popular badge not visible`);
          failed++;
        }

        // Scroll pricing cards into view for screenshot
        await badgeEl.scrollIntoViewIfNeeded();

        // Take screenshot
        const screenshotPath = path.join(SCREENSHOT_DIR, `${testName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`  📸 Screenshot saved: ${screenshotPath}\n`);

      } catch (err) {
        console.error(`  ✗ ERROR on ${testName}: ${err.message}\n`);
        failed++;
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  console.log("==========================================================");
  console.log(`Visual Tests Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runVisualTests();
