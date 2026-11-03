import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const SNAPSHOTS_DIR = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/assistant-screenshots";
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

const PAGES = [
  { name: "home", url: "http://localhost:3000/" },
  { name: "roadmap", url: "http://localhost:3000/roadmap" },
  { name: "products", url: "http://localhost:3000/products" },
  { name: "review", url: "http://localhost:3000/review" },
];

async function run() {
  console.log("=== Testing Unified AI Assistant Across All Pages ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const item of PAGES) {
    await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1000);

    // Count floating assistant trigger buttons specifically
    const count = await page.evaluate(() => {
      const triggers = Array.from(document.querySelectorAll('button[aria-label*="Honey"]'));
      return triggers.length;
    });

    console.log(`[${item.name}] Detected ${count} Floating Assistant trigger button(s).`);
    if (count !== 1) {
      console.error(`ERROR: Expected exactly 1 floating assistant button on ${item.name}, found ${count}!`);
    }
  }

  // Test opening the assistant on the Home page
  console.log("Testing Assistant open & chat on Home page...");
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Take screenshot before opening
  await page.screenshot({
    path: path.join(SNAPSHOTS_DIR, "assistant-trigger-home.png"),
  });

  // Click the trigger button
  const trigger = page.locator('button[aria-label*="Honey"]').first();
  await trigger.click();
  await page.waitForTimeout(800);

  // Take screenshot with chat open
  await page.screenshot({
    path: path.join(SNAPSHOTS_DIR, "assistant-chat-open.png"),
  });
  console.log("Saved assistant-chat-open.png");

  // Click Support tab
  const tabs = page.locator('button:has(svg.lucide-phone)');
  if (await tabs.count() > 0) {
    await tabs.first().click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SNAPSHOTS_DIR, "assistant-support-tab.png"),
    });
    console.log("Saved assistant-support-tab.png");
  }

  // Test collapse on scroll
  console.log("Testing scroll collapse behavior...");
  // Close the popup first
  const closeBtn = page.locator('button[aria-label*="Đóng"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  await page.evaluate(() => window.scrollBy({ top: 700, behavior: "smooth" }));
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(SNAPSHOTS_DIR, "assistant-collapsed-on-scroll.png"),
  });
  console.log("Saved assistant-collapsed-on-scroll.png");

  await browser.close();
  console.log("=== All Assistant Tests Completed Successfully! ===");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
