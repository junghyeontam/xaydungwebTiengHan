import { chromium } from "playwright";
import path from "path";

const ARTIFACT_DIR = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/profile-settings";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem(
      "junghyeon_current_user",
      JSON.stringify({
        id: "usr-google-demo-01",
        email: "google.user@junghyeon.vn",
        fullName: "Học viên Google",
        role: "student",
        isVip: false,
        totalXp: 485,
        streakDays: 7,
      })
    );
  });

  await page.goto("http://localhost:3000/profile/settings/personal", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Click camera button to open Avatar Modal
  const cameraBtn = page.locator('button[title="Đổi ảnh đại diện"]');
  if (await cameraBtn.isVisible()) {
    await cameraBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "05a-avatar-modal.png"),
      fullPage: false,
    });
    console.log("Captured 05a-avatar-modal.png");

    // Click "Chọn linh vật Honey"
    const mascotBtn = page.locator('button:has-text("Chọn linh vật Honey")');
    if (await mascotBtn.isVisible()) {
      await mascotBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, "05b-mascot-gallery-modal.png"),
        fullPage: false,
      });
      console.log("Captured 05b-mascot-gallery-modal.png");
    }
  }

  await browser.close();
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
