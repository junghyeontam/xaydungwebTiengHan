const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/separated-tabs');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 850 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/roadmap ...');
  await page.goto('http://localhost:3000/roadmap', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Tab "Ngữ pháp theo lộ trình" (Default active)
  console.log('Taking screenshot of Tab "Ngữ pháp theo lộ trình" (Grammar ONLY)...');
  await page.screenshot({ path: path.join(OUT_DIR, '01-grammar-tab-only.png'), fullPage: true });

  // 2. Click Tab "Từ vựng cấp TOPIK"
  console.log('Clicking "Từ vựng cấp TOPIK" tab...');
  await page.locator('button:has-text("Từ vựng cấp TOPIK")').click();
  await page.waitForTimeout(1000);
  console.log('Taking screenshot of Tab "Từ vựng cấp TOPIK" (TOPIK Vocab ONLY)...');
  await page.screenshot({ path: path.join(OUT_DIR, '02-vocab-topik-tab-only.png'), fullPage: true });

  // 3. Click Tab "Từ vựng theo chủ đề"
  console.log('Clicking "Từ vựng theo chủ đề" tab...');
  await page.locator('button:has-text("Từ vựng theo chủ đề")').click();
  await page.waitForTimeout(1000);
  console.log('Taking screenshot of Tab "Từ vựng theo chủ đề" (Topic Vocab ONLY)...');
  await page.screenshot({ path: path.join(OUT_DIR, '03-vocab-topic-tab-only.png'), fullPage: true });

  await browser.close();
  console.log('Separation test completed successfully!');
}

run().catch(console.error);
