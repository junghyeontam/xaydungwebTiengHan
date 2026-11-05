import {
  type AdminRole,
  type AdminPermission,
  hasLegacyPermission as hasPermission,
  getRoleDefinition,
} from "@junghyeon/rbac";
import type { AdminUserSession } from "@junghyeon/db";

export type AuthErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "TWO_PERSON_RULE_VIOLATION"
  | "ROLE_ESCALATION_BLOCKED"
  | "INVALID_INPUT";

export interface PermissionCheckResult {
  authorized: boolean;
  code?: AuthErrorCode;
  error?: string;
  role?: AdminRole;
}

export interface DualControlContext {
  authorEmail?: string;
  approverEmail?: string;
  targetRole?: AdminRole;
  currentRole?: AdminRole;
}

/**
 * Validates permission server-side for any admin action.
 * Enforces dual-control separation of duties and role escalation bounds.
 */
export function checkPermission(
  userOrRole: AdminUserSession | AdminRole | null | undefined,
  resource: string,
  action: string,
  context?: DualControlContext
): PermissionCheckResult {
  if (!userOrRole) {
    return {
      authorized: false,
      code: "UNAUTHORIZED",
      error: "Authentication required. No active administrative session.",
    };
  }

  const role: AdminRole =
    typeof userOrRole === "string" ? userOrRole : userOrRole.role;
  const permissions: AdminPermission[] =
    typeof userOrRole === "object" && userOrRole.permissions
      ? userOrRole.permissions
      : getRoleDefinition(role).permissions;

  const targetPerm = `${resource}.${action}` as AdminPermission;

  // 1. Role permission verification
  const isAllowed = hasPermission(permissions, targetPerm);
  if (!isAllowed) {
    return {
      authorized: false,
      code: "FORBIDDEN",
      error: `Access denied. Role '${role}' lacks permission '${resource}.${action}'.`,
      role,
    };
  }

  // 2. Separation of duties (Two-Person Rule): Authors cannot approve or publish their own drafts
  if (resource === "content" && (action === "approve" || action === "publish")) {
    if (
      context?.authorEmail &&
      context?.approverEmail &&
      context.authorEmail.toLowerCase().trim() === context.approverEmail.toLowerCase().trim()
    ) {
      return {
        authorized: false,
        code: "TWO_PERSON_RULE_VIOLATION",
        error: "Two-person rule violation: The author cannot approve or publish their own content draft.",
        role,
      };
    }
  }

  // 3. Prevent privilege escalation: Admin cannot assign admin or super_admin
  if (resource === "system" && action === "manage_roles") {
    if (role === "admin" && context?.targetRole) {
      const forbiddenRoles: AdminRole[] = ["admin", "super_admin"];
      if (forbiddenRoles.includes(context.targetRole)) {
        return {
          authorized: false,
          code: "ROLE_ESCALATION_BLOCKED",
          error: "Permission denied: Administrators cannot grant or revoke Administrator or Super Administrator roles.",
          role,
        };
      }
    }
  }

  return { authorized: true, role };
}

/**
 * Throwing wrapper for server actions or API routes
 */
export function assertPermission(
  userOrRole: AdminUserSession | AdminRole | null | undefined,
  resource: string,
  action: string,
  context?: DualControlContext
): void {
  const result = checkPermission(userOrRole, resource, action, context);
  if (!result.authorized) {
    const error = new Error(result.error || "Permission denied");
    (error as any).code = result.code;
    (error as any).status = result.code === "UNAUTHORIZED" ? 401 : 403;
    throw error;
  }
}

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const ContentPublishSchema = {
  safeParse(data: any): SchemaValidationResult<{
    lessonId: string;
    slug: string;
    targetStatus: string;
  }> {
    if (!data?.lessonId || typeof data.lessonId !== "string") {
      return { success: false, error: "Lesson ID is required" };
    }
    if (!data?.slug || typeof data.slug !== "string") {
      return { success: false, error: "Lesson slug is required" };
    }
    const validStatuses = ["published", "archived", "draft", "in_review"];
    if (!validStatuses.includes(data?.targetStatus)) {
      return { success: false, error: "Invalid targetStatus" };
    }
    return { success: true, data };
  },
};

export const RefundProposeSchema = {
  safeParse(data: any): SchemaValidationResult<{
    orderId: string;
    amount: number;
    reason: string;
  }> {
    if (!data?.orderId || typeof data.orderId !== "string") {
      return { success: false, error: "Order ID is required" };
    }
    if (typeof data?.amount !== "number" || data.amount <= 0) {
      return { success: false, error: "Refund amount must be positive" };
    }
    if (!data?.reason || typeof data.reason !== "string" || data.reason.trim().length < 5) {
      return { success: false, error: "Reason must be at least 5 characters" };
    }
    return { success: true, data };
  },
};

export const RefundApproveSchema = {
  safeParse(data: any): SchemaValidationResult<{
    orderId: string;
    refundId: string;
  }> {
    if (!data?.orderId) return { success: false, error: "Order ID is required" };
    if (!data?.refundId) return { success: false, error: "Refund ID is required" };
    return { success: true, data };
  },
};

export const RoleAssignmentSchema = {
  safeParse(data: any): SchemaValidationResult<{
    staffUserId: string;
    newRole: AdminRole;
    reason: string;
  }> {
    if (!data?.staffUserId) return { success: false, error: "Staff User ID is required" };
    if (!data?.reason || data.reason.length < 5) {
      return { success: false, error: "Change reason must be provided (min 5 chars)" };
    }
    return { success: true, data };
  },
};
