"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  ROLE_PERMISSION_MATRIX,
  ROLE_SURFACE_MATRIX,
  isDangerCapability,
} from "@junghyeon/rbac";

interface SectionInfo {
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  dangerActionLabelVi: string;
  dangerActionLabelEn: string;
  confirmPhrase: string;
}

const SECTION_CATALOG: Record<string, SectionInfo> = {
  roles: {
    titleVi: "Ma trận Vai trò & Phân vùng (Role -> Surface Matrix)",
    titleEn: "Role & Surface Access Matrix",
    descVi: "Quản lý 9 vai trò chuẩn, yêu cầu 2FA và quyền truy cập từng phân vùng (web, teach, admin, system).",
    descEn: "Manage the 9 canonical roles, 2FA requirements, and allowed surfaces (web, teach, admin, system).",
    dangerActionLabelVi: "Đồng bộ Ma trận RBAC",
    dangerActionLabelEn: "Sync RBAC Matrix",
    confirmPhrase: "SYNC-RBAC",
  },
  permissions: {
    titleVi: "Sổ đăng ký Quyền hạn (Permission Registry)",
    titleEn: "Canonical Permission Registry",
    descVi: "Danh mục toàn bộ 35 quyền hạn nguyên tử (Default-Deny) dùng chung trên cả 3 ứng dụng và RLS.",
    descEn: "Complete registry of 35 atomic permissions (Default-Deny) shared across all 3 apps and RLS.",
    dangerActionLabelVi: "Khóa Sổ đăng ký Quyền",
    dangerActionLabelEn: "Lock Permission Registry",
    confirmPhrase: "LOCK-PERMISSIONS",
  },
  integrations: {
    titleVi: "Tích hợp & Webhook Ngoại vi",
    titleEn: "External Integrations & Webhooks",
    descVi: "Quản lý kết nối Supabase, Gemini AI, Zalo OA, Resend Email và cổng lưu trữ R2/S3.",
    descEn: "Manage Supabase, Gemini AI, Zalo OA, Resend Email, and storage bucket webhooks.",
    dangerActionLabelVi: "Xoay vòng Webhook Secret",
    dangerActionLabelEn: "Rotate Webhook Secret",
    confirmPhrase: "ROTATE-WEBHOOK",
  },
  "payment-keys": {
    titleVi: "Khóa Thanh toán & Cổng Ngân hàng (PayOS / VietQR / Stripe)",
    titleEn: "Payment Gateway Keys & Vault",
    descVi: "Các khóa bí mật luôn được che dấu (masked); chỉ hiển thị 4 ký tự cuối và yêu cầu Re-Auth để xoay vòng.",
    descEn: "Payment secrets are permanently masked; only the last 4 characters are shown and rotation requires fresh Re-Auth.",
    dangerActionLabelVi: "Xoay vòng Khóa Thanh toán",
    dangerActionLabelEn: "Rotate Payment Keys",
    confirmPhrase: "ROTATE-PAYMENT-KEY",
  },
  "feature-flags": {
    titleVi: "Cờ Tính năng Hệ thống (Feature Flags)",
    titleEn: "System Feature Flags",
    descVi: "Bật/tắt tức thời các tính năng AI Honey, Phòng thi TOPIK CBT, thanh toán tự động trên từng phân vùng.",
    descEn: "Toggle AI Honey, TOPIK CBT exam room, and automated checkout flags across surfaces.",
    dangerActionLabelVi: "Lưu cấu hình Feature Flags",
    dangerActionLabelEn: "Commit Feature Flags",
    confirmPhrase: "COMMIT-FLAGS",
  },
  maintenance: {
    titleVi: "Chế độ Bảo trì & Khóa Ghi khẩn cấp (Maintenance Mode)",
    titleEn: "Maintenance Mode & Emergency Write Freeze",
    descVi: "Đưa cổng học viên hoặc cổng giảng viên về chế độ chỉ-đọc khi nâng cấp cơ sở dữ liệu.",
    descEn: "Place learner or teacher surfaces into read-only maintenance mode during database upgrades.",
    dangerActionLabelVi: "Bật / Tắt Chế độ Bảo trì",
    dangerActionLabelEn: "Toggle Maintenance Mode",
    confirmPhrase: "MAINTENANCE-MODE",
  },
  backups: {
    titleVi: "Sao lưu Cơ sở dữ liệu & Phục hồi theo thời điểm (PITR)",
    titleEn: "Database Backups & Point-in-Time Recovery (PITR)",
    descVi: "Theo dõi các bản snapshot PostgreSQL hàng ngày và kiểm tra tính toàn vẹn dữ liệu.",
    descEn: "Monitor daily PostgreSQL snapshots and verify backup checksums.",
    dangerActionLabelVi: "Tạo Bản sao lưu Thủ công",
    dangerActionLabelEn: "Trigger Manual Snapshot",
    confirmPhrase: "CREATE-BACKUP",
  },
  "security-audit": {
    titleVi: "Kiểm toán Bảo mật, RLS & CSP Headers",
    titleEn: "Security Posture, RLS & CSP Header Audit",
    descVi: "Kiểm tra tự động chính sách Row-Level Security (RLS), phiên 2FA và rò rỉ biến môi trường.",
    descEn: "Automated verification of Row-Level Security (RLS) policies, 2FA enforcement, and bundle hygiene.",
    dangerActionLabelVi: "Chạy Kiểm toán Bảo mật",
    dangerActionLabelEn: "Run Security Audit Scan",
    confirmPhrase: "RUN-SECURITY-SCAN",
  },
  "audit-log": {
    titleVi: "Nhật ký Kiểm toán Bất biến (Immutable Audit Log)",
    titleEn: "Immutable System Audit Log",
    descVi: "Truy vết toàn bộ hành động nhạy cảm của nhân sự và super_admin trên cả 3 phân vùng.",
    descEn: "Trace all privileged staff and super_admin actions across all 3 surfaces.",
    dangerActionLabelVi: "Xuất Nhật ký Kiểm toán Đầy đủ",
    dangerActionLabelEn: "Export Signed Audit Archive",
    confirmPhrase: "EXPORT-AUDIT-LOG",
  },
  staff: {
    titleVi: "Quản lý Tài khoản Nhân sự & Bắt buộc 2FA",
    titleEn: "Staff Provisioning & Mandatory 2FA Enforcement",
    descVi: "Cấp phát vai trò nhân sự, kiểm tra trạng thái xác thực 2FA và thu hồi toàn bộ phiên đăng nhập.",
    descEn: "Assign staff roles, inspect 2FA enrollment, and revoke active sessions.",
    dangerActionLabelVi: "Thu hồi Phiên Nhân sự",
    dangerActionLabelEn: "Revoke Staff Sessions",
    confirmPhrase: "REVOKE-STAFF",
  },
  impersonation: {
    titleVi: "Giả lập Xem góc nhìn Học viên / Giảng viên (Read-Only · Tối đa 15 phút)",
    titleEn: "Read-Only User Impersonation (15-Minute Hard Expiry)",
    descVi: "Chỉ cho phép quan sát giao diện để hỗ trợ kỹ thuật; khóa hoàn toàn các thao tác ghi và tự động hết hạn sau 15 phút.",
    descEn: "Strictly read-only view for technical troubleshooting; blocks all mutations and expires automatically after 15 minutes.",
    dangerActionLabelVi: "Bắt đầu Phiên Giả lập 15 phút",
    dangerActionLabelEn: "Start 15m Read-Only Impersonation",
    confirmPhrase: "START-IMPERSONATION",
  },
};

