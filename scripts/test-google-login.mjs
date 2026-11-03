import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const SNAPSHOTS_DIR = "C:/Users/nguye/.gemini/antigravity/brain/6c53ba31-228b-4dee-a832-baf34a21608d/auth-screenshots";
if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

async function run() {
  console.log("=== Testing Google Sign-In Flow ===");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  // Clear localStorage before testing
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Click Login button in Header
  console.log("Opening Auth Modal...");
  const loginBtn = page.locator('header button:has-text("Đăng nhập"), header a:has-text("Đăng nhập")').first();
  await loginBtn.click();
  await page.waitForTimeout(600);

  // Take screenshot of Auth Modal
  await page.screenshot({ path: path.join(SNAPSHOTS_DIR, "auth-modal-open.png") });
  console.log("Saved auth-modal-open.png");

  // 2. Click "Tiếp tục với Google"
  console.log("Clicking 'Tiếp tục với Google'...");
  const googleBtn = page.locator('button:has-text("Tiếp tục với Google")').first();
  await googleBtn.click();
  await page.waitForTimeout(1000);

  // 3. Verify user is logged in
  const currentUrl = page.url();
  console.log("Current page URL after Google login:", currentUrl);

  if (currentUrl.includes("mock-supabase") || currentUrl.includes("NXDOMAIN")) {
    throw new Error(`FAIL: Still redirected to invalid mock domain: ${currentUrl}`);
  }

  // Check if header now shows logged-in user profile
  const userProfile = await page.evaluate(() => {
    const raw = localStorage.getItem("junghyeon_current_user");
    return raw ? JSON.parse(raw) : null;
  });

  console.log("LocalStorage User Profile:", userProfile);

  if (!userProfile || userProfile.email !== "google.user@junghyeon.vn") {
    throw new Error("FAIL: User profile not set in localStorage!");
  }

  // Take screenshot of logged-in state
  await page.screenshot({ path: path.join(SNAPSHOTS_DIR, "logged-in-state.png") });
  console.log("Saved logged-in-state.png");

  await browser.close();
  console.log("=== Google Login Test PASSED 100%! ===");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
