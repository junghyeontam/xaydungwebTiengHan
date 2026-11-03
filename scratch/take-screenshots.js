const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve('C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/theory-library');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 850 },
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/roadmap ...');
  await page.goto('http://localhost:3000/roadmap', { waitUntil: 'networkidle' });

  // 1. Click Tab "Từ vựng cấp TOPIK"
  console.log('Clicking "Từ vựng cấp TOPIK" tab...');
  const topikVocabBtn = page.locator('button:has-text("Từ vựng cấp TOPIK")');
  await topikVocabBtn.click();
  await page.waitForTimeout(1000);

  console.log('Taking screenshot of Theory Library (Image 2 match)...');
  await page.screenshot({ path: path.join(OUT_DIR, '01-learner-theory-library.png'), fullPage: true });

  // 2. Click on the card "Từ vựng cấp độ TOPIK 1" to open chapter detail modal
  console.log('Clicking card "Từ vựng cấp độ TOPIK 1"...');
  const card = page.locator('h3:has-text("Từ vựng cấp độ TOPIK 1")').first();
  await card.click();
  await page.waitForTimeout(1000);

  console.log('Taking screenshot of Chapter/Section Detail Modal...');
  await page.screenshot({ path: path.join(OUT_DIR, '02-chapter-detail-modal.png'), fullPage: false });

  // Close modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 3. Navigate to Teacher Studio Vocabulary Bank
  console.log('Navigating to http://localhost:3000/admin/teaching/vocabulary ...');
  await page.goto('http://localhost:3000/admin/teaching/vocabulary', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Taking screenshot of Teacher Studio Vocabulary Bank...');
  await page.screenshot({ path: path.join(OUT_DIR, '03-teacher-studio-vocabulary.png'), fullPage: true });

  // 4. Click "+ Thêm từ vựng mới" in Teacher Studio to show the Add Word Dialog
  console.log('Clicking "+ Thêm từ vựng mới"...');
  const addWordBtn = page.locator('button:has-text("+ Thêm từ vựng mới")').first();
  await addWordBtn.click();
  await page.waitForTimeout(800);

  console.log('Taking screenshot of Add Word Dialog...');
  await page.screenshot({ path: path.join(OUT_DIR, '04-add-word-dialog.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots completed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
