import { getCookieDomain, isProduction } from "@junghyeon/config";
import { getAccessibleSurfaces, getDefaultSurfaceForRole, roleRequires2FA } from "@junghyeon/rbac";

export const SSO_SESSION_COOKIE = "jh_sso_session";
export const SSO_ROLE_COOKIE = "jh_active_role";
export const SSO_2FA_COOKIE = "jh_2fa_verified";
export const REAUTH_TIMESTAMP_COOKIE = "jh_reauth_ts";
export const IMPERSONATION_COOKIE = "jh_impersonation_target";

export const REAUTH_WINDOW_SECONDS = 15 * 60; // 15 minutes for /system/** mutations
export const IMPERSONATION_EXPIRY_SECONDS = 15 * 60; // 15 minutes read-only impersonation max

export interface SsoCookieOptions {
  domain?: string;
  path: string;
  sameSite: "lax" | "strict";
  secure: boolean;
  httpOnly: boolean;
  maxAge: number;
}

export function getSsoCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7): SsoCookieOptions {
  return {
    domain: getCookieDomain(),
    path: "/",
    sameSite: "lax",
    secure: isProduction(),
    httpOnly: true,
    maxAge: maxAgeSeconds,
  };
}

export function isReAuthFresh(reauthTimestampMs: number | string | null | undefined): boolean {
  if (!reauthTimestampMs) return false;
  const parsed = typeof reauthTimestampMs === "number" ? reauthTimestampMs : Number(reauthTimestampMs);
  if (!Number.isFinite(parsed) || parsed <= 0) return false;
  const elapsedMs = Date.now() - parsed;
  return elapsedMs >= 0 && elapsedMs <= REAUTH_WINDOW_SECONDS * 1000;
}

export interface SsoSessionSnapshot {
  authenticated: boolean;
  role: string;
  allowedSurfaces: readonly string[];
  defaultSurface: string;
  requires2FA: boolean;
  is2FAVerified: boolean;
  reAuthFresh: boolean;
  cookieDomain: string;
}

export function buildSsoSessionSnapshot(params: {
  role?: string | null;
  is2FAVerified?: boolean;
  reauthTimestampMs?: number | string | null;
}): SsoSessionSnapshot {
  const role = params.role || "guest";
  const authenticated = role !== "guest";
  const allowedSurfaces = getAccessibleSurfaces(role);
  const defaultSurface = getDefaultSurfaceForRole(role);
  const requires2FA = roleRequires2FA(role);
  const is2FAVerified = params.is2FAVerified ?? !requires2FA;
  const reAuthFresh = isReAuthFresh(params.reauthTimestampMs);
  const cookieDomain = getCookieDomain() || "localhost (host-only)";

  return {
    authenticated,
    role,
    allowedSurfaces,
    defaultSurface,
    requires2FA,
    is2FAVerified,
    reAuthFresh,
    cookieDomain,
  };
}
