"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { formatRoleLabel } from "@/features/auth-rbac/permissions";
import { usePathname } from "next/navigation";

export default function UnauthorizedPage() {
  const { currentRole } = useAdminAuth();
  const pathname = usePathname();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";
  const roleLabel = formatRoleLabel(currentRole, locale);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-admin-surface border border-admin-border rounded-admin-card p-8 text-center shadow-admin-card space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-admin-pill text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
            <Lock className="w-3 h-3" />
            <span>403 · Access Denied</span>
          </div>
          <h1 className="text-xl font-bold text-admin-text-primary tracking-tight">
            {locale === "en" ? "Restricted Access Area" : "Khu vực bị giới hạn quyền"}
          </h1>
          <p className="text-xs text-admin-text-secondary leading-relaxed">
            {locale === "en"
              ? `Your current role (${roleLabel}) does not have the required permissions to view or perform operations on this section.`
              : `Vai trò hiện tại (${roleLabel}) của bạn không có đủ đặc quyền để xem hoặc thao tác trên phân hệ này.`}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-admin-subtle/50 border border-admin-border text-left space-y-1 text-xs">
          <div className="flex justify-between text-admin-text-muted">
            <span>{locale === "en" ? "Active Role" : "Vai trò hiện hành"}:</span>
            <span className="font-semibold text-admin-text-primary">{roleLabel}</span>
          </div>
          <div className="flex justify-between text-admin-text-muted">
            <span>{locale === "en" ? "Principle" : "Nguyên tắc"}:</span>
            <span className="text-admin-brand-teal font-medium">Least Privilege (PoLP)</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href={`/${locale}/admin`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-admin-pill bg-admin-brand-teal text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "Return to Dashboard" : "Về Bảng điều khiển"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