export default function SystemSectionPage() {
  const params = useParams<{ locale: string; section: string }>();
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "vi";
  const sectionKey = params?.section || "roles";
  const info = SECTION_CATALOG[sectionKey] || SECTION_CATALOG.roles;

  const [confirmInput, setConfirmInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [targetUserId, setTargetUserId] = useState("learner-demo-001");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExecuteDangerAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput !== info.confirmPhrase) {
      setStatusMessage(
        locale === "vi"
          ? `Vui lòng nhập chính xác cụm từ xác nhận: ${info.confirmPhrase}`
          : `Please type the exact confirmation phrase: ${info.confirmPhrase}`
      );
      return;
    }

    const res = await fetch("/api/admin/system", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: sectionKey === "impersonation" ? "start_impersonation" : `execute_${sectionKey}`,
        targetId: sectionKey,
        targetUserId: sectionKey === "impersonation" ? targetUserId : undefined,
        reason: reasonInput || `Executed ${info.confirmPhrase} in /system/${sectionKey}`,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatusMessage(
        locale === "vi"
          ? `Đã thực thi thành công (${data.action}) và ghi nhận vào bảng audit_logs.`
          : `Successfully executed (${data.action}) and recorded in audit_logs.`
      );
      setConfirmInput("");
    } else {
      setStatusMessage(
        `${res.status} · ${data.error}: ${data.message || "Re-authentication required"}`
      );
    }
  };

  return (
    <div className="space-y-6" data-testid={`system-section-${sectionKey}`}>
      {/* Header Card */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block rounded-lg bg-[var(--bg-accent-subtle)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              /system/{sectionKey}
            </span>
            <h1 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
              {locale === "vi" ? info.titleVi : info.titleEn}
            </h1>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {locale === "vi" ? info.descVi : info.descEn}
            </p>
          </div>
          <div className="text-right text-xs text-[var(--text-muted)]" style={{ fontVariantNumeric: "lining-nums" }}>
            <div>Surface: <strong className="text-[var(--text-primary)]">admin (/system)</strong></div>
            <div>Required Role: <strong className="text-[var(--state-danger,#dc2626)]">super_admin</strong></div>
          </div>
        </div>
      </div>

      {/* Section-Specific Data View */}
      {sectionKey === "roles" && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xs overflow-x-auto">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4">
            {locale === "vi" ? "Bảng phân quyền Vai trò -> Phân vùng" : "Role -> Surface Access Matrix"}
          </h2>
          <table className="w-full text-left text-xs border-collapse" style={{ fontVariantNumeric: "lining-nums" }}>
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <th className="py-2.5 pr-4">Role</th>
                <th className="py-2.5 px-4">Allowed Surfaces</th>
                <th className="py-2.5 px-4">Default Surface</th>
                <th className="py-2.5 px-4">2FA Required</th>
                <th className="py-2.5 pl-4">Permissions Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {Object.values(ROLE_SURFACE_MATRIX).map((policy) => {
                const permCount =
                  policy.role in ROLE_PERMISSION_MATRIX
                    ? ROLE_PERMISSION_MATRIX[policy.role as keyof typeof ROLE_PERMISSION_MATRIX].length
                    : 0;
                return (
                  <tr key={policy.role}>
                    <td className="py-2.5 pr-4 font-bold text-[var(--text-primary)]">{policy.role}</td>
                    <td className="py-2.5 px-4 text-[var(--text-secondary)]">
                      {policy.allowedSurfaces.join(", ")}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[var(--accent-primary)]">
                      {policy.defaultSurface}
                    </td>
                    <td className="py-2.5 px-4">
                      {policy.requires2FA ? "Mandatory (TOTP)" : "Optional"}
                    </td>
                    <td className="py-2.5 pl-4 font-semibold">{permCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sectionKey === "permissions" && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4" style={{ fontVariantNumeric: "lining-nums" }}>
            {locale === "vi"
              ? `Danh mục ${ROLE_PERMISSION_MATRIX.super_admin.length} Quyền hạn Nguyên tử`
              : `Registry of ${ROLE_PERMISSION_MATRIX.super_admin.length} Atomic Permissions`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLE_PERMISSION_MATRIX.super_admin.map((permCode) => {
              const danger = isDangerCapability(permCode);
              return (
                <div
                  key={permCode}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)]">{permCode}</span>
                    <span className="rounded bg-[var(--bg-surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                      {danger ? "DANGER · SUPER_ADMIN" : "STANDARD"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Typed-Confirmation Danger Zone Card (Present on every /system/* module) */}
      <div className="rounded-2xl border border-[var(--state-danger,#dc2626)]/30 bg-[var(--bg-surface)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[var(--state-danger,#dc2626)]">
            {locale === "vi"
              ? "Thao tác Nhạy cảm (Yêu cầu Nhập mã xác nhận + Step-Up Re-Auth <= 15p)"
              : "Privileged System Mutation (Typed Confirmation + Step-Up Re-Auth <= 15m)"}
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {locale === "vi"
              ? `Để thực hiện "${info.dangerActionLabelVi}", vui lòng nhập cụm từ xác nhận "${info.confirmPhrase}" và lý do kiểm toán.`
              : `To execute "${info.dangerActionLabelEn}", type "${info.confirmPhrase}" and provide an audit reason.`}
          </p>
        </div>

        <form onSubmit={handleExecuteDangerAction} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          {sectionKey === "impersonation" && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                {locale === "vi" ? "ID Tài khoản cần giả lập (Read-Only)" : "Target User ID (Read-Only)"}
              </label>
              <input
                type="text"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              {locale === "vi" ? "Lý do ghi vào Audit Log" : "Audit Log Reason"}
            </label>
            <input
              type="text"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder={locale === "vi" ? "VD: Kiểm tra định kỳ..." : "e.g. Scheduled security review..."}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              {locale === "vi"
                ? `Nhập "${info.confirmPhrase}" để xác nhận`
                : `Type "${info.confirmPhrase}" to confirm`}
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={info.confirmPhrase}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-bold text-[var(--text-primary)]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--state-danger,#dc2626)] px-4 py-2 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              {locale === "vi" ? info.dangerActionLabelVi : info.dangerActionLabelEn}
            </button>
          </div>
        </form>

        {statusMessage && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)]">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
