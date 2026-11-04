const WEB = process.env.WEB_URL || "http://localhost:3000";
const TEACH = process.env.TEACH_URL || "http://localhost:3001";
const ADMIN = process.env.ADMIN_URL || "http://localhost:3002";

async function main() {
  let failed = false;

  console.log("=== [1] Testing Cross-Subdomain SSO Endpoints (/api/auth/sso-session) ===");
  for (const [surface, base] of [
    ["web", WEB],
    ["teach", TEACH],
    ["admin", ADMIN],
  ]) {
    const postRes = await fetch(`${base}/api/auth/sso-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "teacher", verify2FA: true, stepUpReAuth: true }),
    });
    const setCookieHeader = postRes.headers.get("set-cookie") || "";
    const json = await postRes.json();
    const ok =
      postRes.status === 200 &&
      json.role === "teacher" &&
      Array.isArray(json.allowedSurfaces) &&
      json.allowedSurfaces.includes("web") &&
      json.allowedSurfaces.includes("teach") &&
      setCookieHeader.includes("jh_sso_session=sso_teacher") &&
      setCookieHeader.includes("jh_active_role=teacher") &&
      setCookieHeader.toLowerCase().includes("httponly") &&
      setCookieHeader.toLowerCase().includes("path=/");

    console.log(
      `sso POST ${surface.padEnd(6)} -> HTTP ${postRes.status} (cookies=${ok ? "VALID" : "INVALID"}, surfaces=${JSON.stringify(
        json.allowedSurfaces
      )})`
    );
    if (!ok) failed = true;
  }

  console.log("\n=== [2] Testing Cross-Surface SSO Cookie Matrix (jh_active_role) ===");
  const cookieMatrix = [
    // learner: web=200, teach=403, admin=403, system=403
    { role: "learner", url: `${WEB}/roadmap`, expected: 200 },
    { role: "learner", url: `${TEACH}/lessons`, expected: 403 },
    { role: "learner", url: `${ADMIN}/learners`, expected: 403 },
    { role: "learner", url: `${ADMIN}/system/roles`, expected: 403 },
    // teacher: web=200, teach=200, admin=403, system=403
    { role: "teacher", url: `${WEB}/roadmap`, expected: 200 },
    { role: "teacher", url: `${TEACH}/lessons`, expected: 200 },
    { role: "teacher", url: `${ADMIN}/learners`, expected: 403 },
    { role: "teacher", url: `${ADMIN}/system/roles`, expected: 403 },
    // sales_crm: web=200, teach=403, admin=200, system=403
    { role: "sales_crm", url: `${WEB}/roadmap`, expected: 200 },
    { role: "sales_crm", url: `${TEACH}/lessons`, expected: 403 },
    { role: "sales_crm", url: `${ADMIN}/sales/orders`, expected: 200 },
    { role: "sales_crm", url: `${ADMIN}/system/roles`, expected: 403 },
    // admin: web=200, teach=403, admin=200, system=403
    { role: "admin", url: `${TEACH}/lessons`, expected: 403 },
    { role: "admin", url: `${ADMIN}/learners`, expected: 200 },
    { role: "admin", url: `${ADMIN}/system/roles`, expected: 403 },
    // super_admin: web=200, teach=200, admin=200, system=200
    { role: "super_admin", url: `${WEB}/roadmap`, expected: 200 },
    { role: "super_admin", url: `${TEACH}/lessons`, expected: 200 },
    { role: "super_admin", url: `${ADMIN}/learners`, expected: 200 },
    { role: "super_admin", url: `${ADMIN}/system/roles`, expected: 200 },
  ];

  for (const test of cookieMatrix) {
    const res = await fetch(test.url, {
      redirect: "manual",
      headers: {
        Cookie: `jh_sso_session=sso_${test.role}; jh_active_role=${test.role}; jh_2fa_verified=true`,
      },
    });
    const body = await res.text();
    const has403Marker = test.expected === 403 ? body.includes("surface-denied-403") : true;
    console.log(
      `Cookie role=${test.role.padEnd(13)} GET ${test.url.padEnd(36)} -> HTTP ${res.status} (expected ${test.expected})`
    );
    if (res.status !== test.expected || !has403Marker) {
      failed = true;
    }
  }

  if (failed) {
    console.error("Phase M-5 smoke test FAILED");
    process.exit(1);
  }
  console.log("\nPhase M-5 smoke test PASSED");
}

main();
