"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import type { AdminRole } from "@/features/auth-rbac/types";
import { Shield, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAdminAuth();

  const [email, setEmail] = useState("admin@junghyeon.vn");
  const [password, setPassword] = useState("••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(email, password);
      router.push("/admin");
    }, 400);
  };

  const handleQuickLoginRole = (role: AdminRole, roleName: string) => {
    switchRole(role);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center">
            <BrandLogo size="lg" adminBadge showSubtitle />
          </div>
          <h1 className="text-xl font-extrabold text-foreground pt-2">
            Đăng nhập Quản trị viên
          </h1>
          <p className="text-xs text-muted-foreground">
            Hệ thống phân quyền RBAC & Quản trị trung tâm Tiếng Hàn JungHyeon
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-junghyeon-teal" />
                <span>Email quản trị</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-secondary/50 border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-junghyeon-teal"
                placeholder="admin@junghyeon.vn"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-junghyeon-teal" />
                <span>Mật khẩu bảo mật</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-secondary/50 border border-border text-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-junghyeon-teal"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-junghyeon-dark hover:bg-junghyeon-dark/90 text-white dark:bg-junghyeon-teal dark:text-junghyeon-dark font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-soft"
            >
              <span>{isSubmitting ? "Đang xác thực..." : "Đăng nhập Cổng Admin"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick RBAC Role Selector for Evaluator/Testing */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase">
              <Sparkles className="w-3.5 h-3.5 text-junghyeon-coral" />
              <span>Đăng nhập thử nghiệm nhanh theo Vai trò</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLoginRole("super_admin", "Super Admin")}
                className="p-2 rounded-xl bg-secondary/70 hover:bg-junghyeon-teal hover:text-white text-foreground font-semibold text-left transition-colors border border-border/60"
              >
                Super Admin
              </button>
              <button
                onClick={() => handleQuickLoginRole("content_editor", "Biên tập viên")}
                className="p-2 rounded-xl bg-secondary/70 hover:bg-junghyeon-teal hover:text-white text-foreground font-semibold text-left transition-colors border border-border/60"
              >
                Biên tập viên
              </button>
              <button
                onClick={() => handleQuickLoginRole("publisher", "Kiểm duyệt")}
                className="p-2 rounded-xl bg-secondary/70 hover:bg-junghyeon-teal hover:text-white text-foreground font-semibold text-left transition-colors border border-border/60"
              >
                Kiểm duyệt viên
              </button>
              <button
                onClick={() => handleQuickLoginRole("sales_lead", "Tư vấn & Sales")}
                className="p-2 rounded-xl bg-secondary/70 hover:bg-junghyeon-teal hover:text-white text-foreground font-semibold text-left transition-colors border border-border/60"
              >
                Tư vấn Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
