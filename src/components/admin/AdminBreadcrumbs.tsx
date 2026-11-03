"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const segmentLabels: Record<string, string> = {
  admin: "Overview",
  content: "Content",
  lessons: "Lessons",
  vocabulary: "Vocabulary",
  roadmap: "Roadmap",
  publishing: "Publishing",
  learners: "Learners",
  sales: "Sales",
  leads: "Leads",
  orders: "Orders",
  marketing: "Marketing",
  banners: "Banners",
  coupons: "Coupons",
  analytics: "Analytics",
  settings: "Settings",
  staff: "Staff & Roles",
  "audit-logs": "Audit Logs",
  _design: "Style Guide",
};

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  const pathname = usePathname();

  // If explicit items are passed, use them
  if (items && items.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-admin-text-muted">
        <Link
          href="/admin"
          className="hover:text-admin-text-primary inline-flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Admin</span>
        </Link>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-admin-text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-admin-text-primary">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Derive from pathname (e.g. /vi/admin/content/lessons or /admin/content/lessons)
  const segments = (pathname || "")
    .split("/")
    .filter((s) => s && s !== "vi" && s !== "en");

  if (segments.length === 0 || (segments.length === 1 && segments[0] === "admin")) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-admin-text-muted">
        <span className="font-semibold text-admin-text-primary">Overview</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-admin-text-muted overflow-x-auto py-1">
      <Link
        href="/admin"
        className="hover:text-admin-text-primary inline-flex items-center gap-1 transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Admin</span>
      </Link>

      {segments.slice(1).map((segment, index) => {
        const path = `/${segments.slice(0, index + 2).join("/")}`;
        const isLast = index === segments.length - 2;
        const displayLabel = segmentLabels[segment] || segment;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-admin-text-primary shrink-0 truncate max-w-[180px]">
                {displayLabel}
              </span>
            ) : (
              <Link
                href={path}
                className="hover:text-admin-text-primary transition-colors shrink-0 truncate max-w-[140px]"
              >
                {displayLabel}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
