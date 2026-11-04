// Smoke test for Phase M-4: apps/web (3000) + apps/teach (3001) + apps/admin (3002)

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

const teachRoutes = [
  "/",
  "/lessons",
  "/lessons/new",
  "/lessons/lesson-topik-1-self-intro/edit",
  "/banks/vocabulary",
  "/banks/grammar",
  "/roadmap-planner",
  "/review-feedback",
  "/classes",
  "/grading",
  "/analytics",
  "/media",
];

console.log("\n=== [2] Testing apps/teach (http://localhost:3001) ===");
for (const r of teachRoutes) {
  const res = await fetch(`http://localhost:3001${r}`, {
    headers: { "x-user-role": "teacher" },
  });
  console.log(`teach ${r.padEnd(41)} -> HTTP ${res.status}`);
  if (res.status !== 200) {
    console.error(`FAIL: Expected 200 for teach ${r}, got ${res.status}`);
    process.exitCode = 1;
  }
}

// Unauthorized roles hitting apps/teach -> 403
for (const badRole of ["learner", "sales_crm", "support_agent", "marketing", "read_only"]) {
  const res = await fetch("http://localhost:3001/lessons", {
    headers: { "x-user-role": badRole },
  });
  console.log(`teach /lessons (role=${badRole.padEnd(13)})         -> HTTP ${res.status}`);
  if (res.status !== 403) {
    console.error(`FAIL: Expected 403 for role ${badRole} on teach /lessons, got ${res.status}`);
    process.exitCode = 1;
  }
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
];

console.log("\n=== [3] Testing apps/admin (http://localhost:3002) ===");
for (const r of adminRoutes) {
  const res = await fetch(`http://localhost:3002${r}`, {
    headers: { "x-user-role": "super_admin" },
  });
  console.log(`admin ${r.padEnd(41)} -> HTTP ${res.status}`);
  if (res.status !== 200) {
    console.error(`FAIL: Expected 200 for admin ${r}, got ${res.status}`);
    process.exitCode = 1;
  }
}

// Transitional 308 redirect from apps/admin/teaching -> apps/teach
const adminTeachRedirect = await fetch("http://localhost:3002/admin/teaching/lessons", {
  redirect: "manual",
});
console.log(
  `admin /admin/teaching/lessons (308 redirect)   -> HTTP ${adminTeachRedirect.status} (${adminTeachRedirect.headers.get("location")})`
);
if (adminTeachRedirect.status !== 308) {
  console.error(`FAIL: Expected 308 on admin /admin/teaching/lessons, got ${adminTeachRedirect.status}`);
  process.exitCode = 1;
}

// Teacher hitting apps/admin -> 403
const teacherOnAdmin = await fetch("http://localhost:3002/learners", {
  headers: { "x-user-role": "teacher" },
});
console.log(`admin /learners (role=teacher)                 -> HTTP ${teacherOnAdmin.status}`);
if (teacherOnAdmin.status !== 403) {
  console.error(`FAIL: Expected 403 for teacher on admin /learners, got ${teacherOnAdmin.status}`);
  process.exitCode = 1;
}
