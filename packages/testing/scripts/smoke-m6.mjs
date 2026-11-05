const ADMIN = process.env.ADMIN_URL || "http://localhost:3002";

const SYSTEM_SECTIONS = [
  "roles",
  "permissions",
  "integrations",
  "payment-keys",
  "feature-flags",
  "maintenance",
  "backups",
  "security-audit",
  "audit-log",
  "staff",
  "impersonation",
];

async function main() {
  let failed = false;

  console.log("=== [1] Testing All 11 /system/** Routes for super_admin (2FA Verified) ===");
  for (const section of SYSTEM_SECTIONS) {
    const res = await fetch(`${ADMIN}/system/${section}`, {
      headers: {
        Cookie: "jh_active_role=super_admin; jh_2fa_verified=true",
      },
    });
    const html = await res.text();
    const hasBanner = html.includes("system-area-banner");
    const hasSection = html.includes(`system-section-${section}`);
    console.log(
      `GET /system/${section.padEnd(15)} (super_admin + 2FA) -> HTTP ${res.status} (banner=${hasBanner}, section=${hasSection})`
    );
    if (res.status !== 200 || !hasBanner || !hasSection) {
      failed = true;
    }
  }

  console.log("\n=== [2] Testing /system/** Access Denial for Non-super_admin & Unverified 2FA ===");
  const forbiddenCases = [
    { label: "role=admin", cookie: "jh_active_role=admin; jh_2fa_verified=true" },
    { label: "role=sales_crm", cookie: "jh_active_role=sales_crm; jh_2fa_verified=true" },
    { label: "role=support_agent", cookie: "jh_active_role=support_agent; jh_2fa_verified=true" },
    { label: "role=marketing", cookie: "jh_active_role=marketing; jh_2fa_verified=true" },
    { label: "role=read_only", cookie: "jh_active_role=read_only; jh_2fa_verified=true" },
    { label: "role=teacher", cookie: "jh_active_role=teacher; jh_2fa_verified=true" },
    { label: "role=learner", cookie: "jh_active_role=learner; jh_2fa_verified=true" },
    { label: "super_admin (2FA=false)", cookie: "jh_active_role=super_admin; jh_2fa_verified=false" },
  ];

  for (const tc of forbiddenCases) {
    const res = await fetch(`${ADMIN}/system/roles`, {
      headers: { Cookie: tc.cookie },
    });
    console.log(`GET /system/roles (${tc.label.padEnd(23)}) -> HTTP ${res.status} (expected 403)`);
    if (res.status !== 403) {
      failed = true;
    }
  }

  console.log("\n=== [3] Testing /api/admin/system Step-Up Re-Auth (<= 15m) & Impersonation ===");
  // 3a. Missing reauth timestamp -> 403 REAUTH_REQUIRED
  const staleRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jh_active_role=super_admin; jh_2fa_verified=true",
    },
    body: JSON.stringify({ action: "rotate_payment_keys", targetId: "payment-keys" }),
  });
  const staleJson = await staleRes.json();
  console.log(
    `POST /api/admin/system (missing re-auth)   -> HTTP ${staleRes.status} (${staleJson.error})`
  );
  if (staleRes.status !== 403 || staleJson.error !== "REAUTH_REQUIRED") {
    failed = true;
  }

  // 3b. Expired reauth timestamp (20 minutes old) -> 403 REAUTH_REQUIRED
  const expiredTs = Date.now() - 20 * 60 * 1000;
  const expiredRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jh_active_role=super_admin; jh_2fa_verified=true; jh_reauth_ts=${expiredTs}`,
    },
    body: JSON.stringify({ action: "rotate_payment_keys", targetId: "payment-keys" }),
  });
  const expiredJson = await expiredRes.json();
  console.log(
    `POST /api/admin/system (expired 20m re-auth)-> HTTP ${expiredRes.status} (${expiredJson.error})`
  );
  if (expiredRes.status !== 403 || expiredJson.error !== "REAUTH_REQUIRED") {
    failed = true;
  }

  // 3c. Fresh reauth timestamp (just verified) -> 200 OK + 15m read-only impersonation cookie
  const freshTs = Date.now();
  const freshRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jh_active_role=super_admin; jh_2fa_verified=true; jh_reauth_ts=${freshTs}`,
    },
    body: JSON.stringify({
      action: "start_impersonation",
      targetId: "impersonation",
      targetUserId: "learner-demo-001",
      reason: "Troubleshooting learner progress issue",
    }),
  });
  const freshJson = await freshRes.json();
  const setCookie = freshRes.headers.get("set-cookie") || "";
  const hasImpCookie = setCookie.includes("jh_impersonation_target") && setCookie.includes("Max-Age=900");
  console.log(
    `POST /api/admin/system (fresh re-auth <=15m)-> HTTP ${freshRes.status} (ok=${freshJson.ok}, impersonation_cookie_15m=${hasImpCookie})`
  );
  if (freshRes.status !== 200 || !freshJson.ok || !hasImpCookie) {
    failed = true;
  }

  if (failed) {
    console.error("Phase M-6 smoke test FAILED");
    process.exit(1);
  }
  console.log("\nPhase M-6 smoke test PASSED");
}

main();
