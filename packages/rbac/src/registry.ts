/**
 * ==============================================================================
 * JUNGHYEON RBAC V2 - CANONICAL PERMISSION REGISTRY
 * Source of truth for roles, permissions, capabilities and danger lists.
 * Enforces DEFAULT-DENY everywhere.
 * ==============================================================================
 */

export type CanonicalRole =
  | "super_admin"
  | "admin"
  | "content_editor"
  | "publisher"
  | "teacher"
  | "sales_crm"
  | "support_agent"
  | "marketing"
  | "read_only";

export interface RoleMetadata {
  id: CanonicalRole;
  labelEn: string;
  labelVi: string;
  descriptionEn: string;
  descriptionVi: string;
  badgeClass: string;
  hierarchyLevel: number; // Higher number = higher authority
}

export const ROLE_METADATA: Record<CanonicalRole, RoleMetadata> = {
  super_admin: {
    id: "super_admin",
    labelEn: "Super Administrator",
    labelVi: "Quản trị tối cao",
    descriptionEn: "Unrestricted system-wide control, security governance and RBAC matrix management",
    descriptionVi: "Toàn quyền quản trị hệ thống, phân quyền, cấu hình tích hợp và bảo mật tối cao",
    badgeClass: "bg-red-500/15 text-red-600 border-red-500/30",
    hierarchyLevel: 100,
  },
  admin: {
    id: "admin",
    labelEn: "Operations Administrator",
    labelVi: "Quản trị vận hành",
    descriptionEn: "Day-to-day operations: approve content, review refunds, manage staff & learners",
    descriptionVi: "Vận hành hàng ngày: duyệt xuất bản, kiểm tra hoàn tiền, quản lý học viên và nhân sự",
    badgeClass: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    hierarchyLevel: 80,
  },
  content_editor: {
    id: "content_editor",
    labelEn: "Content Editor",
    labelVi: "Biên tập viên",
    descriptionEn: "Author lesson drafts, grammar points, and vocabulary sets; cannot publish directly",
    descriptionVi: "Biên soạn bài giảng, từ vựng và cấu trúc ngữ pháp; không có quyền tự xuất bản",
    badgeClass: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    hierarchyLevel: 40,
  },
  publisher: {
    id: "publisher",
    labelEn: "Publisher & Reviewer",
    labelVi: "Kiểm duyệt viên",
    descriptionEn: "Review submissions, provide feedback, approve and schedule lesson publications",
    descriptionVi: "Đánh giá chất lượng, phản hồi biên tập và phê duyệt xuất bản giáo trình",
    badgeClass: "bg-teal-500/15 text-teal-700 border-teal-500/30",
    hierarchyLevel: 50,
  },
  teacher: {
    id: "teacher",
    labelEn: "Instructor & Teacher",
    labelVi: "Giảng viên",
    descriptionEn: "Manage curriculum within assigned scope and track learners in assigned classes",
    descriptionVi: "Giảng dạy, theo dõi tiến độ học viên theo lớp phụ trách và soạn học liệu",
    badgeClass: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
    hierarchyLevel: 40,
  },
  sales_crm: {
    id: "sales_crm",
    labelEn: "Sales & Admissions",
    labelVi: "Tư vấn & Tuyển sinh",
    descriptionEn: "Consult prospects, manage sales pipeline, view orders and propose refund requests",
    descriptionVi: "Tư vấn học viên mới, quản lý phễu tuyển sinh, theo dõi đơn hàng và đề xuất hoàn tiền",
    badgeClass: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    hierarchyLevel: 40,
  },
  support_agent: {
    id: "support_agent",
    labelEn: "Support Specialist",
    labelVi: "Chuyên viên hỗ trợ",
    descriptionEn: "Resolve student tickets and lookup learner profiles directly; zero financial access",
    descriptionVi: "Giải quyết sự cố học viên, tra cứu tài khoản; không truy cập đơn hàng & doanh thu",
    badgeClass: "bg-sky-500/15 text-sky-700 border-sky-500/30",
    hierarchyLevel: 30,
  },
  marketing: {
    id: "marketing",
    labelEn: "Marketing & Growth",
    labelVi: "Tiếp thị & Growth",
    descriptionEn: "Manage discount coupons, banner campaigns, and analyze aggregate acquisition funnels",
    descriptionVi: "Quản lý mã giảm giá, banner quảng bá và theo dõi phễu tăng trưởng tổng hợp",
    badgeClass: "bg-purple-500/15 text-purple-700 border-purple-500/30",
    hierarchyLevel: 40,
  },
  read_only: {
    id: "read_only",
    labelEn: "Auditor & Observer",
    labelVi: "Quan sát viên",
    descriptionEn: "Read-only aggregate metrics for audit; sensitive PII and revenue details masked",
    descriptionVi: "Chỉ xem số liệu thống kê tổng hợp; thông tin nhạy cảm và doanh thu được ẩn",
    badgeClass: "bg-slate-500/15 text-slate-700 border-slate-500/30",
    hierarchyLevel: 10,
  },
};

