"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Plus,
  Search,
  Globe,
  BookPlus,
  Tag,
  Megaphone,
} from "lucide-react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { NotificationBell } from "./NotificationBell";
import { AdminThemeToggle } from "./AdminThemeToggle";

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
  const { user } = useAdminAuth();

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

        {/* Theme Toggle (Light / Dark / System) */}
        <AdminThemeToggle />
      </div>
    </header>
  );
}
