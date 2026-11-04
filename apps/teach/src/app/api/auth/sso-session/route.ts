import { NextRequest, NextResponse } from "next/server";
import {
  SSO_SESSION_COOKIE,
  SSO_ROLE_COOKIE,
  SSO_2FA_COOKIE,
  REAUTH_TIMESTAMP_COOKIE,
  getSsoCookieOptions,
  buildSsoSessionSnapshot,
} from "@junghyeon/auth";

export async function GET(request: NextRequest) {
  const roleCookie = request.cookies.get(SSO_ROLE_COOKIE)?.value || request.cookies.get("jh_admin_role")?.value;
  const roleParam = request.nextUrl.searchParams.get("role");
  const is2FA = request.cookies.get(SSO_2FA_COOKIE)?.value !== "false";
  const reauthTs = request.cookies.get(REAUTH_TIMESTAMP_COOKIE)?.value;

  const snapshot = buildSsoSessionSnapshot({
    role: roleParam || roleCookie || "teacher",
    is2FAVerified: is2FA,
    reauthTimestampMs: reauthTs,
  });

  return NextResponse.json({
    surface: "teach",
    ...snapshot,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const role = typeof body.role === "string" ? body.role : "teacher";
  const verify2FA = body.verify2FA !== false;
  const stepUpReAuth = Boolean(body.stepUpReAuth);

  const opts = getSsoCookieOptions();
  const reauthTs = stepUpReAuth ? Date.now() : undefined;
  const snapshot = buildSsoSessionSnapshot({
    role,
    is2FAVerified: verify2FA,
    reauthTimestampMs: reauthTs,
  });

  const response = NextResponse.json({
    surface: "teach",
    updated: true,
    ...snapshot,
  });

  response.cookies.set(SSO_SESSION_COOKIE, `sso_${role}`, opts);
  response.cookies.set(SSO_ROLE_COOKIE, role, opts);
  response.cookies.set("jh_admin_role", role, opts);
  response.cookies.set(SSO_2FA_COOKIE, verify2FA ? "true" : "false", opts);
  if (reauthTs) {
    response.cookies.set(REAUTH_TIMESTAMP_COOKIE, String(reauthTs), {
      ...opts,
      maxAge: 15 * 60,
    });
  }

  return response;
}

export async function DELETE() {
  const opts = getSsoCookieOptions(0);
  const response = NextResponse.json({
    surface: "teach",
    signedOut: true,
  });

  response.cookies.set(SSO_SESSION_COOKIE, "", opts);
  response.cookies.set(SSO_ROLE_COOKIE, "", opts);
  response.cookies.set("jh_admin_role", "", opts);
  response.cookies.set(SSO_2FA_COOKIE, "", opts);
  response.cookies.set(REAUTH_TIMESTAMP_COOKIE, "", opts);

  return response;
}