/**
 * ==============================================================================
 * GRANULAR CAPABILITIES & SPECIAL ACTIONS
 * ==============================================================================
 */
export type Capability =
  | "view_pii" // See unmasked contact info (email, phone, address)
  | "reveal_pii" // Temporarily reveal masked PII with reason prompt & audit logging
  | "view_revenue" // View exact monetary currency amounts and revenue dashboards
  | "view_order_counts" // View order volume badges/titles (e.g. "142 Orders this month")
  | "view_segment_counts" // View breakdown counts of VIP/Trial/Expired plans
  | "propose_refund" // Sales/Support propose a refund request for an order
  | "flag_refund" // Support flag billing issue to billing review queue
  | "approve_refund" // Admin approve refund request (Two-Person rule)
  | "manage_roles" // Modify role definitions or permissions (DANGER)
  | "manage_integrations" // Configure PayOS, SePay, Supabase, OAuth keys (DANGER)
  | "manage_payment_keys" // View or update payment gateway secrets (DANGER)
  | "manage_feature_flags" // Toggle platform feature flags (DANGER)
  | "maintenance_mode" // Put system in maintenance mode (DANGER)
  | "backups" // Trigger manual database backups or restores (DANGER)
  | "impersonate" // Impersonate another staff member for troubleshooting (DANGER)
  | "view_security_audit" // View security authentication logs and IP access (DANGER)
  | "delete_permanent" // Hard delete learners or content (DANGER)
  | "bulk_export_pii" // Bulk CSV export with unmasked learner PII (DANGER)
  | "publish" // Publish lesson directly to production roadmap
  | "approve" // Formally approve content draft
  | "reorder_roadmap" // Move roadmap node sequence
  | "request_progress_reset"; // Reset learner progress on curriculum overhaul

/**
 * DANGER LIST: Restricted to super_admin ONLY.
 * Cannot be assigned to any custom role or delegated to other staff.
 */
export const DANGER_CAPABILITIES: readonly Capability[] = [
  "manage_roles",
  "manage_integrations",
  "manage_payment_keys",
  "manage_feature_flags",
  "maintenance_mode",
  "backups",
  "impersonate",
  "view_security_audit",
  "delete_permanent",
  "bulk_export_pii",
] as const;

/**
 * Standard Resources and Actions
 */
export type RbacResource =
  | "content"
  | "teaching"
  | "learners"
  | "orders"
  | "leads"
  | "marketing"
  | "analytics"
  | "system";

export type RbacAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "approve"
  | "export";

export type StandardPermission = `${RbacResource}.${RbacAction}`;

export type RbacPermission = StandardPermission | Capability;

/**
 * ==============================================================================
 * CANONICAL SEEDED PERMISSION MATRIX (Source of Truth)
 * Any permission NOT explicitly listed here for a role is strictly DENIED.
 * ==============================================================================
 */
