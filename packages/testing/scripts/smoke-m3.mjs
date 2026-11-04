// Smoke test for Phase M-3: apps/web (3000) + apps/admin (3002)

const webRoutes = [
  "/",
  "/roadmap",
  "/theory",
  "/lessons/beginner-1-lesson-3-ayo-eoyo-endings",
  "/review",
  "/profile",
  "/shop",
  "/auth",
];

console.log("=== [1] Testing apps/web (http://localhost:3000) ===");
for (const r of webRoutes) {
  const res = await fetch(`http://localhost:3000${r}`);
  console.log(`web ${r.padEnd(43)} -> HTTP ${res.status}`);
  if (res.status !== 200) {
    console.error(`FAIL: Expected 200 for web ${r}, got ${res.status}`);
    process.exitCode = 1;
  }
}

// Transitional 308 redirect from apps/web/admin -> apps/admin
const redirectRes = await fetch("http://localhost:3000/admin/learners", { redirect: "manual" });
console.log(
  `web /admin/learners (308 redirect)             -> HTTP ${redirectRes.status} (${redirectRes.headers.get("location")})`
);
if (redirectRes.status !== 308) {
  console.error(`FAIL: Expected 308 redirect on web /admin/learners, got ${redirectRes.status}`);
  process.exitCode = 1;
}

const adminRoutes = [
  "/",
  "/learners",
  "/sales/orders",
  "/leads",
  "/banners",
  "/coupons",
  "/analytics",
  "/settings",
  "/system/roles",
  "/system/audit-log",
  "/vi/admin/teaching/lessons",
];

console.log("\n=== [2] Testing apps/admin (http://localhost:3002) ===");
for (const r of adminRoutes) {
  const res = await fetch(`http://localhost:3002${r}`);
  console.log(`admin ${r.padEnd(41)} -> HTTP ${res.status}`);
  if (res.status !== 200) {
    console.error(`FAIL: Expected 200 for admin ${r}, got ${res.status}`);
    process.exitCode = 1;
  }
}

// Learner role hitting apps/admin -> 403
const learnerAdminPage = await fetch("http://localhost:3002/learners", {
  headers: { "x-user-role": "learner" },
});
console.log(`admin /learners (role=learner)                 -> HTTP ${learnerAdminPage.status}`);
if (learnerAdminPage.status !== 403) {
  console.error(`FAIL: Expected 403 for learner on admin /learners, got ${learnerAdminPage.status}`);
  process.exitCode = 1;
}

// Non-super_admin hitting /system/roles -> 403
const adminSystemPage = await fetch("http://localhost:3002/system/roles", {
  headers: { "x-user-role": "admin" },
});
console.log(`admin /system/roles (role=admin)               -> HTTP ${adminSystemPage.status}`);
if (adminSystemPage.status !== 403) {
  console.error(`FAIL: Expected 403 for admin on /system/roles, got ${adminSystemPage.status}`);
  process.exitCode = 1;
}

// Unauthorized RBAC API on apps/admin -> 403
const unauthOrderGet = await fetch("http://localhost:3002/api/admin/orders?role=content_editor");
console.log(`admin /api/admin/orders GET (content_editor)   -> HTTP ${unauthOrderGet.status}`);
if (unauthOrderGet.status !== 403) {
  console.error(`FAIL: Expected 403 for content_editor on /api/admin/orders, got ${unauthOrderGet.status}`);
  process.exitCode = 1;
}
