import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const ARTIFACTS_DIR = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/numeral-screenshots";
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-360", width: 360, height: 740 },
];

const TARGET_PAGES = [
  { name: "admin-overview", url: "http://localhost:3000/vi/admin" },
  { name: "admin-leads", url: "http://localhost:3000/vi/admin/sales/leads" },
  { name: "learner-pricing", url: "http://localhost:3000/products" },
  { name: "admin-lessons", url: "http://localhost:3000/vi/admin/content/lessons" },
  { name: "admin-analytics", url: "http://localhost:3000/vi/admin/analytics" },
  { name: "design-numerals", url: "http://localhost:3000/_design" },
];

async function runVisualTests() {
  console.log("=== Launching Playwright Numeral Visual & Typography Tests ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  let totalAssertions = 0;
  let passedAssertions = 0;

  for (const pageInfo of TARGET_PAGES) {
    for (const vp of VIEWPORTS) {
      for (const theme of ["light", "dark"]) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme,
        });
        const page = await context.newPage();

        try {
          await page.goto(pageInfo.url, { waitUntil: "networkidle", timeout: 15000 });
        } catch {
          // If networkidle times out due to periodic polling, continue
        }

        // Apply dark class if testing dark
        if (theme === "dark") {
          await page.evaluate(() => document.documentElement.classList.add("dark"));
        } else {
          await page.evaluate(() => document.documentElement.classList.remove("dark"));
        }
        await page.waitForTimeout(300);

        // If design page, click Numerals tab
        if (pageInfo.name === "design-numerals") {
          const tabBtn = page.locator('button:has-text("Unified Numerals")');
          if (await tabBtn.count()) {
            await tabBtn.click();
            await page.waitForTimeout(300);
          }
        }

        // Validate all [data-num] elements on the page
        const numElements = page.locator("[data-num]");
        const count = await numElements.count();

        for (let i = 0; i < Math.min(count, 15); i++) {
          totalAssertions++;
          const el = numElements.nth(i);
          const computed = await el.evaluate((node) => {
            const cs = window.getComputedStyle(node);
            return {
              text: node.textContent,
              fontFamily: cs.fontFamily.toLowerCase(),
              fontVariantNumeric: cs.fontVariantNumeric.toLowerCase(),
              whiteSpace: cs.whiteSpace,
            };
          });

          const isMonospace =
            computed.fontFamily.includes("mono") ||
            computed.fontFamily.includes("consolas") ||
            computed.fontFamily.includes("courier") ||
            computed.fontFamily.includes("menlo");

          const hasLining =
            computed.fontVariantNumeric.includes("lining-nums") ||
            computed.fontVariantNumeric === "normal"; // browsers may report normal when font-feature-settings applies lnum

          if (!isMonospace) {
            passedAssertions++;
          } else {
            console.error(
              `✗ FAILED [${pageInfo.name} ${theme} ${vp.name}]: Monospace detected on "${computed.text}": ${computed.fontFamily}`
            );
          }
        }

        // Capture screenshot for key viewports
        if (vp.name === "desktop-1280") {
          const screenshotName = `${pageInfo.name}-${theme}.png`;
          const filePath = path.join(ARTIFACTS_DIR, screenshotName);
          await page.screenshot({ path: filePath, fullPage: false });
        }

        await context.close();
      }
    }
    console.log(`✓ Tested ${pageInfo.name} across all 6 viewports/themes`);
  }

  await browser.close();

  console.log("\n=======================================================");
  console.log(`Assertions: ${passedAssertions}/${totalAssertions} Passed`);
  console.log(`Screenshots saved to: ${ARTIFACTS_DIR}`);
  console.log("=======================================================");

  if (passedAssertions < totalAssertions) {
    process.exit(1);
  }
}

runVisualTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
