"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Shield,
  Plus,
  Search,
  Globe,
  ChevronDown,
  BookPlus,
  Tag,
  Megaphone,
} from "lucide-react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { NotificationBell } from "./NotificationBell";
import { AdminThemeToggle } from "./AdminThemeToggle";
import type { AdminRole } from "@/features/auth-rbac/types";
import { formatRoleLabel } from "@/features/auth-rbac/permissions";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenCommandPalette?: () => void;
}

export function AdminHeader({
  onOpenMobileMenu,
  onOpenCommandPalette,
}: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, currentRole, switchRole } = useAdminAuth();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  const currentLocale = pathname?.startsWith("/en") ? "en" : "vi";

  const toggleLanguage = () => {
    const targetLocale = currentLocale === "vi" ? "en" : "vi";
    let newPath = pathname;
    if (pathname.startsWith("/vi")) {
      newPath = pathname.replace(/^\/vi/, `/${targetLocale}`);
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, `/${targetLocale}`);
    } else {
      newPath = `/${targetLocale}${pathname}`;
    }
    router.push(newPath);
  };

  const showDevSwitcher =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ADMIN_DEV_PERSONA === "true";

  const availableRoles: { role: AdminRole; label: string; desc: string }[] = [
    {
      role: "super_admin",
      label: currentLocale === "en" ? "Super Admin" : "Quản Trị Tối Cao",
      desc: currentLocale === "en" ? "Full system permissions" : "Toàn quyền quản trị hệ thống",
    },
    {
      role: "admin",
      label: currentLocale === "en" ? "Administrator" : "Quản Trị Vận Hành",
      desc: currentLocale === "en" ? "Daily ops, content approval & refunds" : "Vận hành, duyệt bài & phê duyệt hoàn tiền",
    },
    {
      role: "content_editor",
      label: currentLocale === "en" ? "Content Editor" : "Biên Tập Viên",
      desc: currentLocale === "en" ? "Draft lessons & vocab; cannot publish" : "Soạn thảo bài học; không thể tự duyệt",
    },
    {
      role: "publisher",
      label: currentLocale === "en" ? "Publisher" : "Kiểm Duyệt Viên",
      desc: currentLocale === "en" ? "Review, approve & publish curriculum" : "Kiểm duyệt, góp ý & xuất bản bài giảng",
    },
    {
      role: "teacher",
      label: currentLocale === "en" ? "Teacher" : "Giảng Viên",
      desc: currentLocale === "en" ? "Learner progress for assigned classes" : "Theo dõi học viên các lớp phụ trách",
    },
    {
      role: "sales_crm",
      label: currentLocale === "en" ? "Sales & CRM" : "Tư Vấn & Tuyển Sinh",
      desc: currentLocale === "en" ? "Leads, orders & propose refunds" : "Quản lý leads, đơn hàng & đề xuất hoàn tiền",
    },
    {
      role: "support_agent",
      label: currentLocale === "en" ? "Support Agent" : "Chuyên Viên Hỗ Trợ",
      desc: currentLocale === "en" ? "Tickets & unmasked contact info" : "Xem thông tin hỗ trợ; không xem doanh thu",
    },
    {
      role: "marketing",
      label: currentLocale === "en" ? "Marketing" : "Tiếp Thị & Growth",
      desc: currentLocale === "en" ? "Coupons, banners & campaigns" : "Mã giảm giá, banner & chiến dịch",
    },
    {
      role: "read_only",
      label: currentLocale === "en" ? "Read-only" : "Quan Sát Viên",
      desc: currentLocale === "en" ? "Masked observer; view only" : "Quan sát viên; ẩn PII & doanh thu",
    },
  ];

  return (
    <header className="h-16 px-4 sm:px-6 bg-admin-surface/80 backdrop-blur-md border-b border-admin-border sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* 1. Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-admin-control text-admin-text-secondary hover:bg-admin-subtle"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <AdminBreadcrumbs />
      </div>

      {/* 2. Center/Right: Global Search + Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Global Search Shortcut Pill */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs text-admin-text-muted transition-colors shadow-xs group"
          title="Search anything (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-admin-text-placeholder group-hover:text-admin-text-secondary transition-colors" />
          <span className="hidden lg:inline text-admin-text-secondary">Search</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-admin-subtle border border-admin-border text-admin-text-muted">
            ⌘K
          </span>
        </button>

        {/* Quick Create "+" Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-admin-control bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white shadow-xs transition-all duration-150"
            title="Quick Create"
            aria-label="Quick Create"
          >
            <Plus className="w-4 h-4" />
          </button>

          {quickCreateOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setQuickCreateOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-admin-text-muted uppercase tracking-wider">
                  Quick Create
                </div>
                <Link
                  href="/admin/teaching/lessons/new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-admin-control text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary transition-colors"
                >
                  <BookPlus className="w-4 h-4 text-admin-brand-teal" />
                  <span>New Lesson Draft</span>
                </Link>
                <Link
                  href="/admin/marketing/coupons?action=new"
                  onClick={() => setQuickCreateOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-admin-control text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary transition-colors"
                >
                  <Tag className="w-4 h-4 text-admin-brand-yellow" />
                  <span>Discount Coupon</span>
                </Link>
                <Link
                  href="/admin/marketing/banners?action=edit"
                  onClick={() => setQuickCreateOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-admin-control text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary transition-colors"
                >
                  <Megaphone className="w-4 h-4 text-admin-brand-coral" />
                  <span>Announcement Banner</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Real-time Notification Bell */}
        <NotificationBell />

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="h-9 px-2.5 flex items-center gap-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs font-semibold text-admin-text-secondary transition-colors"
          title="Switch Language (VI / EN)"
        >
          <Globe className="w-3.5 h-3.5 text-admin-text-muted" />
          <span className="uppercase">{currentLocale}</span>
        </button>

        {/* Role Switcher Pill (Interactive RBAC Testing in Dev, Protected in Prod) */}
        {showDevSwitcher ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="h-9 px-3 flex items-center gap-1.5 rounded-admin-control bg-admin-surface hover:bg-admin-subtle text-xs font-semibold text-admin-text-primary border border-admin-border shadow-xs transition-colors"
              title="Switch RBAC role to test authorization"
            >
              <Shield className="w-3.5 h-3.5 text-admin-brand-teal" />
              <span className="hidden sm:inline">
                {formatRoleLabel(currentRole, currentLocale)}
              </span>
              <ChevronDown className="w-3 h-3 text-admin-text-muted" />
            </button>

            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-68 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card z-50 p-2 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-admin-text-muted uppercase tracking-wider">
                    {currentLocale === "en" ? "Test RBAC Persona (Dev)" : "Mô Phỏng Phân Quyền (Dev)"}
                  </div>
                  {availableRoles.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        switchRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-admin-control text-xs flex flex-col transition-colors ${
                        currentRole === r.role
                          ? "bg-admin-brand-teal/10 text-admin-brand-teal font-semibold"
                          : "hover:bg-admin-subtle text-admin-text-secondary hover:text-admin-text-primary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{r.label}</span>
                        {currentRole === r.role && (
                          <span className="w-1.5 h-1.5 rounded-full bg-admin-brand-teal" />
                        )}
                      </div>
                      <span className="text-[10px] text-admin-text-muted font-normal">
                        {r.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-9 px-3 flex items-center gap-1.5 rounded-admin-control bg-admin-surface text-xs font-semibold text-admin-text-primary border border-admin-border shadow-xs">
            <Shield className="w-3.5 h-3.5 text-admin-brand-teal" />
            <span className="hidden sm:inline">
              {formatRoleLabel(currentRole, currentLocale)}
            </span>
          </div>
        )}

        {/* Theme Toggle (Light / Dark / System) */}
        <AdminThemeToggle />
      </div>
    </header>
  );
}
