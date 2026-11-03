import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/scroll-reveal";
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/ ...");
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Initial Hero view
  await page.screenshot({ path: path.join(outDir, "01-hero-section.png") });
  console.log("Saved 01-hero-section.png");

  // 2. Scroll to StatBand & ContinueLearning
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "02-statband-continue.png") });
  console.log("Saved 02-statband-continue.png");

  // 3. Scroll to Exclusive Features section (the section from user's screenshot)
  const featuresSection = page.locator("#features-section");
  await featuresSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "03-exclusive-features-section.png") });
  console.log("Saved 03-exclusive-features-section.png");

  // 4. Test clicking on other tabs in Features section
  const writingTab = page.locator("button:has-text('Chữa bài viết TOPIK')");
  if (await writingTab.count() > 0) {
    await writingTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, "04-features-writing-tab.png") });
    console.log("Saved 04-features-writing-tab.png");
  }

  // 5. Scroll to Roadmap Summary
  await page.evaluate(() => window.scrollBy({ top: 700, behavior: "smooth" }));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, "05-roadmap-summary.png") });
  console.log("Saved 05-roadmap-summary.png");

  // 6. Scroll to Pricing & FAQ
  const pricingSection = page.locator("#pricing-section");
  if (await pricingSection.count() > 0) {
    await pricingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outDir, "06-pricing-section.png") });
    console.log("Saved 06-pricing-section.png");
  }

  await browser.close();
  console.log("Done testing homepage scroll reveal!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
