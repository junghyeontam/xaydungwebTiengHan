import { AdminRole, AdminPermission, RoleDefinition } from "./types";

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDefinition> = {
  super_admin: {
    id: "super_admin",
    name: "Super Administrator",
    nameVi: "Quản Trị Viên Tối Cao",
    badgeColor: "bg-red-500/15 text-red-600 border-red-500/30",
    descriptionEn: "Unrestricted system-wide control, integrations, and RBAC management",
    descriptionVi: "Toàn quyền quản trị hệ thống, phân quyền và cấu hình tích hợp",
    permissions: [
      "content.view", "content.create", "content.update", "content.delete", "content.approve", "content.publish",
      "learners.view", "learners.view_pii", "learners.update", "learners.delete",
      "orders.view", "orders.refund_propose", "orders.refund_approve",
      "revenue.view",
      "leads.view", "leads.create", "leads.update", "leads.delete",
      "marketing.view", "marketing.manage",
      "reports.view", "reports.export",
      "teaching.view", "teaching.create", "teaching.update", "teaching.delete", "teaching.submit", "teaching.analytics",
      "system.settings_edit", "system.manage_roles", "system.audit_view", "system.impersonate",
      // Legacy compatibility
      "content.read", "content.write", "content.review", "content.publish",
      "learners.read", "learners.write", "sales.read", "sales.manage",
      "marketing.read", "marketing.manage", "analytics.read", "users.manage",
      "content:read", "content:write", "content:publish",
      "learners:read", "learners:write", "crm:read", "crm:write",
      "settings:manage", "audit:read",
    ],
  },
  admin: {
    id: "admin",
    name: "Administrator",
    nameVi: "Quản Trị Viên Vận Hành",
    badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    descriptionEn: "Day-to-day operations: approve content, manage staff & learners, process refunds",
    descriptionVi: "Vận hành hàng ngày: duyệt xuất bản, quản lý học viên, hoàn tiền và doanh thu",
    permissions: [
      "content.view", "content.create", "content.update", "content.approve", "content.publish",
      "learners.view", "learners.view_pii", "learners.update",
      "orders.view", "orders.refund_propose", "orders.refund_approve",
      "revenue.view",
      "leads.view", "leads.create", "leads.update",
      "marketing.view", "marketing.manage",
      "reports.view", "reports.export",
      "teaching.view", "teaching.create", "teaching.update", "teaching.delete", "teaching.submit", "teaching.analytics",
      "system.manage_roles", "system.audit_view",
      // Legacy compatibility
      "content.read", "content.write", "content.review", "content.publish",
      "learners.read", "learners.write", "sales.read", "sales.manage",
      "marketing.read", "marketing.manage", "analytics.read",
      "content:read", "content:write", "content:publish",
      "learners:read", "learners:write", "crm:read", "crm:write", "audit:read",
    ],
  },
  content_editor: {
    id: "content_editor",
    name: "Content Editor",
    nameVi: "Biên Tập Viên Nội Dung",
    badgeColor: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    descriptionEn: "Draft lessons, vocabulary and roadmap curriculum; cannot publish directly",
    descriptionVi: "Soạn thảo bài học, từ vựng và lộ trình; không được tự duyệt hoặc xuất bản",
    permissions: [
      "content.view", "content.create", "content.update",
      "teaching.view", "teaching.create", "teaching.update", "teaching.delete", "teaching.submit",
      // Legacy compatibility
      "content.read", "content.write", "content:read", "content:write",
    ],
  },
  publisher: {
    id: "publisher",
    name: "Publisher & Reviewer",
    nameVi: "Kiểm Duyệt & Xuất Bản",
    badgeColor: "bg-junghyeon-teal/15 text-junghyeon-teal border-junghyeon-teal/30",
    descriptionEn: "Review, approve and publish curriculum; cannot self-approve own drafts",
    descriptionVi: "Đánh giá, phê duyệt và xuất bản bài giảng; không được tự duyệt bài của chính mình",
    permissions: [
      "content.view", "content.create", "content.update", "content.approve", "content.publish",
      "teaching.view", "teaching.analytics",
      "system.audit_view",
      // Legacy compatibility
      "content.read", "content.write", "content.review", "content.publish",
      "content:read", "content:write", "content:publish", "audit:read",
    ],
  },
  teacher: {
    id: "teacher",
    name: "Teacher & Instructor",
    nameVi: "Giảng Viên",
    badgeColor: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
    descriptionEn: "Author curriculum within assigned scope, track student progress for own classes",
    descriptionVi: "Biên soạn giáo trình trong phạm vi phụ trách, theo dõi học viên và bài giảng",
    permissions: [
      "content.view", "learners.view",
      "teaching.view", "teaching.create", "teaching.update", "teaching.delete", "teaching.submit", "teaching.analytics",
      "leads.view", "leads.update",
      "reports.view",
      // Legacy compatibility
      "content.read", "learners.read", "content:read", "learners:read", "analytics.read",
    ],
  },
  sales_crm: {
    id: "sales_crm",
    name: "Sales & CRM",
    nameVi: "Tư Vấn & Tuyển Sinh",
    badgeColor: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    descriptionEn: "Consult prospective learners, track orders and propose refunds",
    descriptionVi: "Tiếp nhận học viên mới, quản lý đơn hàng và đề xuất hoàn tiền",
    permissions: [
      "content.view", "learners.view",
      "orders.view", "orders.refund_propose",
      "revenue.view",
      "leads.view", "leads.create", "leads.update", "leads.delete",
      "marketing.view", "reports.view", "reports.export",
      // Legacy compatibility
      "sales.read", "sales.manage", "learners.read",
      "crm:read", "crm:write", "analytics.read",
    ],
  },
  support_agent: {
    id: "support_agent",
    name: "Support Agent",
    nameVi: "Chuyên Viên Hỗ Trợ",
    badgeColor: "bg-sky-500/15 text-sky-600 border-sky-500/30",
    descriptionEn: "Handle student tickets and view contact info to troubleshoot; no financial access",
    descriptionVi: "Hỗ trợ học viên, xem thông tin liên hệ để xử lý sự cố; không xem doanh thu",
    permissions: [
      "content.view", "learners.view", "learners.view_pii",
      "orders.view", "leads.view", "leads.update",
      "marketing.view", "reports.view",
      // Legacy compatibility
      "learners.read", "learners.write", "content.read", "sales.read",
      "learners:read", "crm:read",
    ],
  },
  marketing: {
    id: "marketing",
    name: "Marketing & Growth",
    nameVi: "Tiếp Thị & Tăng Trưởng",
    badgeColor: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    descriptionEn: "Create discount coupons, promotional banners and track campaign funnels",
    descriptionVi: "Quản lý mã giảm giá, banner thông báo và theo dõi hiệu quả chiến dịch",
    permissions: [
      "content.view", "learners.view",
      "marketing.view", "marketing.manage",
      "reports.view", "reports.export",
      // Legacy compatibility
      "marketing.read", "marketing.manage", "marketing:manage",
      "analytics.read", "content.read",
    ],
  },
  read_only: {
    id: "read_only",
    name: "Auditor & Observer",
    nameVi: "Quan Sát Viên",
    badgeColor: "bg-gray-500/15 text-gray-600 border-gray-500/30",
    descriptionEn: "Read-only access to aggregated stats and audit logs; all sensitive PII masked",
    descriptionVi: "Chỉ xem thống kê và nhật ký kiểm toán; thông tin nhạy cảm và PII được ẩn",
    permissions: [
      "content.view", "learners.view", "orders.view",
      "leads.view", "marketing.view", "reports.view",
      // Legacy compatibility
      "content.read", "learners.read", "sales.read", "marketing.read",
      "analytics.read", "content:read",
    ],
  },

  // Legacy mappings for backwards-compatibility
  sales_lead: {
    id: "sales_lead",
    name: "Sales & Admissions",
    nameVi: "Tư Vấn & Tuyển Sinh",
    badgeColor: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    descriptionEn: "Legacy alias for Sales & CRM",
    descriptionVi: "Tên cũ của Tư vấn & Tuyển sinh",
    permissions: [
      "content.view", "learners.view", "orders.view", "orders.refund_propose",
      "revenue.view", "leads.view", "leads.create", "leads.update", "leads.delete",
      "marketing.view", "reports.view", "reports.export",
      "sales.read", "sales.manage", "learners.read", "crm:read", "crm:write", "analytics.read",
    ],
  },
  counselor: {
    id: "counselor",
    name: "Counselor",
    nameVi: "Tư Vấn Viên",
    badgeColor: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    descriptionEn: "Legacy alias for Sales & CRM",
    descriptionVi: "Tên cũ của Tư vấn viên",
    permissions: [
      "content.view", "learners.view", "orders.view", "orders.refund_propose",
      "revenue.view", "leads.view", "leads.create", "leads.update",
      "crm:read", "crm:write", "sales.read",
    ],
  },
  marketer: {
    id: "marketer",
    name: "Marketing Specialist",
    nameVi: "Chuyên Viên Marketing",
    badgeColor: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    descriptionEn: "Legacy alias for Marketing & Growth",
    descriptionVi: "Tên cũ của Chuyên viên Marketing",
    permissions: [
      "content.view", "learners.view", "marketing.view", "marketing.manage",
      "reports.view", "reports.export",
      "marketing.read", "marketing.manage", "marketing:manage", "analytics.read",
    ],
  },
  support: {
    id: "support",
    name: "Customer Support",
    nameVi: "Hỗ Trợ Học Viên",
    badgeColor: "bg-sky-500/15 text-sky-600 border-sky-500/30",
    descriptionEn: "Legacy alias for Support Agent",
    descriptionVi: "Tên cũ của Chuyên viên Hỗ trợ",
    permissions: [
      "content.view", "learners.view", "learners.view_pii", "orders.view", "leads.view", "leads.update",
      "learners.read", "learners.write", "crm:read",
    ],
  },
  readonly: {
    id: "readonly",
    name: "Read-only Observer",
    nameVi: "Chỉ Xem",
    badgeColor: "bg-gray-500/15 text-gray-600 border-gray-500/30",
    descriptionEn: "Legacy alias for Read-only Observer",
    descriptionVi: "Tên cũ của Quan sát viên",
    permissions: [
      "content.view", "learners.view", "orders.view", "leads.view", "marketing.view", "reports.view",
      "content.read", "learners.read", "sales.read", "marketing.read", "analytics.read",
    ],
  },
};

