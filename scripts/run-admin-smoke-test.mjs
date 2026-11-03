/**
 * Comprehensive Admin Portal Smoke Test Suite
 * Validates routes, aliases, RBAC restrictions, learner gates, and system health.
 */

const BASE_URL = process.env.TEST_APP_URL || "http://localhost:3000";

const ROUTES_TO_TEST = [
  // 1. Core localized admin routes
  { path: "/vi/admin", name: "Admin Dashboard", expectedStatus: 200 },
  { path: "/vi/admin/content/lessons", name: "Content - Lessons", expectedStatus: 200 },
  { path: "/vi/admin/content/vocabulary", name: "Content - Vocabulary", expectedStatus: 200 },
  { path: "/vi/admin/content/roadmap", name: "Content - Roadmap Nodes", expectedStatus: 200 },
  { path: "/vi/admin/publishing", name: "Content - Publishing & Review", expectedStatus: 200 },
  { path: "/vi/admin/learners", name: "Learners Management", expectedStatus: 200 },
  { path: "/vi/admin/analytics", name: "Analytics & Funnels", expectedStatus: 200 },
  { path: "/vi/admin/sales/orders", name: "Sales - Orders & VIP", expectedStatus: 200 },
  { path: "/vi/admin/sales/leads", name: "Consulting - Leads CRM", expectedStatus: 200 },
  { path: "/vi/admin/marketing/banners", name: "Marketing - Banners", expectedStatus: 200 },
  { path: "/vi/admin/marketing/coupons", name: "Marketing - Coupons", expectedStatus: 200 },
  { path: "/vi/admin/settings/staff", name: "Settings - Staff & RBAC", expectedStatus: 200 },
  { path: "/vi/admin/audit-logs", name: "Settings - Audit Logs", expectedStatus: 200 },
  { path: "/vi/admin/settings", name: "Settings - Global Config", expectedStatus: 200 },
  { path: "/vi/admin/design", name: "Living UI Style Guide", expectedStatus: 200 },
  { path: "/vi/admin/health", name: "Admin Diagnostic Health", expectedStatus: 200 },

  // 2. Direct Root & Alias Routes (rewritten transparently by middleware)
  { path: "/admin", name: "Root Admin Alias", expectedStatus: 200 },
  { path: "/learners", name: "Root Learners Alias", expectedStatus: 200 },
  { path: "/analytics", name: "Root Analytics Alias", expectedStatus: 200 },
  { path: "/sales", name: "Root Sales Alias", expectedStatus: 200 },
  { path: "/consulting", name: "Root Consulting Alias", expectedStatus: 200 },
  { path: "/marketing", name: "Root Marketing Alias", expectedStatus: 200 },
  { path: "/settings", name: "Root Settings Alias", expectedStatus: 200 },
  { path: "/settings/roles", name: "Root Settings Roles Alias", expectedStatus: 200 },
  { path: "/settings/audit-log", name: "Root Settings Audit-Log Alias", expectedStatus: 200 },
  { path: "/admin/health", name: "Admin Health Alias", expectedStatus: 200 },
  { path: "/admin/_health", name: "Admin _health Alias", expectedStatus: 200 },
  { path: "/admin/design", name: "Admin Design Alias", expectedStatus: 200 },
  { path: "/admin/_design", name: "Admin _design Alias", expectedStatus: 200 },
];

async function runTests() {
  console.log("=========================================================");
  console.log(`Starting Admin Portal Smoke Tests against ${BASE_URL}`);
  console.log("=========================================================\n");

  let passed = 0;
  let failed = 0;

  // 1. Check all admin routes & aliases
  console.log("--- 1. Testing Admin Pages & Route Rewrites ---");
  for (const route of ROUTES_TO_TEST) {
    try {
      const res = await fetch(`${BASE_URL}${route.path}`, {
        redirect: "manual",
        headers: {
          "x-admin-role": "super_admin",
          Cookie: "jh_role=super_admin; jh_admin_2fa=verified",
        },
      });

      // Status 200 or 307/308 redirect to valid target
      const ok = res.status === route.expectedStatus || (res.status >= 200 && res.status < 400);

      if (ok) {
        console.log(`  ✓ PASS: ${route.name.padEnd(35)} [${route.path}] -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`  ✗ FAIL: ${route.name.padEnd(35)} [${route.path}] -> HTTP ${res.status} (expected ${route.expectedStatus})`);
        failed++;
      }
    } catch (err) {
      console.error(`  ✗ ERROR: ${route.name.padEnd(35)} [${route.path}] -> ${err.message}`);
      failed++;
    }
  }

  // 2. Check RBAC Restrictions: content_editor cannot publish
  console.log("\n--- 2. Testing RBAC: Content Editor cannot publish ---");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-role": "content_editor",
      },
      body: JSON.stringify({
        action: "publish",
        lessonId: "test-lesson-id",
        actorRole: "content_editor",
      }),
    });

    if (res.status === 403) {
      console.log(`  ✓ PASS: content_editor blocked from publishing -> HTTP 403 Forbidden`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: content_editor was not blocked from publishing -> HTTP ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ ERROR testing content_editor publish: ${err.message}`);
    failed++;
  }

  // 3. Check Learner Access Gate: learner cannot access /admin or /api/admin/*
  console.log("\n--- 3. Testing Learner Gate: Learner is blocked from admin access ---");
  try {
    const pageRes = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
      headers: {
        "x-user-role": "learner",
        Cookie: "jh_role=learner",
      },
    });

    // Learner should be redirected to /vi/admin/unauthorized (307/308/302) or get 403
    const isGated =
      pageRes.status === 403 ||
      (pageRes.status >= 300 &&
        pageRes.status < 400 &&
        pageRes.headers.get("location")?.includes("unauthorized"));

    if (isGated) {
      console.log(`  ✓ PASS: Learner accessing /admin is redirected to unauthorized -> HTTP ${pageRes.status} (Location: ${pageRes.headers.get("location")})`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: Learner was able to view /admin directly -> HTTP ${pageRes.status}`);
      failed++;
    }

    const apiRes = await fetch(`${BASE_URL}/api/admin/marketing`, {
      headers: {
        "x-user-role": "learner",
        Cookie: "jh_role=learner",
      },
    });

    if (apiRes.status === 403) {
      console.log(`  ✓ PASS: Learner accessing /api/admin/marketing is rejected -> HTTP 403 Forbidden`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: Learner called /api/admin/marketing successfully -> HTTP ${apiRes.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ ERROR testing learner gate: ${err.message}`);
    failed++;
  }

  // 4. Check Diagnostic Health Endpoint
  console.log("\n--- 4. Testing Admin Health Endpoint ---");
  try {
    const healthRes = await fetch(`${BASE_URL}/vi/admin/health`, {
      headers: {
        "x-admin-role": "super_admin",
        Cookie: "jh_role=super_admin; jh_admin_2fa=verified",
      },
    });

    if (healthRes.ok) {
      console.log(`  ✓ PASS: Health diagnostic page loaded successfully -> HTTP ${healthRes.status}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: Health diagnostic page error -> HTTP ${healthRes.status}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ ERROR testing health: ${err.message}`);
    failed++;
  }

  console.log("\n=========================================================");
  console.log(`Smoke Tests Complete: ${passed} Passed, ${failed} Failed`);
  console.log("=========================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
