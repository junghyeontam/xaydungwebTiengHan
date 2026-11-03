"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lock,
  Search,
  Filter,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  ROLE_DEFINITIONS,
  formatRoleLabel,
  hasPermission,
} from "@/features/auth-rbac/permissions";
import { checkPermission } from "@/features/auth-rbac/require-permission";
import type { AdminRole, AdminPermission } from "@/features/auth-rbac/types";
import { usePathname } from "next/navigation";

interface PermissionRow {
  id: AdminPermission;
  resource: string;
  action: string;
  labelVi: string;
  labelEn: string;
  category: "content" | "learners" | "orders" | "leads" | "marketing" | "reports" | "system";
}

const CANONICAL_ROLES: AdminRole[] = [
  "super_admin",
  "admin",
  "content_editor",
  "publisher",
  "teacher",
  "sales_crm",
  "support_agent",
  "marketing",
  "read_only",
];

const PERMISSION_ROWS: PermissionRow[] = [
  // Content
  { id: "content.view", resource: "content", action: "view", labelVi: "Xem bài học & giáo trình", labelEn: "View lessons & curriculum", category: "content" },
  { id: "content.create", resource: "content", action: "create", labelVi: "Tạo bản nháp bài học", labelEn: "Create lesson drafts", category: "content" },
  { id: "content.update", resource: "content", action: "update", labelVi: "Chỉnh sửa bản nháp", labelEn: "Edit drafts & exercises", category: "content" },
  { id: "content.approve", resource: "content", action: "approve", labelVi: "Duyệt bản nháp (Dual-control)", labelEn: "Approve draft (Dual-control)", category: "content" },
  { id: "content.publish", resource: "content", action: "publish", labelVi: "Xuất bản & Rollback live", labelEn: "Publish & rollback live", category: "content" },
  { id: "content.delete", resource: "content", action: "delete", labelVi: "Xóa bài học / giáo trình", labelEn: "Delete lessons or nodes", category: "content" },

  // Learners
  { id: "learners.view", resource: "learners", action: "view", labelVi: "Xem danh sách học viên", labelEn: "View learner directory", category: "learners" },
  { id: "learners.view_pii", resource: "learners", action: "view_pii", labelVi: "Xem PII email & SĐT (Unmasked)", labelEn: "View unmasked email & phone", category: "learners" },
  { id: "learners.update", resource: "learners", action: "update", labelVi: "Cộng/trừ XP, streak học viên", labelEn: "Adjust XP, streak or status", category: "learners" },
  { id: "learners.delete", resource: "learners", action: "delete", labelVi: "Xóa tài khoản học viên", labelEn: "Delete learner account", category: "learners" },

  // Orders & Financial
  { id: "orders.view", resource: "orders", action: "view", labelVi: "Xem đơn hàng & gói VIP", labelEn: "View orders & packages", category: "orders" },
  { id: "orders.refund_propose", resource: "orders", action: "refund_propose", labelVi: "Đề xuất hoàn tiền", labelEn: "Propose refund request", category: "orders" },
  { id: "orders.refund_approve", resource: "orders", action: "refund_approve", labelVi: "Duyệt hoàn tiền (Dual-control)", labelEn: "Approve refund (Dual-control)", category: "orders" },
  { id: "revenue.view", resource: "revenue", action: "view", labelVi: "Xem số tiền & doanh thu", labelEn: "View exact revenue figures", category: "orders" },

  // Leads & CRM
  { id: "leads.view", resource: "leads", action: "view", labelVi: "Xem danh sách Leads tư vấn", labelEn: "View consultation leads", category: "leads" },
  { id: "leads.create", resource: "leads", action: "create", labelVi: "Tạo Lead tư vấn mới", labelEn: "Create new lead record", category: "leads" },
  { id: "leads.update", resource: "leads", action: "update", labelVi: "Cập nhật tiến độ chăm sóc", labelEn: "Update lead status & notes", category: "leads" },
  { id: "leads.delete", resource: "leads", action: "delete", labelVi: "Xóa Lead tư vấn", labelEn: "Delete lead record", category: "leads" },

  // Marketing
  { id: "marketing.view", resource: "marketing", action: "view", labelVi: "Xem danh sách coupon & banner", labelEn: "View coupons & banners", category: "marketing" },
  { id: "marketing.manage", resource: "marketing", action: "manage", labelVi: "Tạo, bật/tắt coupon & banner", labelEn: "Manage coupons & banners", category: "marketing" },

  // Reports
  { id: "reports.view", resource: "reports", action: "view", labelVi: "Xem báo cáo hiệu suất", labelEn: "View performance charts", category: "reports" },
  { id: "reports.export", resource: "reports", action: "export", labelVi: "Xuất dữ liệu CSV", labelEn: "Export reports to CSV", category: "reports" },

  // System
  { id: "system.settings_edit", resource: "system", action: "settings_edit", labelVi: "Cấu hình hệ thống & tính năng", labelEn: "Edit system config & flags", category: "system" },
  { id: "system.manage_roles", resource: "system", action: "manage_roles", labelVi: "Mời & phân quyền nhân sự", labelEn: "Invite staff & assign roles", category: "system" },
  { id: "system.audit_view", resource: "system", action: "audit_view", labelVi: "Xem nhật ký kiểm toán (Audit)", labelEn: "Inspect immutable audit logs", category: "system" },
  { id: "system.impersonate", resource: "system", action: "impersonate", labelVi: "Mạo danh học viên (15 phút)", labelEn: "Learner impersonation (15m)", category: "system" },
];

