"use client";

import React, { useEffect, useState, useRef } from "react";
import { SURFACE_URLS, type SurfaceId } from "@junghyeon/config";

export interface SurfaceSwitcherProps {
  currentSurface: SurfaceId;
  allowedSurfaces: readonly SurfaceId[];
  activeRole?: string | null;
  locale?: "vi" | "en";
  className?: string;
}

interface SurfaceMeta {
  id: SurfaceId;
  shortcut: string;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  href: string;
  badgeColor: string;
}

const SURFACE_CATALOG: Record<SurfaceId, SurfaceMeta> = {
  web: {
    id: "web",
    shortcut: "Alt+1",
    labelVi: "Cổng Học viên (Web)",
    labelEn: "Learner Hub (Web)",
    descVi: "Lộ trình, Lý thuyết, Ôn tập SRS",
    descEn: "Roadmap, Theory & SRS Review",
    href: SURFACE_URLS.web,
    badgeColor: "bg-[var(--bg-accent-subtle)] text-[var(--accent-primary)]",
  },
  teach: {
    id: "teach",
    shortcut: "Alt+2",
    labelVi: "Teacher Studio",
    labelEn: "Teacher Studio",
    descVi: "Soạn bài giảng, Từ vựng, Ngữ pháp & Lớp học",
    descEn: "Lesson Builder, Banks & Classes",
    href: SURFACE_URLS.teach,
    badgeColor: "bg-[var(--bg-accent-subtle)] text-[var(--accent-primary)]",
  },
  admin: {
    id: "admin",
    shortcut: "Alt+3",
    labelVi: "Back-Office Admin",
    labelEn: "Back-Office Admin",
    descVi: "Học viên, Đơn hàng, CRM & Marketing",
    descEn: "Learners, Orders, CRM & Marketing",
    href: SURFACE_URLS.admin,
    badgeColor: "bg-[var(--bg-surface)] text-[var(--text-primary)]",
  },
  system: {
    id: "system",
    shortcut: "Alt+4",
    labelVi: "System Control (/system)",
    labelEn: "System Control (/system)",
    descVi: "Phân quyền RBAC, Bảo mật & Nhật ký Audit",
    descEn: "RBAC, Security & Audit Logs",
    href: `${SURFACE_URLS.admin}/system/roles`,
    badgeColor: "bg-[var(--state-danger-bg,rgba(220,38,38,0.12))] text-[var(--state-danger,#dc2626)]",
  },
};

export function SurfaceSwitcher({
  currentSurface,
  allowedSurfaces,
  activeRole,
  locale = "vi",
  className = "",
}: SurfaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only render switcher if the user has access to more than 1 surface
  const items = allowedSurfaces
    .map((id) => SURFACE_CATALOG[id])
    .filter((item): item is SurfaceMeta => Boolean(item));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < items.length) {
        const target = items[index];
        if (target && target.id !== currentSurface) {
          e.preventDefault();
          const roleQuery = activeRole ? `?role=${encodeURIComponent(activeRole)}` : "";
          window.location.href = `${target.href}${roleQuery}`;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, currentSurface, activeRole]);

  if (items.length <= 1) {
    return null;
  }

  const currentMeta = SURFACE_CATALOG[currentSurface] ?? SURFACE_CATALOG.web;

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`} data-testid="surface-switcher">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
      >
        <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
        <span>{locale === "vi" ? currentMeta.labelVi : currentMeta.labelEn}</span>
        <span className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
          {items.length}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-xl"
        >
          <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {locale === "vi" ? "Chuyển đổi không gian làm việc" : "Switch Workspace Surface"}
            </p>
            {activeRole && (
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                {locale === "vi" ? "Vai trò đang hoạt động:" : "Active role:"}{" "}
                <span className="font-semibold text-[var(--accent-primary)]">{activeRole}</span>
              </p>
            )}
          </div>

          <div className="mt-1 space-y-1">
            {items.map((item) => {
              const isCurrent = item.id === currentSurface;
              const roleQuery = activeRole ? `?role=${encodeURIComponent(activeRole)}` : "";
              const targetUrl = `${item.href}${roleQuery}`;

              return (
                <a
                  key={item.id}
                  href={targetUrl}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={`flex items-start justify-between rounded-xl px-3 py-2.5 transition-colors ${
                    isCurrent
                      ? "bg-[var(--bg-accent-subtle)] text-[var(--accent-primary)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="pr-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span>{locale === "vi" ? item.labelVi : item.labelEn}</span>
                      {isCurrent && (
                        <span className="rounded-full bg-[var(--accent-primary)] px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {locale === "vi" ? "Hiện tại" : "Current"}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                      {locale === "vi" ? item.descVi : item.descEn}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                    {item.shortcut}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
