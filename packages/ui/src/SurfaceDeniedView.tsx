"use client";

import React from "react";
import { SURFACE_URLS, type SurfaceId } from "@junghyeon/config";

export interface SurfaceDeniedViewProps {
  surface: SurfaceId;
  activeRole?: string | null;
  reason?: string;
  suggestedSurface?: SurfaceId;
  suggestedSurfaceUrl?: string;
  locale?: "vi" | "en";
  loginUrl?: string;
}

const SURFACE_NAMES: Record<SurfaceId, { vi: string; en: string }> = {
  web: { vi: "Cổng Học viên (junghyeon.com)", en: "Learner Hub (junghyeon.com)" },
  teach: { vi: "Teacher Studio (teach.junghyeon.com)", en: "Teacher Studio (teach.junghyeon.com)" },
  admin: { vi: "Back-Office Admin (admin.junghyeon.com)", en: "Back-Office Admin (admin.junghyeon.com)" },
  system: { vi: "Khu vực Hệ thống (/system/**)", en: "System Control Area (/system/**)" },
};

export function SurfaceDeniedView({
  surface,
  activeRole = "guest",
  reason = "SURFACE_FORBIDDEN",
  suggestedSurface = "web",
  suggestedSurfaceUrl,
  locale = "vi",
  loginUrl,
}: SurfaceDeniedViewProps) {
  const targetSurfaceUrl = suggestedSurfaceUrl || SURFACE_URLS[suggestedSurface] || SURFACE_URLS.web;
  const switchAccountUrl = loginUrl || `${SURFACE_URLS.web}/auth`;
  const surfaceLabel = SURFACE_NAMES[surface]?.[locale] ?? surface;
  const suggestedLabel = SURFACE_NAMES[suggestedSurface]?.[locale] ?? suggestedSurface;

  return (
    <div
      className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[var(--bg-app)] text-[var(--text-primary)]"
      data-testid="surface-denied-403"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-sm text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--state-danger-bg,rgba(220,38,38,0.1))] text-[var(--state-danger,#dc2626)]">
          <span className="text-lg font-extrabold" style={{ fontVariantNumeric: "lining-nums" }}>
            403
          </span>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[var(--state-danger,#dc2626)]">
          {locale === "vi" ? "Từ chối truy cập phân vùng (Default-Deny)" : "Surface Access Denied (Default-Deny)"}
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
          {locale === "vi"
            ? `Tài khoản không có quyền vào ${surfaceLabel}`
            : `Your role does not have access to ${surfaceLabel}`}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          {locale === "vi"
            ? `Vai trò hiện tại của bạn (${activeRole || "guest"}) không nằm trong danh sách cho phép của phân vùng này (${reason}). Để đảm bảo an toàn, hệ thống không tự động chuyển hướng vòng lặp.`
            : `Your current role (${activeRole || "guest"}) is not permitted on this surface (${reason}). To prevent redirect loops, access is explicitly halted here.`}
        </p>

        <div className="mt-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">
              {locale === "vi" ? "Phân vùng yêu cầu:" : "Requested Surface:"}
            </span>
            <span className="font-semibold text-[var(--text-primary)]">{surface}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">
              {locale === "vi" ? "Vai trò hiện tại:" : "Active Role:"}
            </span>
            <span className="font-semibold text-[var(--accent-primary)]">{activeRole || "guest"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">
              {locale === "vi" ? "Mã kiểm soát:" : "Policy Code:"}
            </span>
            <span className="font-semibold text-[var(--text-primary)]">{reason}</span>
          </div>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={targetSurfaceUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[var(--accent-primary)] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            {locale === "vi" ? `Mở ${suggestedLabel}` : `Go to ${suggestedLabel}`}
          </a>

          <a
            href={switchAccountUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-elevated)]"
          >
            {locale === "vi" ? "Chuyển đổi tài khoản khác" : "Switch Account"}
          </a>
        </div>
      </div>
    </div>
  );
}
