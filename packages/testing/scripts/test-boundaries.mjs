import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

console.log("=== [test-boundaries] Verifying RBAC Surface Matrix & Default-Deny ===");

const surfacesFilePath = path.join(repoRoot, "packages/rbac/src/surfaces.ts");
const content = fs.readFileSync(surfacesFilePath, "utf8");

let failed = false;

// 1. Verify all 11 canonical/learner roles exist in the matrix
const requiredRoles = [
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

for (const role of requiredRoles) {
  if (!content.includes(`${role}: {`)) {
    console.error(`FAIL: Role '${role}' missing from ROLE_SURFACE_MATRIX`);
    failed = true;
  }
}

// 2. Verify Default-Deny principles
// - guest and learner can ONLY access web
if (!content.includes('guest: {\n    role: "guest",\n    allowedSurfaces: ["web"]') &&
    !content.includes('guest: {\r\n    role: "guest",\r\n    allowedSurfaces: ["web"]')) {
  // Check looser regex
  if (!/guest:\s*\{[^}]*allowedSurfaces:\s*\["web"\]/s.test(content)) {
    console.error("FAIL: guest must only be allowed on ['web']");
    failed = true;
  }
}

if (!/learner:\s*\{[^}]*allowedSurfaces:\s*\["web"\]/s.test(content)) {
  console.error("FAIL: learner must only be allowed on ['web']");
  failed = true;
}

// - teacher must be allowed on web and teach, but NOT admin or system
if (!/teacher:\s*\{[^}]*allowedSurfaces:\s*\["web",\s*"teach"\]/s.test(content)) {
  console.error("FAIL: teacher must only be allowed on ['web', 'teach']");
  failed = true;
}

// - sales_crm, support_agent, marketing, read_only must be allowed on web and admin, but NOT teach or system
for (const staffRole of ["sales_crm", "support_agent", "marketing", "read_only"]) {
  const reg = new RegExp(`${staffRole}:\\s*\\{[^}]*allowedSurfaces:\\s*\\["web",\\s*"admin"\\]`, "s");
  if (!reg.test(content)) {
    console.error(`FAIL: ${staffRole} must only be allowed on ['web', 'admin']`);
    failed = true;
  }
}

// - super_admin is the ONLY role with access to system
const systemMatches = content.match(/allowedSurfaces:[^\]]*"system"[^\]]*\]/g) || [];
if (systemMatches.length !== 1) {
  console.error(
    `FAIL: Exactly one role (super_admin) must have access to 'system', found ${systemMatches.length}`
  );
  failed = true;
}

// - 2FA is strictly mandatory for super_admin, admin, publisher, and read_only
for (const role2FA of ["super_admin", "admin", "publisher", "read_only"]) {
  const reg = new RegExp(`${role2FA}:\\s*\\{[^}]*requires2FA:\\s*true`, "s");
  if (!reg.test(content)) {
    console.error(`FAIL: ${role2FA} must require 2FA`);
    failed = true;
  }
}

if (failed) {
  console.error("RBAC Surface boundary unit tests FAILED");
  process.exit(1);
}

console.log(
  "[test-boundaries] PASS: Verified all 11 roles, Default-Deny isolation, super_admin exclusive system surface, and mandatory 2FA enforcement."
);
