import { chromium } from "playwright";
import path from "path";

async function verifyLanguageToggle() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  const toggleBtn = page.locator('button[aria-label="Toggle language (VI / EN)"]');
  await toggleBtn.waitFor({ state: "visible", timeout: 5000 });

  const initialText = (await toggleBtn.textContent())?.trim();
  console.log(`Initial language button text: "${initialText}"`);

  // Click to toggle
  await toggleBtn.click();
  await page.waitForTimeout(300);

  const toggledText = (await toggleBtn.textContent())?.trim();
  console.log(`After click language button text: "${toggledText}"`);

  // Verify switch happened
  if (initialText !== toggledText) {
    console.log(`✓ Language toggled successfully: ${initialText} -> ${toggledText}`);
  } else {
    console.error(`✗ Language toggle did not change text: ${initialText}`);
    process.exit(1);
  }

  // Switch back
  await toggleBtn.click();
  await page.waitForTimeout(300);
  const revertedText = (await toggleBtn.textContent())?.trim();
  console.log(`Reverted language button text: "${revertedText}"`);

  const screenshotPath = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/header-language-switcher.png";
  await page.screenshot({ path: screenshotPath, clip: { x: 0, y: 0, width: 1280, height: 100 } });
  console.log(`Screenshot saved to ${screenshotPath}`);

  await browser.close();
}

verifyLanguageToggle().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
