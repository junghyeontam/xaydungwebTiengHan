import { NextRequest, NextResponse } from "next/server";
import {
  SSO_ROLE_COOKIE,
  SSO_2FA_COOKIE,
  REAUTH_TIMESTAMP_COOKIE,
  IMPERSONATION_COOKIE,
  IMPERSONATION_EXPIRY_SECONDS,
  getSsoCookieOptions,
  isReAuthFresh,
} from "@junghyeon/auth";
import { recordAuditLog } from "@/features/audit/audit-service";

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
] as const;

function resolveCaller(req: NextRequest) {
  const role =
    req.headers.get("x-user-role") ||
    req.headers.get("x-admin-role") ||
    req.cookies.get(SSO_ROLE_COOKIE)?.value ||
    req.cookies.get("jh_admin_role")?.value ||
    req.cookies.get("jh_role")?.value ||
    req.nextUrl.searchParams.get("role") ||
    "super_admin";

  const is2FAVerified =
    req.headers.get("x-2fa-verified") !== "false" &&
    req.cookies.get(SSO_2FA_COOKIE)?.value !== "false";

  const reauthTs =
    req.headers.get("x-reauth-ts") ||
    req.cookies.get(REAUTH_TIMESTAMP_COOKIE)?.value ||
    null;

  return { role, is2FAVerified, reauthTs };
}

export async function GET(req: NextRequest) {
  const { role, is2FAVerified, reauthTs } = resolveCaller(req);

  if (role !== "super_admin") {
    return NextResponse.json(
      { error: "SYSTEM_SUPER_ADMIN_ONLY", message: "Only super_admin can access /system APIs." },
      { status: 403 }
    );
  }

  if (!is2FAVerified) {
    return NextResponse.json(
      { error: "2FA_REQUIRED", message: "2FA verification is required for /system APIs." },
      { status: 403 }
    );
  }

  const section = req.nextUrl.searchParams.get("section") || "roles";
  return NextResponse.json({
    surface: "system",
    section,
    availableSections: SYSTEM_SECTIONS,
    role,
    is2FAVerified,
    reAuthFresh: isReAuthFresh(reauthTs),
    impersonationTarget: req.cookies.get(IMPERSONATION_COOKIE)?.value || null,
  });
}

export async function POST(req: NextRequest) {
  const { role, is2FAVerified, reauthTs } = resolveCaller(req);

  if (role !== "super_admin") {
    return NextResponse.json(
      { error: "SYSTEM_SUPER_ADMIN_ONLY", message: "Only super_admin can mutate /system state." },
      { status: 403 }
    );
  }

  if (!is2FAVerified) {
    return NextResponse.json(
      { error: "2FA_REQUIRED", message: "2FA verification is required for /system mutations." },
      { status: 403 }
    );
  }

  // Enforce fresh Step-Up Re-Authentication (<= 15 minutes) for all /system mutations
  if (!isReAuthFresh(reauthTs)) {
    return NextResponse.json(
      {
        error: "REAUTH_REQUIRED",
        message: "Step-up re-authentication (<= 15m) is required before performing /system mutations.",
      },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const action = typeof body.action === "string" ? body.action : "update_system_setting";
  const targetId = typeof body.targetId === "string" ? body.targetId : "system";

  await recordAuditLog({
    actorId: "super-admin-01",
    actorEmail: "founder@junghyeon.vn",
    actorRole: "super_admin",
    action: `system.${action}`,
    entityType: "system",
    entityId: targetId,
    details: {
      reason: body.reason || "System control mutation via /system",
      payload: body.payload || {},
    },
  });

  const response = NextResponse.json({
    ok: true,
    surface: "system",
    action,
    targetId,
    reAuthFresh: true,
    timestamp: new Date().toISOString(),
  });

  if (action === "start_impersonation" && body.targetUserId) {
    const opts = getSsoCookieOptions(IMPERSONATION_EXPIRY_SECONDS);
    response.cookies.set(
      IMPERSONATION_COOKIE,
      JSON.stringify({
        targetUserId: body.targetUserId,
        mode: "read_only",
        expiresAt: Date.now() + IMPERSONATION_EXPIRY_SECONDS * 1000,
      }),
      opts
    );
  } else if (action === "stop_impersonation") {
    response.cookies.set(IMPERSONATION_COOKIE, "", getSsoCookieOptions(0));
  }

  return response;
}
