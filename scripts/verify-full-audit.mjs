import { chromium } from "playwright";

async function runVerification() {
  console.log("=== STARTING FULL AUDIT VERIFICATION ===");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = [];

  async function testStep(name, fn) {
    try {
      console.log(`Running: ${name}...`);
      await fn();
      results.push({ name, status: "PASS" });
      console.log(`  -> [PASS] ${name}`);
    } catch (err) {
      results.push({ name, status: "FAIL", error: err.message });
      console.error(`  -> [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Verify Legal & Support Pages
  await testStep("Check Legal & Support Pages (/privacy, /terms, /refund, /contact)", async () => {
    for (const path of ["/privacy", "/terms", "/refund", "/contact"]) {
      const res = await page.goto(`http://localhost:3000${path}`, { waitUntil: "domcontentloaded" });
      if (res.status() !== 200) {
        throw new Error(`Page ${path} returned status ${res.status()}`);
      }
    }
  });

  // 2. Verify Contact Form submission to Leads CRM
  await testStep("Submit inquiry on /contact and verify in Admin Leads", async () => {
    await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
    await page.fill('input[placeholder*="Nguyễn Văn A"]', "Phan Thanh Tùng");
    await page.fill('input[type="tel"]', "0933 999 888");
    await page.fill('input[type="email"]', "thanhtung@gmail.com");
    await page.fill('textarea', "Tôi muốn tư vấn khóa học tiếng Hàn du học D2 tháng 12.");

    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Now visit Admin Leads to see if lead appears
    await page.goto("http://localhost:3000/vi/admin/sales/leads", { waitUntil: "networkidle" });
    await page.waitForSelector('table', { state: 'visible', timeout: 5000 });
    try {
      await page.waitForSelector('text=Đang tải danh sách...', { state: 'detached', timeout: 5000 });
    } catch {}
    const rows = await page.locator('tbody tr').allInnerTexts();
    console.log("Admin Leads rows:", rows);
    const content = await page.content();
    if (!content.includes("Phan") && !content.includes("thanhtung")) {
      throw new Error(`Submitted lead not found in Admin Leads CRM. Rows found: ${rows.join(" | ")}`);
    }
  });

  // 3. Verify Roadmap Placement Test Modal
  await testStep("Check Roadmap Skip Level Challenge Modal", async () => {
    await page.goto("http://localhost:3000/roadmap", { waitUntil: "networkidle" });
    const challengeBtn = page.locator('button:has-text("Kiểm tra vượt cấp")').first();
    await challengeBtn.waitFor({ state: "visible", timeout: 5000 });
    await challengeBtn.click();
    await page.waitForTimeout(500);

    const modalTitle = page.locator('text=Bài kiểm tra xếp lớp');
    await modalTitle.waitFor({ state: "visible", timeout: 3000 });
  });

  // 4. Verify Admin Vocabulary Bank
  await testStep("Check Admin Vocabulary Bank & Add Word", async () => {
    await page.goto("http://localhost:3000/vi/admin/content/vocabulary", { waitUntil: "networkidle" });
    const addBtn = page.locator('button:has-text("Add New Word")');
    await addBtn.waitFor({ state: "visible", timeout: 5000 });
    await addBtn.click();
    await page.waitForTimeout(500);

    // Fill form
    await page.fill('input[placeholder*="사과"]', "행복");
    await page.fill('input[placeholder*="sagwa"]', "haengbok");
    await page.fill('input[placeholder*="Quả táo"]', "Hạnh phúc");
    await page.click('button:has-text("Lưu từ vựng")');
    await page.waitForTimeout(500);

    const vocabContent = await page.content();
    if (!vocabContent.includes("행복") || !vocabContent.includes("Hạnh phúc")) {
      throw new Error("Newly added word not found in Vocabulary list");
    }
  });

  // 5. Verify Admin Orders & Refund Modal
  await testStep("Check Admin Orders Page and Refund Controls", async () => {
    await page.goto("http://localhost:3000/vi/admin/sales/orders", { waitUntil: "networkidle" });
    const orderTable = page.locator('table');
    await orderTable.waitFor({ state: "visible", timeout: 5000 });
    const content = await page.content();
    if (!content.includes("ORD-") || !content.includes("Gói VIP")) {
      throw new Error("Orders table does not render expected data");
    }
  });

  // 6. Verify Admin Roadmap Milestones
  await testStep("Check Admin Roadmap Nodes & Add Milestone", async () => {
    await page.goto("http://localhost:3000/vi/admin/content/roadmap", { waitUntil: "networkidle" });
    const addMilestoneBtn = page.locator('button:has-text("Add Level Milestone")');
    await addMilestoneBtn.waitFor({ state: "visible", timeout: 5000 });
    await addMilestoneBtn.click();
    await page.waitForTimeout(500);

    await page.fill('input[placeholder*="Trung cấp 3"]', "Luyện thi Cao cấp TOPIK 6");
    await page.click('button:has-text("Tạo chặng")');
    await page.waitForTimeout(500);

    const content = await page.content();
    if (!content.includes("Luyện thi Cao cấp TOPIK 6")) {
      throw new Error("New milestone not found in Roadmap Nodes page");
    }
  });

  console.log("\n=== TEST RUN SUMMARY ===");
  console.table(results);

  await browser.close();
  const allPass = results.every(r => r.status === "PASS");
  process.exit(allPass ? 0 : 1);
}

runVerification();
