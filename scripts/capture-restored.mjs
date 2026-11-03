import { chromium } from "playwright";
import path from "path";

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(1000);

  const outPath = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/restored-home.png";
  await page.screenshot({ path: outPath, fullPage: false });
  console.log("Screenshot successfully saved to:", outPath);

  await browser.close();
}

run().catch(console.error);
