import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const SNAPSHOTS_DIR = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/refurbished-snapshots";
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

const PAGES_TO_CAPTURE = [
  { name: "home-desktop", url: "http://localhost:3000/", width: 1280, height: 900 },
  { name: "home-mobile", url: "http://localhost:3000/", width: 375, height: 812 },
  { name: "admin-dashboard", url: "http://localhost:3000/vi/admin", width: 1280, height: 900 },
  { name: "learner-pricing", url: "http://localhost:3000/products", width: 1280, height: 900 },
  { name: "design-system", url: "http://localhost:3000/vi/admin/design", width: 1280, height: 900 },
];

async function run() {
  console.log("=== Capturing Refurbished Visual Snapshots ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  for (const item of PAGES_TO_CAPTURE) {
    const context = await browser.newContext({
      viewport: { width: item.width, height: item.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    try {
      await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(1500); // Wait for animations & fonts to settle
    } catch (e) {
      console.warn(`Timeout loading ${item.url}, taking screenshot anyway...`);
    }

    // Check for computed black borders
    const blackBorders = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("*"));
      const violations = [];
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const bw = parseFloat(style.borderWidth || "0");
        if (bw > 0) {
          const bc = style.borderColor;
          // Check for pure black: rgb(0, 0, 0)
          if (bc === "rgb(0, 0, 0)" && !el.classList.contains("border-transparent")) {
            violations.push({
              tag: el.tagName,
              className: el.className,
              border: `${bw}px ${bc}`,
            });
          }
        }
      }
      return violations;
    });

    console.log(`[${item.name}] Found ${blackBorders.length} black border violations.`);
    if (blackBorders.length > 0) {
      console.log("Sample violations:", blackBorders.slice(0, 3));
    }

    const outPath = path.join(SNAPSHOTS_DIR, `${item.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${outPath}`);

    await context.close();
  }

  await browser.close();
  console.log("=== Finished capturing snapshots ===");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
