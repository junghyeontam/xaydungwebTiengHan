"use client";

import React from "react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { formatRoleLabel } from "@/features/auth-rbac/permissions";
import { ShieldAlert, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminPersonaSimBanner() {
  const { currentRole, switchRole } = useAdminAuth();
  const pathname = usePathname();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";

  if (currentRole === "super_admin") return null;

  const roleLabel = formatRoleLabel(currentRole, locale);

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400">
          <ShieldAlert className="w-3.5 h-3.5" />
        </span>
        <span className="font-semibold text-amber-800 dark:text-amber-300">
          {locale === "en" ? "RBAC Persona Active:" : "Mô phỏng phân quyền:"}
        </span>
        <span>
          {locale === "en"
            ? `Viewing portal with permissions of '${roleLabel}'. Actions are scoped.`
            : `Đang xem giao diện với đặc quyền của vai trò '${roleLabel}'. Quyền bị giới hạn.`}
        </span>
      </div>
      <button
        type="button"
        onClick={() => switchRole("super_admin")}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100 font-semibold text-[11px] transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>{locale === "en" ? "Reset to Super Admin" : "Quay lại Super Admin"}</span>
      </button>
    </div>
  );
}
