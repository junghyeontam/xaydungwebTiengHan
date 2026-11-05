"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  KeyRound,
  Mail,
  Shield,
  Clock,
  MoreVertical,
  ExternalLink,
  Lock,
  UserX,
  UserCheck,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ROLE_DEFINITIONS, formatRoleLabel } from "@/features/auth-rbac/permissions";
import type { AdminRole } from "@/features/auth-rbac/types";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { usePathname } from "next/navigation";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: "active" | "invited" | "deactivated";
  isTwoFactorEnabled: boolean;
  lastActive: string;
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

export default function AdminStaffPage() {
  const pathname = usePathname();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";
  const { currentRole, can } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("content_editor");

  // Role change modal
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<AdminRole>("content_editor");
  const [roleChangeReason, setRoleChangeReason] = useState("");
  const [roleChangeError, setRoleChangeError] = useState("");

  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "usr-admin-1",
      email: "admin@junghyeon.vn",
      name: "JungHyeon Master Administrator",
      role: "super_admin",
      status: "active",
      isTwoFactorEnabled: true,
      lastActive: "Đang online",
    },
    {
      id: "usr-admin-2",
      email: "ops@junghyeon.vn",
      name: "Nguyễn Hải Đăng (Ops Lead)",
      role: "admin",
      status: "active",
      isTwoFactorEnabled: true,
      lastActive: "15 phút trước",
    },
    {
      id: "usr-editor-3",
      email: "editor@junghyeon.vn",
      name: "Hwang Min-seok",
      role: "content_editor",
      status: "active",
      isTwoFactorEnabled: false,
      lastActive: "1 giờ trước",
    },
    {
      id: "usr-pub-4",
      email: "reviewer@junghyeon.vn",
      name: "Kim Tae-young",
      role: "publisher",
      status: "active",
      isTwoFactorEnabled: true,
      lastActive: "Hôm qua",
    },
    {
      id: "usr-teacher-5",
      email: "teacher@junghyeon.vn",
      name: "Trần Thị Hương",
      role: "teacher",
      status: "active",
      isTwoFactorEnabled: true,
      lastActive: "4 giờ trước",
    },
    {
      id: "usr-sales-6",
      email: "sales@junghyeon.vn",
      name: "Lê Ngọc Hân",
      role: "sales_crm",
      status: "active",
      isTwoFactorEnabled: false,
      lastActive: "3 giờ trước",
    },
    {
      id: "usr-supp-7",
      email: "support@junghyeon.vn",
      name: "Phạm Hồng Phúc",
      role: "support_agent",
      status: "active",
      isTwoFactorEnabled: true,
      lastActive: "25 phút trước",
    },
    {
      id: "usr-mkt-8",
      email: "marketing@junghyeon.vn",
      name: "Trần Anh Vũ",
      role: "marketing",
      status: "active",
      isTwoFactorEnabled: true,
      lastActive: "5 phút trước",
    },
    {
      id: "usr-ro-9",
      email: "auditor@junghyeon.vn",
      name: "Kiểm Toán Viên Độc Lập",
      role: "read_only",
      status: "invited",
      isTwoFactorEnabled: false,
      lastActive: "Chờ xác nhận email",
    },
  ]);

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    // Check role escalation restriction
    if (currentRole === "admin" && (inviteRole === "admin" || inviteRole === "super_admin")) {
      alert("Quyền bị từ chối: Quản trị viên vận hành không được phép mời tài khoản Administrator hoặc Super Administrator.");
      return;
    }

    const newMember: StaffMember = {
      id: `usr-${Date.now()}`,
      email: inviteEmail,
      name: inviteName,
      role: inviteRole,
      status: "invited",
      isTwoFactorEnabled: false,
      lastActive: "Mới gửi lời mời",
    };
    setStaffList([...staffList, newMember]);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteName("");
  };

  const handleOpenRoleModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setNewSelectedRole(staff.role);
    setRoleChangeReason("");
    setRoleChangeError("");
  };

  const handleSaveRoleChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (roleChangeReason.trim().length < 5) {
      setRoleChangeError("Vui lòng nhập lý do thay đổi vai trò (tối thiểu 5 ký tự) để ghi nhận nhật ký kiểm toán.");
      return;
    }

    // Role escalation check
    if (currentRole === "admin" && (newSelectedRole === "admin" || newSelectedRole === "super_admin")) {
      setRoleChangeError("Quyền bị từ chối: Vai trò Administrator không thể nâng cấp người dùng lên Admin hoặc Super Admin.");
      return;
    }

    setStaffList(
      staffList.map((s) =>
        s.id === editingStaff.id ? { ...s, role: newSelectedRole } : s
      )
    );
    setEditingStaff(null);
  };

  const handleToggleDeactivate = (staff: StaffMember) => {
    if (staff.role === "super_admin") {
      alert("Không thể vô hiệu hóa tài khoản Super Administrator chính.");
      return;
    }

    const nextStatus = staff.status === "deactivated" ? "active" : "deactivated";
    const confirmMsg =
      nextStatus === "deactivated"
        ? `Bạn có chắc muốn vô hiệu hóa tài khoản nhân sự ${staff.name}? Người này sẽ bị chặn truy cập admin ngay lập tức.`
        : `Kích hoạt lại quyền truy cập cho nhân sự ${staff.name}?`;

    if (window.confirm(confirmMsg)) {
      setStaffList(
        staffList.map((s) =>
          s.id === staff.id ? { ...s, status: nextStatus } : s
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="System Administration"
        title="Staff Directory & RBAC Assignment"
        titleMuted={`· ${staffList.length} Accounts`}
        description="Quản trị tài khoản nhân sự nội bộ, phân quyền vai trò (Super Admin, Editor, Reviewer, Teacher, Sales, Support, Marketing) và giám sát trạng thái bảo mật 2FA."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/settings/roles"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-admin-pill bg-admin-surface hover:bg-admin-subtle border border-admin-border text-xs font-semibold text-admin-text-secondary transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-admin-brand-teal" />
              <span>Xem ma trận phân quyền</span>
            </Link>

            {can("system.manage_roles") && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-admin-pill bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white font-medium text-xs shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Thêm nhân viên mới</span>
              </button>
            )}
          </div>
        }
      />

      {/* Staff Table */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="flex items-center gap-2 max-w-sm px-3 py-2 rounded-admin-pill bg-admin-surface border border-admin-border shadow-xs">
          <Search className="w-4 h-4 text-admin-text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, email, vai trò..."
            className="bg-transparent text-xs text-admin-text-primary placeholder:text-admin-text-muted focus:outline-none w-full"
          />
        </div>

        {/* Table */}
        <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                  <th className="py-3 px-4 font-medium">Nhân viên</th>
                  <th className="py-3 px-4 font-medium">Vai trò hệ thống</th>
                  <th className="py-3 px-4 font-medium">Trạng thái</th>
                  <th className="py-3 px-4 font-medium">Xác thực 2FA</th>
                  <th className="py-3 px-4 font-medium">Lần hoạt động cuối</th>
                  <th className="py-3 px-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border/50">
                {filteredStaff.map((staff) => {
                  const roleDef = ROLE_DEFINITIONS[staff.role] || ROLE_DEFINITIONS.super_admin;
                  const isDeactivated = staff.status === "deactivated";

                  return (
                    <tr
                      key={staff.id}
                      className={`hover:bg-admin-subtle/50 transition-colors ${
                        isDeactivated ? "opacity-60 bg-admin-subtle/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-admin-brand-teal/15 text-admin-brand-teal font-semibold text-xs flex items-center justify-center shrink-0 uppercase">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-admin-text-primary flex items-center gap-2">
                              <span>{staff.name}</span>
                              {isDeactivated && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/10 text-red-600 font-semibold border border-red-500/20">
                                  Vô hiệu hóa
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-admin-text-muted flex items-center gap-1 num-tabular">
                              <Mail className="w-3 h-3" />
                              <span>{staff.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-admin-pill text-[11px] font-semibold border ${roleDef.badgeColor}`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{formatRoleLabel(staff.role, locale)}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {staff.status === "active" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-success-tint text-admin-success border border-admin-success/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-admin-success" />
                            Hoạt động
                          </span>
                        )}
                        {staff.status === "invited" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Đã gửi mời
                          </span>
                        )}
                        {staff.status === "deactivated" && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-gray-500/10 text-gray-500 border border-gray-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {staff.isTwoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1 text-admin-success text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã bật (Bắt buộc)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            Chưa kích hoạt
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-admin-text-muted num-tabular">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{staff.lastActive}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {can("system.manage_roles") ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenRoleModal(staff)}
                              className="px-2.5 py-1 rounded-admin-control bg-admin-subtle hover:bg-admin-subtle/80 text-admin-text-secondary hover:text-admin-text-primary text-[11px] font-medium border border-admin-border transition-colors"
                            >
                              Đổi vai trò
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleDeactivate(staff)}
                              className={`p-1 rounded-admin-control transition-colors ${
                                isDeactivated
                                  ? "text-admin-success hover:bg-admin-success-tint"
                                  : "text-admin-danger hover:bg-admin-danger-tint"
                              }`}
                              title={isDeactivated ? "Kích hoạt lại tài khoản" : "Khóa tài khoản"}
                            >
                              {isDeactivated ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-admin-text-placeholder text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Assignment Modal with Reason (Audited) */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-admin-surface border border-admin-border rounded-admin-card shadow-admin-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-admin-brand-teal">
              <Shield className="w-5 h-5 text-admin-brand-teal" />
              <h3 className="text-base font-bold text-admin-text-primary">
                Phân quyền vai trò mới
              </h3>
            </div>
            <p className="text-xs text-admin-text-secondary">
              Thay đổi vai trò cho tài khoản: <strong className="text-admin-text-primary">{editingStaff.name}</strong> ({editingStaff.email}).
            </p>

            <form onSubmit={handleSaveRoleChange} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Chọn vai trò mới (Least Privilege)
                </label>
                <select
                  value={newSelectedRole}
                  onChange={(e) => setNewSelectedRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
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
                  Lý do điều chỉnh quyền (Bắt buộc ghi nhận Audit Log)
                </label>
                <textarea
                  value={roleChangeReason}
                  onChange={(e) => setRoleChangeReason(e.target.value)}
                  placeholder="Ví dụ: Điều chuyển công tác sang ban kiểm duyệt bài giảng TOPIK..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
                />
                {roleChangeError && <p className="text-[11px] text-red-500 mt-1">{roleChangeError}</p>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-3.5 py-1.5 rounded-admin-pill text-xs font-semibold text-admin-text-secondary hover:bg-admin-subtle transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-admin-pill text-xs font-semibold bg-admin-brand-teal text-white hover:opacity-90 transition-opacity shadow-xs"
                >
                  Lưu thay đổi & Ghi Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-admin-surface border border-admin-border rounded-admin-card shadow-admin-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-admin-brand-teal">
              <UserPlus className="w-5 h-5 text-admin-brand-coral" />
              <h3 className="text-base font-bold text-admin-text-primary">
                Mời nhân sự mới vào hệ thống
              </h3>
            </div>
            <p className="text-xs text-admin-text-secondary">
              Gửi email kích hoạt tài khoản nội bộ kèm hướng dẫn thiết lập xác thực 2 bước (2FA).
            </p>

            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Họ và tên nhân sự
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Ví dụ: Lê Thảo My"
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Email công vụ (@junghyeon.vn)
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="thaomy.le@junghyeon.vn"
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-admin-text-muted mb-1">
                  Vai trò ban đầu
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30"
                >
                  {CANONICAL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {formatRoleLabel(r, locale)} ({r})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-1.5 rounded-admin-pill text-xs font-semibold text-admin-text-secondary hover:bg-admin-subtle transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-admin-pill text-xs font-semibold bg-admin-brand-coral text-white hover:opacity-90 transition-opacity shadow-xs"
                >
                  Gửi lời mời kích hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
