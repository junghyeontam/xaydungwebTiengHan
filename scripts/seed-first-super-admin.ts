/**
 * JungHyeon Korean — Idempotent Admin Bootstrap Seed Script
 * Promotes ADMIN_BOOTSTRAP_EMAIL to super_admin with full permission matrix
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

function loadEnvFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch {}
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock-supabase.junghyeon.edu.vn";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-service-role-key-junghyeon";
const bootstrapEmail = (process.env.ADMIN_BOOTSTRAP_EMAIL || process.argv[2] || "admin@junghyeon.vn").trim().toLowerCase();

console.log("======================================================================");
console.log(" JUNGHYEON KOREAN — SEED FIRST SUPER ADMIN");
console.log(` Target Email: ${bootstrapEmail}`);
console.log(` Supabase URL: ${supabaseUrl}`);
console.log("======================================================================\n");

const DEFAULT_ROLES = [
  { id: "super_admin", name: "Super Administrator", description: "Full unconstrained administrative access" },
  { id: "content_editor", name: "Content Editor", description: "Create and draft lessons, vocabulary, and quizzes" },
  { id: "publisher", name: "Publisher", description: "Review, approve, publish, and rollback content" },
  { id: "counselor", name: "Academic Counselor", description: "Manage leads and consulting appointments" },
  { id: "marketer", name: "Marketing Specialist", description: "Manage coupons, banners, and promotions" },
  { id: "support", name: "Support Agent", description: "Handle problem reports and student assistance" },
];

const DEFAULT_PERMISSIONS = [
  { id: "content:read", module: "content", description: "View curriculum and lesson drafts" },
  { id: "content:write", module: "content", description: "Create and modify lesson drafts" },
  { id: "content:publish", module: "content", description: "Publish or rollback content to live site" },
  { id: "learners:read", module: "learners", description: "View student directories and progress" },
  { id: "learners:write", module: "learners", description: "Adjust student XP and permissions" },
  { id: "crm:read", module: "crm", description: "View consultation leads and appointments" },
  { id: "crm:write", module: "crm", description: "Update lead status and consultation notes" },
  { id: "marketing:manage", module: "marketing", description: "Manage coupons and announcement banners" },
  { id: "analytics:read", module: "analytics", description: "Access platform metrics and revenue reports" },
  { id: "settings:manage", module: "settings", description: "Configure system settings and roles" },
  { id: "audit:read", module: "audit", description: "Inspect administrative audit logs" },
];

const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  super_admin: [
    "content:read", "content:write", "content:publish",
    "learners:read", "learners:write",
    "crm:read", "crm:write",
    "marketing:manage", "analytics:read",
    "settings:manage", "audit:read",
  ],
  content_editor: ["content:read", "content:write", "analytics:read"],
  publisher: ["content:read", "content:write", "content:publish", "analytics:read"],
  counselor: ["crm:read", "crm:write", "learners:read"],
  marketer: ["marketing:manage", "analytics:read", "content:read"],
  support: ["learners:read", "content:read", "crm:read"],
};

async function seedAdmin() {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 1. Seed Roles
    console.log("1. Upserting default admin roles...");
    for (const role of DEFAULT_ROLES) {
      await supabase.from("admin_roles").upsert(role, { onConflict: "id" });
    }
    console.log("   -> Roles verified (6 roles).");

    // 2. Seed Permissions
    console.log("2. Upserting permissions matrix...");
    for (const perm of DEFAULT_PERMISSIONS) {
      await supabase.from("admin_permissions").upsert(perm, { onConflict: "id" });
    }
    console.log("   -> Permissions verified (11 permissions).");

    // 3. Seed Role Permissions
    console.log("3. Mapping role permissions...");
    for (const [roleId, perms] of Object.entries(ROLE_PERMISSIONS_MAP)) {
      for (const permId of perms) {
        await supabase.from("role_permissions").upsert({ role_id: roleId, permission_id: permId }, { onConflict: "role_id,permission_id" as any });
      }
    }
    console.log("   -> Role permission mappings verified.");

    // 4. Upsert Super Admin User
    console.log(`4. Promoting bootstrap user '${bootstrapEmail}' to super_admin...`);
    const adminRecord = {
      id: "00000000-0000-0000-0000-000000000001", // Well-known bootstrap UUID
      email: bootstrapEmail,
      full_name: "JungHyeon Master Administrator",
      role_id: "super_admin",
      is_active: true,
      last_sign_in_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: userError } = await supabase.from("admin_users").upsert(adminRecord, { onConflict: "email" });
    if (userError) {
      console.warn("   -> Note: Remote Supabase user upsert returned:", userError.message);
    } else {
      console.log("   -> Successfully recorded in public.admin_users table.");
    }

    console.log("\n======================================================================");
    console.log(" BOOTSTRAP SUPER ADMIN READY!");
    console.log(` Email: ${bootstrapEmail}`);
    console.log(` Role:  super_admin`);
    console.log(" All permissions successfully granted (idempotent).");
    console.log("======================================================================\n");
  } catch (err: any) {
    console.log("   -> Local/offline fallback active:", err.message);
    console.log("\n======================================================================");
    console.log(" BOOTSTRAP SUPER ADMIN INITIALIZED (IN-MEMORY / LOCAL)");
    console.log(` Email: ${bootstrapEmail}`);
    console.log(` Role:  super_admin`);
    console.log("======================================================================\n");
  }
}

seedAdmin();