export default function AdminRolesMatrixPage() {
  const pathname = usePathname();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Simulator State
  const [testerRole, setTesterRole] = useState<AdminRole>("content_editor");
  const [testerAction, setTesterAction] = useState<string>("content.publish");
  const [testerAuthorEmail, setTesterAuthorEmail] = useState("editor@junghyeon.vn");
  const [testerApproverEmail, setTesterApproverEmail] = useState("reviewer@junghyeon.vn");
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    allowed: boolean;
    code?: string;
    message?: string;
  } | null>(null);

  const handleRunDryTest = () => {
    const [res, act] = testerAction.split(".");
    const resCheck = checkPermission(testerRole, res, act, {
      authorEmail: testerAuthorEmail,
      approverEmail: testerApproverEmail,
    });

    setTestResult({
      tested: true,
      allowed: resCheck.authorized,
      code: resCheck.code,
      message: resCheck.authorized
        ? `Thành công: Vai trò '${formatRoleLabel(testerRole, locale)}' được phép thực hiện hành động '${testerAction}'.`
        : resCheck.error || "Thao tác bị từ chối bởi chính sách RBAC.",
    });
  };

  const filteredPermissions = PERMISSION_ROWS.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (
      search &&
      !p.id.toLowerCase().includes(search.toLowerCase()) &&
      !p.labelVi.toLowerCase().includes(search.toLowerCase()) &&
      !p.labelEn.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Security & Access Control"
        title="Roles & Permissions Matrix"
        titleMuted="· 9 Canonical Roles · 26 Operations"
        description="Ma trận phân quyền chi tiết của Tiếng Hàn JungHyeon theo nguyên tắc đặc quyền tối thiểu (PoLP) và quy tắc kiểm soát kép (Dual Control Separation of Duties)."
      />

      {/* 1. Dry-run RBAC Tester Card */}
      <div className="p-5 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-admin-border pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-admin-brand-teal/15 text-admin-brand-teal">
              <Play className="w-4 h-4 fill-admin-brand-teal" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-admin-text-primary">
                {locale === "en" ? "Dry-run RBAC Permission Evaluator" : "Kiểm Thử Độc Lập Quyền Hạn (Dry-run Evaluator)"}
              </h3>
              <p className="text-[11px] text-admin-text-muted">
                {locale === "en"
                  ? "Test any role and action combination to preview middleware & API authorization decisions."
                  : "Mô phỏng tức thì quyết định phân quyền của Middleware, Server Actions và Supabase RLS."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
              {locale === "en" ? "Evaluate Role" : "Vai trò kiểm thử"}
            </label>
            <select
              value={testerRole}
              onChange={(e) => setTesterRole(e.target.value as AdminRole)}
              className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 font-medium"
            >
              {CANONICAL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {formatRoleLabel(r, locale)} ({r})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
              {locale === "en" ? "Target Operation" : "Hành động yêu cầu"}
            </label>
            <select
              value={testerAction}
              onChange={(e) => setTesterAction(e.target.value)}
              className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 font-mono text-[11px]"
            >
              {PERMISSION_ROWS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} · {locale === "en" ? p.labelEn : p.labelVi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
              {locale === "en" ? "Author Email (Dual-control)" : "Email Tác giả (Kiểm soát kép)"}
            </label>
            <input
              type="email"
              value={testerAuthorEmail}
              onChange={(e) => setTesterAuthorEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
              {locale === "en" ? "Approver Email" : "Email Người duyệt"}
            </label>
            <input
              type="email"
              value={testerApproverEmail}
              onChange={(e) => setTesterApproverEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleRunDryTest}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-admin-pill bg-admin-brand-teal text-white font-semibold text-xs hover:opacity-90 transition-opacity shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{locale === "en" ? "Run Evaluation Check" : "Thực hiện kiểm tra quyền"}</span>
          </button>

          {testResult && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-admin-pill text-xs font-semibold border ${
                testResult.allowed
                  ? "bg-admin-success-tint text-admin-success border-admin-success/30"
                  : testResult.code === "TWO_PERSON_RULE_VIOLATION"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  : "bg-red-500/15 text-red-600 border-red-500/30"
              }`}
            >
              {testResult.allowed ? (
                <Check className="w-4 h-4 text-admin-success" />
              ) : testResult.code === "TWO_PERSON_RULE_VIOLATION" ? (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Interactive Matrix Filter Bar */}
      <div className="p-4 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
          {[
            { id: "all", label: "Tất cả module (26)" },
            { id: "content", label: "Nội dung & Bài học (6)" },
            { id: "learners", label: "Học viên & PII (4)" },
            { id: "orders", label: "Đơn hàng & Hoàn tiền (4)" },
            { id: "leads", label: "Leads & Tư vấn (4)" },
            { id: "marketing", label: "Marketing (2)" },
            { id: "reports", label: "Báo cáo (2)" },
            { id: "system", label: "Hệ thống (4)" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-admin-control font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-admin-brand-teal/15 text-admin-brand-teal font-bold"
                  : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-admin-text-placeholder absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo quyền hoặc mô tả..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary placeholder:text-admin-text-placeholder focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal"
          />
        </div>
      </div>

      {/* 3. The Big Matrix Table */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/50 text-admin-text-muted">
                <th className="py-3 px-4 font-semibold w-72 sticky left-0 bg-admin-surface z-10 border-r border-admin-border">
                  Quyền hạn (Resource · Action)
                </th>
                {CANONICAL_ROLES.map((role) => (
                  <th
                    key={role}
                    className="py-3 px-3 font-semibold text-center whitespace-nowrap border-r border-admin-border/40 last:border-r-0"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-admin-text-primary">
                        {formatRoleLabel(role, locale)}
                      </span>
                      <span className="text-[10px] text-admin-text-muted font-normal font-mono">
                        {role}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {filteredPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-admin-subtle/40 transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-admin-surface z-10 border-r border-admin-border">
                    <div>
                      <p className="font-semibold text-admin-text-primary">
                        {locale === "en" ? perm.labelEn : perm.labelVi}
                      </p>
                      <p className="text-[10px] text-admin-text-muted font-mono">{perm.id}</p>
                    </div>
                  </td>

                  {CANONICAL_ROLES.map((role) => {
                    const roleDef = ROLE_DEFINITIONS[role];
                    const isGranted = hasPermission(roleDef?.permissions, perm.id);

                    return (
                      <td
                        key={role}
                        className="py-2.5 px-3 text-center border-r border-admin-border/40 last:border-r-0"
                      >
                        {isGranted ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-admin-success-tint text-admin-success border border-admin-success/30">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-admin-text-placeholder/40">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
