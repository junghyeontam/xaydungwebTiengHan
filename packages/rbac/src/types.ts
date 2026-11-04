export type CanonicalAdminRole =
  | "super_admin"
  | "admin"
  | "content_editor"
  | "publisher"
  | "teacher"
  | "sales_crm"
  | "support_agent"
  | "marketing"
  | "read_only";

// Support legacy aliases to ensure full backward compatibility
export type LegacyAdminRole =
  | "sales_lead"
  | "counselor"
  | "marketer"
  | "support"
  | "readonly";

export type AdminRole = CanonicalAdminRole | LegacyAdminRole;

export type CanonicalAdminPermission =
  // Content
  | "content.view"
  | "content.create"
  | "content.update"
  | "content.delete"
  | "content.approve"
  | "content.publish"
  // Learners
  | "learners.view"
  | "learners.view_pii"
  | "learners.update"
  | "learners.delete"
  // Orders & Financial
  | "orders.view"
  | "orders.refund_propose"
  | "orders.refund_approve"
  | "revenue.view"
  // Leads & CRM
  | "leads.view"
  | "leads.create"
  | "leads.update"
  | "leads.delete"
  // Marketing
  | "marketing.view"
  | "marketing.manage"
  // Reports
  | "reports.view"
  | "reports.export"
  // Teacher Studio
  | "teaching.view"
  | "teaching.create"
  | "teaching.update"
  | "teaching.delete"
  | "teaching.submit"
  | "teaching.analytics"
  // System
  | "system.settings_edit"
  | "system.manage_roles"
  | "system.audit_view"
  | "system.impersonate";

export type LegacyAdminPermission =
  | "content.read"
  | "content.write"
  | "content.review"
  | "learners.read"
  | "learners.write"
  | "sales.read"
  | "sales.manage"
  | "marketing.read"
  | "analytics.read"
  | "users.manage"
  | "content:read"
  | "content:write"
  | "content:publish"
  | "learners:read"
  | "learners:write"
  | "crm:read"
  | "crm:write"
  | "marketing:manage"
  | "analytics:read"
  | "settings:manage"
  | "audit:read";

export type AdminPermission = CanonicalAdminPermission | LegacyAdminPermission;

export interface RoleDefinition {
  id: AdminRole;
  name: string;
  nameVi: string;
  badgeColor: string;
  descriptionEn: string;
  descriptionVi: string;
  permissions: AdminPermission[];
}

export interface StaffMember {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  status: "active" | "invited" | "suspended" | "deactivated";
  is2faEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
}

export interface PermissionOverride {
  staffId: string;
  permissionId: AdminPermission;
  effect: "allow" | "deny";
}