export const ROLE_PERMISSION_MATRIX: Record<CanonicalRole, readonly RbacPermission[]> = {
  super_admin: [
    // Standard Resources
    "content.view", "content.create", "content.update", "content.delete", "content.approve", "content.publish", "content.export",
    "teaching.view", "teaching.create", "teaching.update", "teaching.delete", "teaching.approve", "teaching.publish", "teaching.export",
    "learners.view", "learners.create", "learners.update", "learners.delete", "learners.export",
    "orders.view", "orders.create", "orders.update", "orders.delete", "orders.approve", "orders.export",
    "leads.view", "leads.create", "leads.update", "leads.delete", "leads.export",
    "marketing.view", "marketing.create", "marketing.update", "marketing.delete", "marketing.export",
    "analytics.view", "analytics.export",
    "system.view", "system.update", "system.delete",
    // All Capabilities including Danger List
    "view_pii", "reveal_pii", "view_revenue", "view_order_counts", "view_segment_counts",
    "propose_refund", "flag_refund", "approve_refund",
    "manage_roles", "manage_integrations", "manage_payment_keys", "manage_feature_flags",
    "maintenance_mode", "backups", "impersonate", "view_security_audit", "delete_permanent",
    "bulk_export_pii", "publish", "approve", "reorder_roadmap", "request_progress_reset",
  ],

  admin: [
    // Content & Teaching
    "content.view", "content.create", "content.update", "content.approve", "content.publish", "content.export",
    "teaching.view", "teaching.create", "teaching.update", "teaching.approve", "teaching.publish",
    // Learners (operational)
    "learners.view", "learners.create", "learners.update", "learners.export",
    // Orders & Financial (can review and approve refunds)
    "orders.view", "orders.update", "orders.approve", "orders.export",
    // Leads
    "leads.view", "leads.create", "leads.update", "leads.export",
    // Marketing & Analytics
    "marketing.view", "marketing.create", "marketing.update", "marketing.export",
    "analytics.view", "analytics.export",
    // System (read basic status only, no Danger keys)
    "system.view",
    // Allowed Capabilities
    "view_pii", "reveal_pii", "view_revenue", "view_order_counts", "view_segment_counts",
    "approve_refund", "propose_refund", "flag_refund",
    "publish", "approve", "reorder_roadmap",
    // NOTE: Explicitly NO DANGER LIST items!
  ],

  content_editor: [
    "content.view", "content.create", "content.update",
    "teaching.view", "teaching.create", "teaching.update", "teaching.delete",
    "analytics.view",
    // NO publish, NO approve, NO learner PII, NO orders, NO revenue
  ],

  publisher: [
    "content.view", "content.create", "content.update", "content.approve", "content.publish",
    "teaching.view", "teaching.approve", "teaching.publish",
    "analytics.view",
    "publish", "approve", "reorder_roadmap",
    // NO orders, NO revenue, NO learner PII
  ],

  teacher: [
    "content.view", // read-only reference of published curriculum
    "teaching.view", "teaching.create", "teaching.update", "teaching.delete",
    "learners.view", // Scope: own classes ONLY
    "analytics.view", // Scope: own classes ONLY
    // NO orders, NO revenue, NO global content publishing
  ],

  sales_crm: [
    "leads.view", "leads.create", "leads.update", "leads.export",
    "orders.view", // Scope: assigned leads and pipeline orders
    "learners.view", // Scope: enrolled learners from own sales
    "marketing.view", // promotions & discount codes
    "analytics.view", // personal sales performance
    // Capabilities
    "view_revenue",
    "view_order_counts",
    "view_segment_counts",
    "propose_refund", // Can PROPOSE refund, CANNOT approve refund
    // NO publish, NO system settings, NO approve_refund
  ],

  support_agent: [
    // Support Agent only looks up specific learner by ticket/email/phone (No browse directory!)
    "learners.view", // Exact match lookup required by field policy
    "leads.view", // View support consultation tickets
    "leads.update", // Update ticket resolution status
    // Capabilities
    "view_pii", // Masked by default; reveal_pii prompt available
    "reveal_pii",
    "flag_refund", // Creates a billing review ticket for Admin, CANNOT execute or see full orders page
    // STRICTLY DENIED:
    // NO orders.view (No /admin/sales/orders access)
    // NO view_revenue (No monetary amount figures)
    // NO view_order_counts (No "142 Orders this month" metric)
    // NO view_segment_counts (No plan counts)
    // NO content editing
  ],

  marketing: [
    "marketing.view", "marketing.create", "marketing.update", "marketing.delete", "marketing.export",
    "analytics.view",
    // Capabilities
    "view_segment_counts", // Aggregated plan statistics only
    // NO individual learner PII, NO orders table browsing
  ],

  read_only: [
    "content.view",
    "analytics.view", // Scoped to aggregated metrics with min sample size >= 10
    // ZERO mutation permissions, ZERO PII, ZERO financial details
  ],
};

/**
 * ==============================================================================
 * SECURITY EVALUATION FUNCTIONS (Default-Deny)
 * ==============================================================================
 */

/**
 * Check if a role possesses a specific permission or capability.
 * Returns false by default if role or permission is unknown.
 */
export function hasPermission(
  role: CanonicalRole | string | null | undefined,
  permission: RbacPermission | string
): boolean {
  if (!role || !(role in ROLE_PERMISSION_MATRIX)) {
    return false;
  }
  const allowedPermissions = ROLE_PERMISSION_MATRIX[role as CanonicalRole];
  return allowedPermissions.includes(permission as RbacPermission);
}

/**
 * Check if a capability belongs to the DANGER LIST.
 */
export function isDangerCapability(cap: Capability | string): boolean {
  return (DANGER_CAPABILITIES as readonly string[]).includes(cap);
}

/**
 * Privilege Escalation Guard:
 * Verify if granterRole has sufficient authority to grant targetRole or permission.
 * - Nobody can grant a permission they do not hold.
 * - Only super_admin can grant DANGER permissions.
 * - Admin can only invite or grant roles with lower hierarchy level than admin.
 */
export function canGrantPermission(
  granterRole: CanonicalRole,
  permissionToGrant: RbacPermission
): boolean {
  if (granterRole !== "super_admin") {
    if (isDangerCapability(permissionToGrant)) {
      return false; // Only super_admin can touch danger capabilities
    }
  }
  return hasPermission(granterRole, permissionToGrant);
}

export function canManageRole(
  actorRole: CanonicalRole,
  targetRole: CanonicalRole
): boolean {
  if (actorRole === "super_admin") return true;
  const actorLevel = ROLE_METADATA[actorRole]?.hierarchyLevel || 0;
  const targetLevel = ROLE_METADATA[targetRole]?.hierarchyLevel || 0;
  // An actor can only manage roles strictly strictly below their hierarchy level
  return actorLevel > targetLevel;
}

/**
 * Formatter for human-readable role badge
 */
export function formatRoleLabel(
  role: CanonicalRole | string | null | undefined,
  locale: "vi" | "en" = "vi"
): string {
  if (!role || !(role in ROLE_METADATA)) {
    return locale === "vi" ? "Người dùng chưa định danh" : "Unidentified User";
  }
  const meta = ROLE_METADATA[role as CanonicalRole];
  return locale === "vi" ? meta.labelVi : meta.labelEn;
}
