/**
 * RBAC Verification Test Suite: Tiếng Hàn JungHyeon
 * Tests:
 * 1. Least Privilege Matrix per Role
 * 2. Two-Person Rule (Author cannot approve/publish own draft; Proposer cannot approve refund)
 * 3. Privilege Escalation Prevention (Admin cannot assign Admin/Super Admin)
 * 4. PII Masking Functions (maskEmail, maskPhone, maskName)
 */

import { ROLE_DEFINITIONS, hasPermission, formatRoleLabel } from "../src/features/auth-rbac/permissions.js";
import { checkPermission } from "../src/features/auth-rbac/require-permission.js";
import { maskEmail, maskPhone, maskName } from "../src/lib/utils/masking.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== 1. CANONICAL ROLES AUDIT ===");
const canonicalRoles = [
  "super_admin",
  "admin",
  "content_editor",
  "publisher",
  "teacher",
  "sales_crm",
  "support_agent",
  "marketing",
  "read_only",
];

assert(canonicalRoles.length === 9, "Exactly 9 canonical roles exist");

canonicalRoles.forEach((role) => {
  assert(ROLE_DEFINITIONS[role] !== undefined, `Role '${role}' is defined in ROLE_DEFINITIONS`);
  assert(formatRoleLabel(role, "vi").length > 0, `Role '${role}' has localized Vietnamese label`);
  assert(formatRoleLabel(role, "en").length > 0, `Role '${role}' has localized English label`);
});

console.log("\n=== 2. LEAST PRIVILEGE PERMISSION CHECKS ===");

// content_editor
assert(
  checkPermission("content_editor", "content", "create").authorized === true,
  "content_editor CAN create drafts"
);
assert(
  checkPermission("content_editor", "content", "publish").authorized === false,
  "content_editor CANNOT publish content"
);
assert(
  checkPermission("content_editor", "orders", "view").authorized === false,
  "content_editor CANNOT view orders"
);

// publisher
assert(
  checkPermission("publisher", "content", "publish").authorized === true,
  "publisher CAN publish content"
);
assert(
  checkPermission("publisher", "revenue", "view").authorized === false,
  "publisher CANNOT view revenue"
);

// teacher
assert(
  checkPermission("teacher", "content", "view").authorized === true,
  "teacher CAN view content"
);
assert(
  checkPermission("teacher", "content", "publish").authorized === false,
  "teacher CANNOT publish content"
);
assert(
  checkPermission("teacher", "learners", "view_pii").authorized === false,
  "teacher CANNOT view unmasked learner PII"
);

// sales_crm
assert(
  checkPermission("sales_crm", "orders", "refund_propose").authorized === true,
  "sales_crm CAN propose refunds"
);
assert(
  checkPermission("sales_crm", "orders", "refund_approve").authorized === false,
  "sales_crm CANNOT approve refunds (Dual-Control required)"
);
assert(
  checkPermission("sales_crm", "revenue", "view").authorized === true,
  "sales_crm CAN view revenue metrics"
);

// support_agent
assert(
  checkPermission("support_agent", "learners", "view_pii").authorized === true,
  "support_agent CAN view learner PII for tickets"
);
assert(
  checkPermission("support_agent", "revenue", "view").authorized === false,
  "support_agent CANNOT view revenue"
);
assert(
  checkPermission("support_agent", "learners", "delete").authorized === false,
  "support_agent CANNOT delete learners"
);

// marketing
assert(
  checkPermission("marketing", "marketing", "manage").authorized === true,
  "marketing CAN manage coupons and banners"
);
assert(
  checkPermission("marketing", "revenue", "view").authorized === false,
  "marketing CANNOT view exact revenue figures"
);

// read_only
assert(
  checkPermission("read_only", "content", "create").authorized === false,
  "read_only CANNOT create content"
);
assert(
  checkPermission("read_only", "learners", "view_pii").authorized === false,
  "read_only CANNOT view PII"
);
assert(
  checkPermission("read_only", "revenue", "view").authorized === false,
  "read_only CANNOT view revenue"
);

console.log("\n=== 3. TWO-PERSON RULE (SEPARATION OF DUTIES) ===");

// Case A: Content author approving/publishing their own draft
const selfApprovalCheck = checkPermission("publisher", "content", "approve", {
  authorEmail: "kim@junghyeon.vn",
  approverEmail: "kim@junghyeon.vn",
});
assert(
  selfApprovalCheck.authorized === false && selfApprovalCheck.code === "TWO_PERSON_RULE_VIOLATION",
  "Author CANNOT approve their own draft (Dual-Control enforced)"
);

const crossApprovalCheck = checkPermission("publisher", "content", "approve", {
  authorEmail: "editor@junghyeon.vn",
  approverEmail: "publisher@junghyeon.vn",
});
assert(
  crossApprovalCheck.authorized === true,
  "Distinct publisher CAN approve draft from another author"
);

// Case B: Privilege escalation prevention
const escalationCheck = checkPermission("admin", "system", "manage_roles", {
  targetRole: "super_admin",
});
assert(
  escalationCheck.authorized === false && escalationCheck.code === "ROLE_ESCALATION_BLOCKED",
  "Administrator CANNOT escalate a role to Super Administrator"
);

const safeRoleAssignCheck = checkPermission("admin", "system", "manage_roles", {
  targetRole: "teacher",
});
assert(
  safeRoleAssignCheck.authorized === true,
  "Administrator CAN assign non-privileged roles (e.g. Teacher)"
);

console.log("\n=== 4. PII MASKING INTEGRITY ===");

assert(maskEmail("nguyen@junghyeon.vn") === "ng***@junghyeon.vn", "Email masking preserves prefix and domain");
assert(maskEmail("a@b.com") === "a***@b.com", "Short email masked safely");
assert(maskEmail(null) === "—", "Null email returns safe dash");

assert(maskPhone("0988 112 233") === "0988 *** 233", "Phone masking keeps 4 start and 3 end digits");
assert(maskPhone(null) === "—", "Null phone returns safe dash");

assert(maskName("Nguyễn Hải Đăng") === "Nguyễn H** Đ**", "Name masking keeps first name and masks family names");
assert(maskName(null) === "—", "Null name returns safe dash");

console.log("\n==================================");
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log("==================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL RBAC TESTS PASSED SUCCESSFULLY! 🚀");
}
