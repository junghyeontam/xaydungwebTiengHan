const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/grammar-upgrade');
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

  // 1. Click on "Ngữ pháp cấp độ TOPIK 1" card
  console.log('Clicking "Ngữ pháp cấp độ TOPIK 1"...');
  await page.locator('h3:has-text("Ngữ pháp cấp độ TOPIK 1")').first().click();
  await page.waitForTimeout(1000);

  console.log('Capturing Grammar List View (Step 1: List of grammar items)...');
  await page.screenshot({ path: path.join(OUT_DIR, '01-grammar-list-view.png'), fullPage: false });

  // 2. Click on the first grammar item: "Tiểu từ chủ đề: 은 / 는"
  console.log('Clicking on "Tiểu từ chủ đề: 은 / 는"...');
  await page.locator('h4:has-text("1. Tiểu từ chủ đề: 은 / 는")').first().click();
  await page.waitForTimeout(1000);

  console.log('Capturing Grammar Detail View (Step 2: Formula, Usage, Table, Examples)...');
  await page.screenshot({ path: path.join(OUT_DIR, '02-grammar-detail-theory.png'), fullPage: false });

  // 3. Switch to Tab 2: "2. Luyện tập tương tác"
  console.log('Switching to Practice Tab...');
  await page.locator('button:has-text("2. Luyện tập tương tác")').click();
  await page.waitForTimeout(800);

  console.log('Capturing Practice Tab before answering...');
  await page.screenshot({ path: path.join(OUT_DIR, '03-grammar-practice-empty.png'), fullPage: false });

  // 4. Click answers to test interactive feedback!
  console.log('Answering Drill 1 (선생님은)...');
  await page.locator('button:has-text("선생님은")').first().click();
  await page.waitForTimeout(500);

  console.log('Answering Drill 2 (저는)...');
  await page.locator('button:has-text("저는")').first().click();
  await page.waitForTimeout(500);

  console.log('Answering Drill 3 (는)...');
  await page.locator('button:has-text("는")').first().click();
  await page.waitForTimeout(500);

  console.log('Answering Drill 4 (은)...');
  await page.locator('button:has-text("은")').first().click();
  await page.waitForTimeout(1000);

  console.log('Capturing Practice Tab with feedback and completion celebration...');
  await page.screenshot({ path: path.join(OUT_DIR, '04-grammar-practice-completed.png'), fullPage: false });

  await browser.close();
  console.log('All tests completed successfully!');
}

run().catch(console.error);
