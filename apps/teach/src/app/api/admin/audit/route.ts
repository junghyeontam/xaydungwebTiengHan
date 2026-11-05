import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/features/audit/audit-service";
import { checkPermission } from "@/features/auth-rbac/require-permission";
import { AdminRole } from "@/features/auth-rbac/types";

export async function GET(req: NextRequest) {
  const role =
    (req.headers.get("x-admin-role") as AdminRole) ||
    (req.nextUrl.searchParams.get("role") as AdminRole) ||
    "super_admin";

  // RBAC check: Only roles with system.audit_view can read audit trails
  const perm = checkPermission(role, "system", "audit_view");
  if (!perm.authorized) {
    return NextResponse.json(
      {
        error: `Forbidden: Role '${role}' does not have permission 'system.audit_view'`,
        code: perm.code,
      },
      { status: 403 }
    );
  }

  const logs = await getAuditLogs();
  return NextResponse.json({ success: true, logs });
}
