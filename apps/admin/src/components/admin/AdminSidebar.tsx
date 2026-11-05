"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Languages,
  Milestone,
  Send,
  Users,
  LineChart,
  ShoppingBag,
  PhoneCall,
  CalendarDays,
  Megaphone,
  Tag,
  ShieldCheck,
  History,
  Sliders,
  Palette,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
  LogOut,
  ChevronDown,
  FileText,
  GraduationCap,
} from "lucide-react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import type { AdminPermission } from "@/features/auth-rbac/types";
import { formatRoleLabel } from "@/features/auth-rbac/permissions";
import { Count } from "@/components/shared";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: AdminPermission;
  badge?: string;
  badgeType?: "default" | "alert" | "subtle";
  subItems?: { label: string; href: string }[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export interface LearnerPlanSegment {
  id: string;
  label: string;
  count: string;
  color: string;
  href: string;
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  onOpenCommandPalette,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenCommandPalette?: () => void;
}) {
  const pathname = usePathname();
  const { can, user, currentRole, logout } = useAdminAuth();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Real Learner Segment Plans (Aligned with Free, Lifetime VIP, Trial, Expired)
  const planSegments: LearnerPlanSegment[] = [
    {
      id: "lifetime_vip",
      label: "Lifetime VIP",
      count: "450",
      color: "bg-amber-500",
      href: "/admin/learners?tier=lifetime_vip",
    },
    {
      id: "free",
      label: "Free Plan",
      count: "1.450",
      color: "bg-[#2F5D9E]",
      href: "/admin/learners?tier=free",
    },
    {
      id: "trial",
      label: "VIP Trial",
      count: "120",
      color: "bg-sky-500",
      href: "/admin/learners?tier=trial",
    },
    {
      id: "expired",
      label: "Expired",
      count: "45",
      color: "bg-slate-400",
      href: "/admin/learners?tier=expired",
    },
  ];

  // Grouped Navigation Structure
  const navGroups: NavGroup[] = [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      id: "content",
      label: "Content Health",
      items: [
        {
          id: "lessons",
          label: "Content Health",
          href: "/admin/content/lessons",
          icon: BookOpen,
          permission: "content.read",
          badge: "128",
        },
        {
          id: "vocabulary",
          label: "Vocabulary Audit",
          href: "/admin/content/vocabulary",
          icon: Languages,
          permission: "content.read",
        },
        {
          id: "roadmap",
          label: "Roadmap Audit",
          href: "/admin/content/roadmap",
          icon: Milestone,
          permission: "content.read",
        },
      ],
    },
    {
      id: "learners",
      label: "Learners",
      items: [
        {
          id: "all-learners",
          label: "All Learners",
          href: "/admin/learners",
          icon: Users,
          permission: "learners.read",
          badge: "1.900",
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      items: [
        {
          id: "analytics-reports",
          label: "Performance & Funnels",
          href: "/admin/analytics",
          icon: LineChart,
          permission: "analytics.read",
        },
      ],
    },
    {
      id: "sales",
      label: "Sales",
      items: [
        {
          id: "orders",
          label: "Orders & VIP",
          href: "/admin/sales/orders",
          icon: ShoppingBag,
          permission: "sales.read",
        },
      ],
    },
    {
      id: "consulting",
      label: "Consulting",
      items: [
        {
          id: "leads",
          label: "Leads Inbox",
          href: "/admin/sales/leads",
          icon: PhoneCall,
          permission: "sales.read",
          badge: "5",
          badgeType: "alert",
        },
      ],
    },
    {
      id: "marketing",
      label: "Marketing",
      items: [
        {
          id: "banners",
          label: "Banners & Promos",
          href: "/admin/marketing/banners",
          icon: Megaphone,
          permission: "marketing.read",
        },
        {
          id: "coupons",
          label: "Coupons",
          href: "/admin/marketing/coupons",
          icon: Tag,
          permission: "marketing.read",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      items: [
        {
          id: "staff",
          label: "Staff & RBAC",
          href: "/admin/settings/staff",
          icon: ShieldCheck,
          permission: "users.manage",
        },
        {
          id: "audit-logs",
          label: "Audit Logs",
          href: "/admin/audit-logs",
          icon: History,
          permission: "system.audit_view",
        },
        {
          id: "config",
          label: "System Settings",
          href: "/admin/settings",
          icon: Sliders,
          permission: "system.settings_edit",
        },
        {
          id: "style-guide",
          label: "UI Style Guide",
          href: "/admin/design",
          icon: Palette,
          badge: "UI",
          badgeType: "subtle",
        },
      ],
    },
  ];

  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return (
        pathname === "/admin" ||
        pathname === "/vi/admin" ||
        pathname === "/en/admin"
      );
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-admin-sidebar border-r border-admin-border flex flex-col z-40 transition-[width] duration-200 select-none ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* 1. Wordmark Header with Collapse Button */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-admin-border shrink-0">
        {!collapsed ? (
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-admin-brand-dark dark:bg-admin-brand-teal flex items-center justify-center text-white dark:text-admin-brand-dark font-bold text-xs shadow-xs">
              정
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-admin-text-primary">
                JungHyeon
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-admin-brand-coral" />
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-admin-subtle border border-admin-border text-admin-text-muted">
                Admin
              </span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto w-8 h-8 rounded-lg bg-admin-brand-dark dark:bg-admin-brand-teal flex items-center justify-center text-white dark:text-admin-brand-dark font-bold text-xs shadow-xs">
            정
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-admin-control text-admin-text-muted hover:text-admin-text-primary hover:bg-admin-subtle transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* 2. Quick Search Trigger (⌘K chip) */}
      <div className="p-3 pb-1 shrink-0">
        {!collapsed ? (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-2 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs text-admin-text-muted transition-colors shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-admin-text-placeholder group-hover:text-admin-text-secondary transition-colors" />
              <span>Search...</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-admin-subtle border border-admin-border text-admin-text-muted">
              ⌘K
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            title="Search (⌘K)"
            className="w-full h-9 flex items-center justify-center rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-admin-text-muted hover:text-admin-text-primary transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Grouped Navigation & Segment List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (!item.permission) return true;
            return can(item.permission);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[11px] font-medium text-admin-text-muted">
                  {group.label}
                </div>
              )}

              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`group flex items-center gap-2.5 px-3 py-2 rounded-admin-control text-xs font-medium transition-all duration-150 ${
                        active
                          ? "bg-admin-surface text-admin-text-primary border border-admin-border shadow-admin-active font-semibold"
                          : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary border border-transparent"
                      } ${collapsed ? "justify-center px-2" : ""}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active
                            ? "text-admin-brand-teal"
                            : "text-admin-text-muted group-hover:text-admin-text-secondary"
                        }`}
                      />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!collapsed && item.badge && (
                        <Count
                          count={item.badge}
                          variant={
                            item.badgeType === "alert"
                              ? "alert"
                              : item.badgeType === "subtle"
                              ? "subtle"
                              : "sidebar"
                          }
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 4. Learner Segments / Plans (Ember Polish with colored dots) */}
        {!collapsed && (
          <div className="pt-2 border-t border-admin-border/70 space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-medium text-admin-text-muted flex items-center justify-between">
              <span>Plans</span>
              <span className="text-[10px] font-normal text-admin-text-muted">
                Segments
              </span>
            </div>

            <div className="space-y-0.5">
              {planSegments.map((seg) => (
                <Link
                  key={seg.id}
                  href={seg.href}
                  className="flex items-center justify-between px-3 py-1.5 rounded-admin-control text-xs text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${seg.color} shrink-0 group-hover:scale-110 transition-transform`}
                    />
                    <span className="font-normal">{seg.label}</span>
                  </div>
                  <Count
                    count={seg.count}
                    className="text-[11px] text-admin-text-muted font-medium"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 5. Bottom Controls: Environment, Links & Staff Profile */}
      <div className="p-3 border-t border-admin-border shrink-0 space-y-2 bg-admin-sidebar">
        {!collapsed ? (
          <>
            {/* Environment & Quick Help */}
            <div className="flex items-center justify-between px-2 text-[11px] text-admin-text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-admin-success animate-pulse" />
                <span className="font-medium">Production</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/_design"
                  title="Design System"
                  className="hover:text-admin-text-primary transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  title="View Learner Site"
                  className="hover:text-admin-text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Staff Card */}
            <div className="flex items-center justify-between p-2 rounded-admin-control border border-admin-border bg-admin-surface shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-admin-brand-teal/15 text-admin-brand-teal font-semibold text-xs flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="min-w-0 truncate">
                  <p className="text-xs font-semibold text-admin-text-primary truncate">
                    {user?.name || "Staff Member"}
                  </p>
                  <p className="text-[10px] text-admin-text-muted truncate">
                    {formatRoleLabel(currentRole, pathname?.startsWith("/en") ? "en" : "vi")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="p-1 rounded-md text-admin-text-muted hover:text-admin-danger hover:bg-admin-danger-tint transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              target="_blank"
              title="View Learner Site"
              className="p-2 rounded-admin-control text-admin-text-muted hover:text-admin-text-primary hover:bg-admin-subtle"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-2 rounded-admin-control text-admin-text-muted hover:text-admin-danger"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
