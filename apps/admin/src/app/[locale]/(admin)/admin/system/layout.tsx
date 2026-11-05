"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, KeyRound, CheckCircle2, Lock } from "lucide-react";

const SYSTEM_NAV_ITEMS = [
  { slug: "roles", labelVi: "Vai trò (Roles)", labelEn: "Roles" },
  { slug: "permissions", labelVi: "Quyền hạn (Permissions)", labelEn: "Permissions" },
  { slug: "staff", labelVi: "Nhân sự & 2FA", labelEn: "Staff & 2FA" },
  { slug: "impersonation", labelVi: "Giả lập xem (15p)", labelEn: "Impersonation (15m)" },
  { slug: "audit-log", labelVi: "Nhật ký Audit", labelEn: "Audit Log" },
  { slug: "security-audit", labelVi: "Kiểm toán RLS", labelEn: "Security & RLS" },
  { slug: "feature-flags", labelVi: "Feature Flags", labelEn: "Feature Flags" },
  { slug: "payment-keys", labelVi: "Khóa Thanh toán", labelEn: "Payment Keys" },
  { slug: "integrations", labelVi: "Tích hợp API", labelEn: "Integrations" },
  { slug: "backups", labelVi: "Sao lưu DB", labelEn: "Backups" },
  { slug: "maintenance", labelVi: "Bảo trì Hệ thống", labelEn: "Maintenance" },
] as const;

export default function SystemAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "vi";
  const [reAuthFresh, setReAuthFresh] = useState(true);
  const [reAuthModalOpen, setReAuthModalOpen] = useState(false);
  const [totpCode, setTotpCode] = useState("123456");
  const [verifying, setVerifying] = useState(false);

  const handleStepUpReAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/sso-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "super_admin",
          verify2FA: true,
          stepUpReAuth: true,
          totpCode,
        }),
      });
      if (res.ok) {
        setReAuthFresh(true);
        setReAuthModalOpen(false);
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="system-area-shell">
      {/* High-Security System Area Banner */}
      <div
        data-testid="system-area-banner"
        className="rounded-2xl border border-[var(--state-danger,#dc2626)]/30 bg-[var(--state-danger-bg,rgba(220,38,38,0.08))] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--state-danger,#dc2626)] text-white">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--state-danger,#dc2626)]">
                {locale === "vi"
                  ? "KHU VỰC HẠ TẦNG TỐI CAO (/SYSTEM)"
                  : "HIGH-SECURITY SYSTEM AREA (/SYSTEM)"}
              </span>
              <span className="rounded-full bg-[var(--state-danger,#dc2626)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--state-danger,#dc2626)]">
                SUPER_ADMIN ONLY · 2FA ENFORCED
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {locale === "vi"
                ? "Mọi thao tác thay đổi tại phân vùng này yêu cầu xác thực lại (Step-Up Re-Auth <= 15 phút) và được ghi nhận bất biến vào bảng audit_logs."
                : "All mutations in this area require fresh Step-Up Re-Authentication (<= 15 minutes) and write immutable records to audit_logs."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]"
             style={{ fontVariantNumeric: "lining-nums" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span>{reAuthFresh ? "Re-Auth <= 15m Active" : "Re-Auth Expired"}</span>
          </span>
          <button
            type="button"
            onClick={() => setReAuthModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--state-danger,#dc2626)] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>{locale === "vi" ? "Làm mới Re-Auth (15p)" : "Refresh Step-Up (15m)"}</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation across all 11 /system/** modules */}
      <nav
        aria-label="System Area Navigation"
        className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[var(--border-subtle)]"
      >
        {SYSTEM_NAV_ITEMS.map((item) => {
          const active = pathname?.endsWith(`/system/${item.slug}`);
          return (
            <Link
              key={item.slug}
              href={`/system/${item.slug}`}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                active
                  ? "bg-[var(--accent-primary)] text-white shadow-xs"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
              }`}
            >
              {locale === "vi" ? item.labelVi : item.labelEn}
            </Link>
          );
        })}
      </nav>

      {/* Main System Module Content */}
      <div>{children}</div>

      {/* Step-Up Re-Authentication Modal */}
      {reAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          data-testid="stepup-reauth-modal"
        >
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--state-danger-bg,rgba(220,38,38,0.1))] text-[var(--state-danger,#dc2626)]">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  {locale === "vi" ? "Xác thực bước 2 (Step-Up Re-Auth)" : "Step-Up Re-Authentication"}
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {locale === "vi"
                    ? "Mở khóa quyền thay đổi cấu hình /system trong 15 phút"
                    : "Unlocks /system mutation privileges for 15 minutes"}
                </p>
              </div>
            </div>

            <form onSubmit={handleStepUpReAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  {locale === "vi" ? "Mã xác thực 2FA (TOTP 6 số)" : "2FA Authenticator Code (6 digits)"}
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  maxLength={6}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2 text-sm font-bold text-[var(--text-primary)]"
                  style={{ fontVariantNumeric: "lining-nums" }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReAuthModalOpen(false)}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)]"
                >
                  {locale === "vi" ? "Hủy" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className="rounded-xl bg-[var(--state-danger,#dc2626)] px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  {verifying
                    ? locale === "vi"
                      ? "Đang xác thực..."
                      : "Verifying..."
                    : locale === "vi"
                    ? "Xác nhận Re-Auth (15 phút)"
                    : "Confirm Re-Auth (15m)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
