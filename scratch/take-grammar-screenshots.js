const { chromium } = require('playwright');
const path = require('path');

const OUT_DIR = path.resolve('C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/theory-library');

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 850 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/roadmap', { waitUntil: 'networkidle' });

  // Click tab "Ngữ pháp theo lộ trình" and toggle to "Bộ thẻ theo cấp độ"
  const libBtn = page.locator('button:has-text("Bộ thẻ theo cấp độ")');
  if (await libBtn.isVisible()) {
    await libBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: path.join(OUT_DIR, '05-grammar-cards-grid.png'), fullPage: true });

  // Click on "Ngữ pháp cấp độ TOPIK 1" card
  const grammarCard = page.locator('h3:has-text("Ngữ pháp cấp độ TOPIK 1")').first();
  await grammarCard.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(OUT_DIR, '06-grammar-detail-modal.png'), fullPage: false });

  await browser.close();
  console.log('Grammar screenshots taken successfully!');
}

run().catch(console.error);
