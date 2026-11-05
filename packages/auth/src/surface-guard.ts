import { canAccessSurface, getDefaultSurfaceForRole, roleRequires2FA } from "@junghyeon/rbac";
import { getSurfaceUrl, type SurfaceId } from "@junghyeon/config";
import { isReAuthFresh } from "./sso-cookie";

export interface SurfaceGuardInput {
  surface: SurfaceId;
  pathname: string;
  role: string | null | undefined;
  isAuthenticated: boolean;
  is2FAVerified?: boolean;
  lastReAuthAtMs?: number | null;
}

export interface SurfaceGuardDecision {
  allowed: boolean;
  status: 200 | 307 | 401 | 403;
  reason?:
    | "UNAUTHENTICATED"
    | "SURFACE_FORBIDDEN"
    | "SYSTEM_SUPER_ADMIN_ONLY"
    | "2FA_REQUIRED"
    | "REAUTH_REQUIRED";
  redirectTo?: string;
  suggestedSurface?: SurfaceId;
  suggestedSurfaceUrl?: string;
}

/**
 * Evaluates whether a request is permitted on a given surface & pathname.
 * Default-deny for all staff surfaces (`teach`, `admin`, `system`).
 */
export function evaluateSurfaceAccess(input: SurfaceGuardInput): SurfaceGuardDecision {
  const { surface, pathname, role, isAuthenticated, is2FAVerified = true, lastReAuthAtMs } = input;

  // 1. Learner web surface allows guests and all authenticated users on public routes
  if (surface === "web") {
    return { allowed: true, status: 200 };
  }

  // 2. Staff surfaces require authentication
  if (!isAuthenticated || !role || role === "guest") {
    return {
      allowed: false,
      status: 307,
      reason: "UNAUTHENTICATED",
      redirectTo: `${getSurfaceUrl("web")}/auth?next=${encodeURIComponent(getSurfaceUrl(surface) + pathname)}`,
    };
  }

  // 3. System routes (/system/**) or system surface strictly require super_admin
  const isSystemPath = surface === "system" || pathname.startsWith("/system") || pathname.includes("/system/");
  if (isSystemPath && role !== "super_admin") {
    const suggested = getDefaultSurfaceForRole(role);
    return {
      allowed: false,
      status: 403,
      reason: "SYSTEM_SUPER_ADMIN_ONLY",
      suggestedSurface: suggested,
      suggestedSurfaceUrl: getSurfaceUrl(suggested),
    };
  }

  // 4. Verify role -> surface matrix
  if (!canAccessSurface(role, surface)) {
    const suggested = getDefaultSurfaceForRole(role);
    return {
      allowed: false,
      status: 403,
      reason: "SURFACE_FORBIDDEN",
      suggestedSurface: suggested,
      suggestedSurfaceUrl: getSurfaceUrl(suggested),
    };
  }

  // 5. Verify 2FA requirement for roles that mandate it (super_admin, admin, publisher, read_only)
  if (roleRequires2FA(role) && !is2FAVerified && !pathname.includes("/2fa")) {
    return {
      allowed: false,
      status: 307,
      reason: "2FA_REQUIRED",
      redirectTo: "/2fa",
    };
  }

  // 6. System area requires fresh re-authentication (<= 15 minutes)
  if (isSystemPath && lastReAuthAtMs !== undefined && !isReAuthFresh(lastReAuthAtMs)) {
    return {
      allowed: false,
      status: 403,
      reason: "REAUTH_REQUIRED",
      redirectTo: `${pathname}?reauth=1`,
    };
  }

  return { allowed: true, status: 200 };
}
