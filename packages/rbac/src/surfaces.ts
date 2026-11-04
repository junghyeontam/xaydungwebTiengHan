import type { CanonicalRole } from "./registry";
import type { SurfaceId } from "@junghyeon/config";

export type LearnerOrStaffRole = CanonicalRole | "learner" | "guest";

export interface SurfacePolicy {
  role: LearnerOrStaffRole;
  allowedSurfaces: readonly SurfaceId[];
  defaultSurface: SurfaceId;
  requires2FA: boolean;
  requiresReAuthOnSystem: boolean;
}

/**
 * Canonical Role -> Surface Access Matrix (Default-Deny)
 * Any role not explicitly permitted on a surface receives HTTP 403.
 */
export const ROLE_SURFACE_MATRIX: Record<LearnerOrStaffRole, SurfacePolicy> = {
  guest: {
    role: "guest",
    allowedSurfaces: ["web"],
    defaultSurface: "web",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  learner: {
    role: "learner",
    allowedSurfaces: ["web"],
    defaultSurface: "web",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  teacher: {
    role: "teacher",
    allowedSurfaces: ["web", "teach"],
    defaultSurface: "teach",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  content_editor: {
    role: "content_editor",
    allowedSurfaces: ["web", "teach"],
    defaultSurface: "teach",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  publisher: {
    role: "publisher",
    allowedSurfaces: ["web", "teach"],
    defaultSurface: "teach",
    requires2FA: true,
    requiresReAuthOnSystem: false,
  },
  sales_crm: {
    role: "sales_crm",
    allowedSurfaces: ["web", "admin"],
    defaultSurface: "admin",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  support_agent: {
    role: "support_agent",
    allowedSurfaces: ["web", "admin"],
    defaultSurface: "admin",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  marketing: {
    role: "marketing",
    allowedSurfaces: ["web", "admin"],
    defaultSurface: "admin",
    requires2FA: false,
    requiresReAuthOnSystem: false,
  },
  read_only: {
    role: "read_only",
    allowedSurfaces: ["web", "admin"],
    defaultSurface: "admin",
    requires2FA: true,
    requiresReAuthOnSystem: false,
  },
  admin: {
    role: "admin",
    allowedSurfaces: ["web", "teach", "admin"],
    defaultSurface: "admin",
    requires2FA: true,
    requiresReAuthOnSystem: false,
  },
  super_admin: {
    role: "super_admin",
    allowedSurfaces: ["web", "teach", "admin", "system"],
    defaultSurface: "admin",
    requires2FA: true,
    requiresReAuthOnSystem: true,
  },
};

export function canAccessSurface(
  role: string | null | undefined,
  surface: SurfaceId
): boolean {
  const normalizedRole = (role || "guest") as LearnerOrStaffRole;
  const policy = ROLE_SURFACE_MATRIX[normalizedRole];
  if (!policy) {
    return surface === "web";
  }
  return policy.allowedSurfaces.includes(surface);
}

export function getDefaultSurfaceForRole(role: string | null | undefined): SurfaceId {
  const normalizedRole = (role || "guest") as LearnerOrStaffRole;
  return ROLE_SURFACE_MATRIX[normalizedRole]?.defaultSurface ?? "web";
}

export function getAccessibleSurfaces(role: string | null | undefined): readonly SurfaceId[] {
  const normalizedRole = (role || "guest") as LearnerOrStaffRole;
  return ROLE_SURFACE_MATRIX[normalizedRole]?.allowedSurfaces ?? ["web"];
}

export function roleRequires2FA(role: string | null | undefined): boolean {
  const normalizedRole = (role || "guest") as LearnerOrStaffRole;
  return ROLE_SURFACE_MATRIX[normalizedRole]?.requires2FA ?? false;
}