// Aliases mapping canonical equivalents
const PERMISSION_EQUIVALENTS: Record<string, string[]> = {
  "content.view": ["content.view", "content.read", "content:read"],
  "content.create": ["content.create", "content.write", "content:write"],
  "content.update": ["content.update", "content.write", "content:write"],
  "content.delete": ["content.delete"],
  "content.approve": ["content.approve", "content.review"],
  "content.publish": ["content.publish", "content:publish"],
  "learners.view": ["learners.view", "learners.read", "learners:read"],
  "learners.view_pii": ["learners.view_pii"],
  "learners.update": ["learners.update", "learners.write", "learners:write"],
  "learners.delete": ["learners.delete"],
  "orders.view": ["orders.view", "sales.read"],
  "orders.refund_propose": ["orders.refund_propose", "sales.manage"],
  "orders.refund_approve": ["orders.refund_approve"],
  "revenue.view": ["revenue.view"],
  "leads.view": ["leads.view", "crm:read"],
  "leads.create": ["leads.create", "crm:write"],
  "leads.update": ["leads.update", "crm:write"],
  "leads.delete": ["leads.delete"],
  "marketing.view": ["marketing.view", "marketing.read"],
  "marketing.manage": ["marketing.manage", "marketing:manage"],
  "reports.view": ["reports.view", "analytics.read", "analytics:read"],
  "reports.export": ["reports.export"],
  "system.settings_edit": ["system.settings_edit", "settings:manage"],
  "system.manage_roles": ["system.manage_roles", "users.manage"],
  "system.audit_view": ["system.audit_view", "audit:read"],
  "system.impersonate": ["system.impersonate"],
};

export function hasPermission(
  userPermissions: (AdminPermission | string)[] | undefined,
  required: AdminPermission | AdminPermission[]
): boolean {
  if (!userPermissions) return false;
  const list = Array.isArray(required) ? required : [required];
  return list.every((req) => {
    // Direct match
    if (userPermissions.includes(req)) return true;
    // Check synonyms/equivalents
    const equivalents = PERMISSION_EQUIVALENTS[req] || [];
    return equivalents.some((eq) => userPermissions.includes(eq));
  });
}

export function hasAnyPermission(
  userPermissions: (AdminPermission | string)[] | undefined,
  required: AdminPermission[]
): boolean {
  if (!userPermissions) return false;
  return required.some((req) => hasPermission(userPermissions, req));
}

export function hasAllPermissions(
  userPermissions: (AdminPermission | string)[] | undefined,
  required: AdminPermission[]
): boolean {
  return hasPermission(userPermissions, required);
}

export function getRoleDefinition(role: AdminRole): RoleDefinition {
  return ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.super_admin;
}

export function formatRoleLabel(role: AdminRole, locale: "vi" | "en" = "vi"): string {
  const def = getRoleDefinition(role);
  return locale === "en" ? def.name : def.nameVi;
}
