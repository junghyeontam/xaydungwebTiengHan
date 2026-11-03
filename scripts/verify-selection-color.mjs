import { chromium } from "playwright";

async function verifySelectionColor() {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/roadmap...");
  await page.goto("http://localhost:3000/roadmap", { waitUntil: "networkidle" });

  // Select the subtitle paragraph
  const subtitle = page.locator('text=Từng chặng đường rõ ràng từ con số 0 đến TOPIK 6. Học xong bài nào, nắm chắc bài đó!');
  await subtitle.waitFor({ state: "visible", timeout: 5000 });

  // Select text using mouse or evaluate
  await page.evaluate(() => {
    const el = document.evaluate(
      "//*[contains(text(), 'Từng chặng đường rõ ràng')]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (el) {
      const range = document.createRange();
      const textNode = el.childNodes[0] || el;
      range.setStart(textNode, 16); // "rõ ràng..."
      range.setEnd(textNode, 70);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  await page.waitForTimeout(500);

  // Take screenshot of the header area
  const header = page.locator('div:has-text("Bản đồ chinh phục tiếng Hàn")').first();
  const artifactPath = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/text-selection-blue-verified.png";
  await page.screenshot({ path: artifactPath, clip: { x: 0, y: 0, width: 1200, height: 350 } });

  console.log("Screenshot saved to:", artifactPath);
  await browser.close();
}

verifySelectionColor().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
