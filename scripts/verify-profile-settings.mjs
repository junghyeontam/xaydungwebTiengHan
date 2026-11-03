import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACT_DIR = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/profile-settings";

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Preset user in localStorage so /profile loads as logged-in learner
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

  console.log("Navigating to /profile...");
  await page.goto("http://localhost:3000/profile", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Screenshot of /profile with "Chỉnh sửa thông tin" button visible
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "01-profile-view-with-edit-button.png"),
    fullPage: false,
  });
  console.log("Captured 01-profile-view-with-edit-button.png");

  // 2. Open User Menu Dropdown in Header to show "Chỉnh sửa hồ sơ & Cài đặt"
  const userMenuBtn = page.locator('button[aria-label="Mở menu người dùng"]');
  if (await userMenuBtn.isVisible()) {
    await userMenuBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "02-header-user-dropdown.png"),
      fullPage: false,
    });
    console.log("Captured 02-header-user-dropdown.png");
  }

  // 3. Navigate to /profile/settings/personal
  console.log("Navigating to /profile/settings/personal...");
  await page.goto("http://localhost:3000/profile/settings/personal", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "03-settings-personal-view.png"),
    fullPage: false,
  });
  console.log("Captured 03-settings-personal-view.png");

  // 4. Click "Chỉnh sửa" on Personal Info to show inline edit mode
  const editBtn = page.locator('button:has-text("Chỉnh sửa")').first();
  if (await editBtn.isVisible()) {
    await editBtn.click();
    await page.waitForTimeout(500);

    // Type something in Display Name to trigger sticky save bar
    const displayNameInput = page.locator('input[placeholder="nickname_topik"]');
    if (await displayNameInput.isVisible()) {
      await displayNameInput.fill("junghyeon_master");
    }

    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "04-settings-personal-edit-dirty.png"),
      fullPage: false,
    });
    console.log("Captured 04-settings-personal-edit-dirty.png");
  }

  // 5. Open Mascot Modal
  const mascotBtn = page.locator('button:has-text("Linh vật Honey")');
  if (await mascotBtn.isVisible()) {
    await mascotBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "05-mascot-gallery-modal.png"),
      fullPage: false,
    });
    console.log("Captured 05-mascot-gallery-modal.png");
    // Close modal
    await page.keyboard.press("Escape");
  }

  // 6. Navigate to /profile/settings/learning
  console.log("Navigating to /profile/settings/learning...");
  await page.goto("http://localhost:3000/profile/settings/learning", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "06-settings-learning-tab.png"),
    fullPage: false,
  });
  console.log("Captured 06-settings-learning-tab.png");

  // 7. Navigate to /profile/settings/account
  console.log("Navigating to /profile/settings/account...");
  await page.goto("http://localhost:3000/profile/settings/account", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "07-settings-account-tab.png"),
    fullPage: false,
  });
  console.log("Captured 07-settings-account-tab.png");

  // 8. Navigate to /profile/settings/privacy
  console.log("Navigating to /profile/settings/privacy...");
  await page.goto("http://localhost:3000/profile/settings/privacy", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "08-settings-privacy-tab.png"),
    fullPage: false,
  });
  console.log("Captured 08-settings-privacy-tab.png");

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
