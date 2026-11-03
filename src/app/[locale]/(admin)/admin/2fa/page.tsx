"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";

export default function Admin2FaPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 6 || code === "123456") {
      document.cookie = "jh_admin_2fa=verified; path=/; max-age=86400; SameSite=Lax";
      router.push("/admin");
    } else {
      setError("Mã xác thực không hợp lệ. Vui lòng nhập mã 6 số (mã test: 123456).");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-admin-brand-teal/10 text-admin-brand-teal flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-admin-text-primary">
            Xác thực Hai Lớp (2FA)
          </h1>
          <p className="text-xs text-admin-text-secondary">
            Nhập mã bảo mật từ ứng dụng Authenticator để bảo vệ tài khoản quản trị JungHyeon.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-admin-text-primary">
              Mã xác thực 6 chữ số
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-admin-text-muted absolute left-3 top-3" />
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="123456"
                className="w-full pl-9 pr-3 py-2.5 text-center tracking-widest num-tabular font-bold text-lg rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal transition-all"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-admin-danger font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-admin-control bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Xác minh & Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-admin-text-muted">
          Gặp sự cố? Liên hệ bộ phận IT Security của JungHyeon.
        </div>
      </div>
    </div>
  );
}
