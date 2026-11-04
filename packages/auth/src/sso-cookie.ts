import { getCookieDomain, isProduction } from "@junghyeon/config";

export const SSO_SESSION_COOKIE = "jh_sso_session";
export const SSO_ROLE_COOKIE = "jh_active_role";
export const REAUTH_TIMESTAMP_COOKIE = "jh_reauth_ts";
export const REAUTH_WINDOW_SECONDS = 15 * 60; // 15 minutes for /system/** mutations

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
