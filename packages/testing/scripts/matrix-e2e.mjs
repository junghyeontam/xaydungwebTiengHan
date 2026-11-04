/**
 * ==============================================================================
 * JUNGHYEON MONOREPO - COMPREHENSIVE E2E SURFACE MATRIX & RLS TEST SUITE (M-9)
 * Tests all 11 personas across 4 surfaces, API boundaries, Dual-Control, PII masking,
 * Step-Up Re-Auth, 15m Impersonation, and Audit Log immutability.
 * ==============================================================================
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

const WEB = process.env.WEB_URL || "http://localhost:3000";
const TEACH = process.env.TEACH_URL || "http://localhost:3001";
const ADMIN = process.env.ADMIN_URL || "http://localhost:3002";

const ALL_ROLES = [
  "guest",
  "learner",
  "teacher",
  "content_editor",
  "publisher",
  "sales_crm",
  "support_agent",
  "marketing",
  "read_only",
  "admin",
  "super_admin",
];

// Expected access per role across the 4 surfaces
// web: everyone (guests, learners, staff)
// teach: teacher, content_editor, publisher, super_admin
// admin: admin, sales_crm, support_agent, marketing, read_only, super_admin
// system: super_admin only (with 2FA)
const SURFACE_EXPECTATIONS = {
  web: {
    guest: 200,
    learner: 200,
    teacher: 200,
    content_editor: 200,
    publisher: 200,
    sales_crm: 200,
    support_agent: 200,
    marketing: 200,
    read_only: 200,
    admin: 200,
    super_admin: 200,
  },
  teach: {
    guest: 403,
    learner: 403,
    teacher: 200,
    content_editor: 200,
    publisher: 200,
    sales_crm: 403,
    support_agent: 403,
    marketing: 403,
    read_only: 403,
    admin: 403,
    super_admin: 200,
  },
  admin: {
    guest: 403,
    learner: 403,
    teacher: 403,
    content_editor: 403,
    publisher: 403,
    sales_crm: 200,
    support_agent: 200,
    marketing: 200,
    read_only: 200,
    admin: 200,
    super_admin: 200,
  },
  system: {
    guest: 403,
    learner: 403,
    teacher: 403,
    content_editor: 403,
    publisher: 403,
    sales_crm: 403,
    support_agent: 403,
    marketing: 403,
    read_only: 403,
    admin: 403,
    super_admin: 200,
  },
};

async function checkServerAvailable(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function run() {
  console.log("===============================================================================");
  console.log("   JUNGHYEON MONOREPO - FULL E2E SURFACE MATRIX & RLS AUDIT SUITE (M-9)");
  console.log("===============================================================================");
  console.log(`- Web:    ${WEB}`);
  console.log(`- Teach:  ${TEACH}`);
  console.log(`- Admin:  ${ADMIN}`);
  console.log("-------------------------------------------------------------------------------\n");

  let totalTests = 0;
  let passedTests = 0;
  let failed = false;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✓ ${message}`);
    } else {
      failed = true;
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // Check servers
  const [webOk, teachOk, adminOk] = await Promise.all([
    checkServerAvailable(`${WEB}/roadmap`),
    checkServerAvailable(`${TEACH}/lessons`),
    checkServerAvailable(`${ADMIN}/learners`),
  ]);

  if (!webOk || !teachOk || !adminOk) {
    console.error("ERROR: Not all surfaces are running!");
    console.error(`  Web (3000):   ${webOk ? "UP" : "DOWN"}`);
    console.error(`  Teach (3001): ${teachOk ? "UP" : "DOWN"}`);
    console.error(`  Admin (3002): ${adminOk ? "UP" : "DOWN"}`);
    console.error("Please run production or dev servers before executing matrix-e2e.mjs.");
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // 1. FULL 11-PERSONA X 4-SURFACE ACCESS MATRIX (44 tests)
  // -------------------------------------------------------------------------
  console.log("=== [1] Executing 11-Persona x 4-Surface Matrix (44 tests) ===");

  const surfaceRoutes = {
    web: `${WEB}/roadmap`,
    teach: `${TEACH}/lessons`,
    admin: `${ADMIN}/learners`,
    system: `${ADMIN}/system/roles`,
  };

  for (const surface of ["web", "teach", "admin", "system"]) {
    const targetUrl = surfaceRoutes[surface];
    console.log(`\n--- Surface: ${surface.toUpperCase()} (${targetUrl}) ---`);

    for (const role of ALL_ROLES) {
      const expectedStatus = SURFACE_EXPECTATIONS[surface][role];
      const cookieHeader =
        role === "guest"
          ? ""
          : `jh_sso_session=sso_${role}; jh_active_role=${role}; jh_2fa_verified=true; jh_reauth_ts=${Date.now()}`;

      const res = await fetch(targetUrl, {
        redirect: "manual",
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      });

      const body = await res.text();
      const isStatusOk = res.status === expectedStatus;
      const is403MarkerOk =
        expectedStatus === 403
          ? body.includes("surface-denied-403") || body.includes("FORBIDDEN") || body.includes("unauthorized")
          : true;

      assert(
        isStatusOk && is403MarkerOk,
        `Role '${role.padEnd(14)}' -> ${surface.padEnd(6)} got HTTP ${res.status} (expected ${expectedStatus}, 403Marker=${is403MarkerOk})`
      );
    }
  }

  // -------------------------------------------------------------------------
  // 2. LEGACY URL REDIRECTS (308 Permanent Redirects)
  // -------------------------------------------------------------------------
  console.log("\n=== [2] Testing Transitional 308 Redirects ===");

  // A) Web /admin/* -> Admin
  const webLegacyRes = await fetch(`${WEB}/admin/learners`, { redirect: "manual" });
  assert(
    webLegacyRes.status === 308,
    `Web legacy '/admin/learners' redirects with HTTP 308 (got ${webLegacyRes.status})`
  );
  const webRedirectLoc = webLegacyRes.headers.get("location") || "";
  assert(
    webRedirectLoc.includes(":3002/admin/learners") || webRedirectLoc.includes("admin.junghyeon.com/admin/learners"),
    `Web redirect target matches admin origin (got '${webRedirectLoc}')`
  );

  // B) Admin /admin/teaching/* -> Teach
  const adminLegacyRes = await fetch(`${ADMIN}/admin/teaching/lessons`, { redirect: "manual" });
  assert(
    adminLegacyRes.status === 308,
    `Admin legacy '/admin/teaching/lessons' redirects with HTTP 308 (got ${adminLegacyRes.status})`
  );
  const adminRedirectLoc = adminLegacyRes.headers.get("location") || "";
  assert(
    adminRedirectLoc.includes(":3001/lessons") || adminRedirectLoc.includes("teach.junghyeon.com/lessons"),
    `Admin redirect target matches teach origin (got '${adminRedirectLoc}')`
  );

  // C) Admin /admin/publishing -> Teach
  const pubLegacyRes = await fetch(`${ADMIN}/admin/publishing`, { redirect: "manual" });
  assert(
    pubLegacyRes.status === 308,
    `Admin legacy '/admin/publishing' redirects with HTTP 308 (got ${pubLegacyRes.status})`
  );

  // -------------------------------------------------------------------------
  // 3. API SECURITY & ROLE ENFORCEMENT
  // -------------------------------------------------------------------------
  console.log("\n=== [3] Testing API Security & Role Boundaries ===");

  // A) Learner cannot access admin content API
  const learnerMutateRes = await fetch(`${ADMIN}/api/admin/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jh_sso_session=sso_learner; jh_active_role=learner",
    },
    body: JSON.stringify({
      action: "create_draft",
      slug: "malicious-lesson",
      actorRole: "learner",
    }),
  });
  assert(
    learnerMutateRes.status === 403,
    `Learner session mutation on /api/admin/content blocked with HTTP 403 (got ${learnerMutateRes.status})`
  );

  // B) Sales CRM cannot publish curriculum
  const salesPublishRes = await fetch(`${ADMIN}/api/admin/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jh_sso_session=sso_sales_crm; jh_active_role=sales_crm",
    },
    body: JSON.stringify({
      action: "publish",
      slug: "lesson-topic-1",
      actorEmail: "sales@junghyeon.vn",
      actorRole: "sales_crm",
    }),
  });
  assert(
    salesPublishRes.status === 403,
    `Sales CRM role cannot publish lesson directly (HTTP 403, got ${salesPublishRes.status})`
  );

  // C) Content Editor can create draft
  const editorDraftRes = await fetch(`${ADMIN}/api/admin/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jh_sso_session=sso_content_editor; jh_active_role=content_editor",
    },
    body: JSON.stringify({
      action: "create_draft",
      slug: `m9-test-${Date.now()}`,
      title: "Bài học kiểm thử M-9",
      koreanTitle: "테스트 과",
      levelBadge: "TOPIK 1",
      levelName: "Cơ bản",
      authorEmail: "editor@junghyeon.vn",
      authorRole: "content_editor",
    }),
  });
  const editorDraftJson = await editorDraftRes.json();
  assert(
    editorDraftRes.status === 201 || editorDraftRes.status === 200,
    `Content Editor can draft lessons (HTTP ${editorDraftRes.status})`
  );

  // D) Content Editor CANNOT directly publish without publisher role
  const editorPublishRes = await fetch(`${ADMIN}/api/admin/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jh_sso_session=sso_content_editor; jh_active_role=content_editor",
    },
    body: JSON.stringify({
      action: "publish",
      slug: editorDraftJson.draft?.slug || "sample-slug",
      actorEmail: "editor@junghyeon.vn",
      actorRole: "content_editor",
    }),
  });
  assert(
    editorPublishRes.status === 403,
    `Content Editor cannot directly publish without Publisher role (HTTP 403, got ${editorPublishRes.status})`
  );

  // -------------------------------------------------------------------------
  // 4. DUAL-CONTROL (TWO-PERSON RULE) VERIFICATION
  // -------------------------------------------------------------------------
  console.log("\n=== [4] Testing Dual-Control (Two-Person Rule) ===");

  // Propose refund by sales
  const proposeRes = await fetch(`${ADMIN}/api/admin/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "propose_refund",
      orderId: "ORD-8921",
      actorEmail: "sales@junghyeon.vn",
      actorRole: "sales_crm",
      amount: 1290000,
      reason: "Học viên yêu cầu hoàn tiền do trùng lịch học",
    }),
  });
  assert(
    proposeRes.status === 200,
    `Sales CRM proposed refund successfully (HTTP 200, got ${proposeRes.status})`
  );

  // Proposer attempting to approve their OWN refund (Must FAIL with Two-Person Rule Violation)
  const selfApproveRes = await fetch(`${ADMIN}/api/admin/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "approve_refund",
      orderId: "ORD-8921",
      actorEmail: "sales@junghyeon.vn", // Same as proposer!
      actorRole: "admin", // Even if role elevated, email matches!
      notes: "Tự duyệt",
    }),
  });
  const selfApproveJson = await selfApproveRes.json();
  assert(
    selfApproveRes.status === 403 && selfApproveJson.code === "TWO_PERSON_RULE_VIOLATION",
    `Two-Person Rule blocked self-approval: HTTP 403, code=${selfApproveJson.code}`
  );

  // Different user approves refund (Should SUCCEED)
  const dualApproveRes = await fetch(`${ADMIN}/api/admin/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "approve_refund",
      orderId: "ORD-8921",
      actorEmail: "ops@junghyeon.vn", // Different approver!
      actorRole: "admin",
      notes: "Đã xác minh và chấp thuận hoàn tiền",
    }),
  });
  const dualApproveJson = await dualApproveRes.json();
  assert(
    dualApproveRes.status === 200 && dualApproveJson.order?.status === "refunded",
    `Dual-Control approval by independent administrator succeeded (HTTP 200, status=${dualApproveJson.order?.status})`
  );

  // -------------------------------------------------------------------------
  // 5. PII MASKING VERIFICATION
  // -------------------------------------------------------------------------
  console.log("\n=== [5] Testing PII Masking Policies ===");

  // A) Sales CRM receives masked PII
  const salesOrdersRes = await fetch(`${ADMIN}/api/admin/orders?role=sales_crm`);
  const salesOrdersJson = await salesOrdersRes.json();
  const sampleOrderSales = salesOrdersJson.orders?.[0];
  assert(
    sampleOrderSales && sampleOrderSales.customerEmail.includes("***@"),
    `Sales CRM receives masked email: '${sampleOrderSales?.customerEmail}'`
  );
  assert(
    sampleOrderSales && sampleOrderSales.customerPhone.includes("***"),
    `Sales CRM receives masked phone: '${sampleOrderSales?.customerPhone}'`
  );

  // B) Super Admin receives unmasked PII
  const adminOrdersRes = await fetch(`${ADMIN}/api/admin/orders?role=super_admin`);
  const adminOrdersJson = await adminOrdersRes.json();
  const sampleOrderAdmin = adminOrdersJson.orders?.[0];
  assert(
    sampleOrderAdmin && !sampleOrderAdmin.customerEmail.includes("***@"),
    `Super Admin receives unmasked email: '${sampleOrderAdmin?.customerEmail}'`
  );

  // -------------------------------------------------------------------------
  // 6. SYSTEM AREA: STEP-UP RE-AUTH & 15-MINUTE IMPERSONATION
  // -------------------------------------------------------------------------
  console.log("\n=== [6] Testing Step-Up Re-Auth & 15m Impersonation ===");

  // A) Calling /api/admin/system without fresh re-auth timestamp (missing)
  const noReauthRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "jh_sso_session=sso_super_admin; jh_active_role=super_admin; jh_2fa_verified=true",
    },
    body: JSON.stringify({ action: "read_system_status" }),
  });
  const noReauthJson = await noReauthRes.json();
  assert(
    noReauthRes.status === 403 && (noReauthJson.code === "REAUTH_REQUIRED" || noReauthJson.error === "REAUTH_REQUIRED"),
    `Missing step-up reauth rejected with HTTP 403 and error REAUTH_REQUIRED`
  );

  // B) Calling /api/admin/system with EXPIRED re-auth timestamp (> 15m ago)
  const expiredTs = Date.now() - 16 * 60 * 1000;
  const expiredReauthRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jh_sso_session=sso_super_admin; jh_active_role=super_admin; jh_2fa_verified=true; jh_reauth_ts=${expiredTs}`,
    },
    body: JSON.stringify({ action: "read_system_status" }),
  });
  assert(
    expiredReauthRes.status === 403,
    `Expired reauth timestamp (>15m) rejected with HTTP 403 (got ${expiredReauthRes.status})`
  );

  // C) Calling /api/admin/system with FRESH re-auth timestamp (<= 15m)
  const freshTs = Date.now();
  const freshReauthRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jh_sso_session=sso_super_admin; jh_active_role=super_admin; jh_2fa_verified=true; jh_reauth_ts=${freshTs}`,
    },
    body: JSON.stringify({ action: "read_system_status" }),
  });
  assert(
    freshReauthRes.status === 200,
    `Fresh reauth timestamp (<=15m) accepted with HTTP 200 (got ${freshReauthRes.status})`
  );

  // D) 15-Minute Read-Only Impersonation Cookie Generation
  const impersonateRes = await fetch(`${ADMIN}/api/admin/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jh_sso_session=sso_super_admin; jh_active_role=super_admin; jh_2fa_verified=true; jh_reauth_ts=${freshTs}`,
    },
    body: JSON.stringify({
      action: "start_impersonation",
      targetUserId: "usr-teacher-01",
      targetEmail: "teacher@junghyeon.vn",
      targetRole: "teacher",
      reason: "Hỗ trợ giảng viên kiểm tra hiển thị giáo trình",
    }),
  });
  const impersonateCookies = impersonateRes.headers.get("set-cookie") || "";
  const decodedCookies = decodeURIComponent(impersonateCookies);
  assert(
    impersonateRes.status === 200 &&
      impersonateCookies.includes("jh_impersonation_target") &&
      decodedCookies.includes("usr-teacher-01") &&
      impersonateCookies.includes("Max-Age=900"),
    `15-minute read-only impersonation issued cookie with Max-Age=900 (15 min)`
  );

  // -------------------------------------------------------------------------
  // 7. AUDIT LOG IMMUTABILITY & PERSISTENCE
  // -------------------------------------------------------------------------
  console.log("\n=== [7] Testing Audit Log Immutability ===");

  // Retrieve audit logs via super_admin
  const auditRes = await fetch(`${ADMIN}/api/admin/audit?role=super_admin`);
  const auditJson = await auditRes.json();
  const hasLogs = Array.isArray(auditJson.logs) && auditJson.logs.length > 0;
  assert(
    auditRes.status === 200 && hasLogs,
    `Audit trail loaded with ${auditJson.logs?.length || 0} entries via super_admin`
  );

  // Assert non-authorized learner blocked from audit logs
  const learnerAuditRes = await fetch(`${ADMIN}/api/admin/audit?role=learner`);
  assert(
    learnerAuditRes.status === 403,
    `Learner access to audit logs blocked with HTTP 403 (got ${learnerAuditRes.status})`
  );

  // Assert immutability: verify audit service only exports append/read
  const auditServiceCode = fs.readFileSync(path.join(repoRoot, "packages/db/src/audit-service.ts"), "utf8");
  const hasNoDelete = !auditServiceCode.includes("deleteAuditLog") && !auditServiceCode.includes("DELETE FROM audit_logs");
  const hasNoUpdate = !auditServiceCode.includes("updateAuditLog") && !auditServiceCode.includes("UPDATE audit_logs");
  assert(
    hasNoDelete && hasNoUpdate,
    `Audit service strictly immutable (append-only ledger, zero delete/update operations)`
  );

  // -------------------------------------------------------------------------
  // 8. SEED DATA CURRICULUM VERIFICATION
  // -------------------------------------------------------------------------
  console.log("\n=== [8] Verifying Seed Data Rendering Across Surfaces ===");

  // Web roadmap renders curriculum nodes
  const roadmapRes = await fetch(`${WEB}/roadmap`);
  const roadmapBody = await roadmapRes.text();
  assert(
    roadmapRes.status === 200 &&
      (roadmapBody.includes("TOPIK") || roadmapBody.includes("Lộ trình") || roadmapBody.includes("Bài")),
    `Web roadmap loads curriculum seed data (HTTP 200)`
  );

  // Teach lessons bank renders lesson items
  const teachLessonsRes = await fetch(`${TEACH}/lessons`, {
    headers: {
      Cookie: "jh_sso_session=sso_teacher; jh_active_role=teacher; jh_2fa_verified=true",
    },
  });
  assert(
    teachLessonsRes.status === 200,
    `Teach studio loads lesson drafts & curriculum (HTTP 200)`
  );

  // Admin learners list renders seed learners
  const adminLearnersRes = await fetch(`${ADMIN}/learners`, {
    headers: {
      Cookie: "jh_sso_session=sso_admin; jh_active_role=admin; jh_2fa_verified=true",
    },
  });
  assert(
    adminLearnersRes.status === 200,
    `Admin back-office loads learner directory (HTTP 200)`
  );

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log("\n===============================================================================");
  console.log(`E2E TEST MATRIX RESULTS: ${passedTests} / ${totalTests} PASSED`);
  if (failed) {
    console.error("❌ E2E MATRIX VERIFICATION FAILED!");
    process.exit(1);
  } else {
    console.log("🎉 ALL E2E SURFACE MATRIX, DUAL-CONTROL, AND RLS SECURITY TESTS PASSED!");
    console.log("===============================================================================\n");
  }
}

run().catch((err) => {
  console.error("Unhandled error running matrix-e2e:", err);
  process.exit(1);
});
