"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import {
  GraduationCap,
  BookOpen,
  Languages,
  FileText,
  Milestone,
  Send,
  LineChart,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function TeacherStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentRole } = useAdminAuth();

  const navLinks = [
    { href: "/admin/teaching/lessons", label: "Bài học của tôi", icon: BookOpen },
    { href: "/admin/teaching/vocabulary", label: "Kho từ vựng & Ô mục", icon: Languages },
    { href: "/admin/teaching/grammar", label: "Kho ngữ pháp", icon: FileText },
    { href: "/admin/teaching/roadmap", label: "Kế hoạch lộ trình", icon: Milestone },
    { href: "/admin/teaching/feedback", label: "Phản hồi kiểm duyệt", icon: Send },
    { href: "/admin/teaching/analytics", label: "Hiệu quả bài giảng", icon: LineChart },
  ];

  return (
    <div className="space-y-6">
      {/* Teacher Studio Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Teacher Studio · Giảng dạy
            </span>
            <span className="text-xs text-slate-300">
              Vai trò: <strong className="text-white capitalize">{currentRole.replace("_", " ")}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Xưởng Biên Soạn Giảng Dạy & Kho Học Liệu
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Tạo và duy trì các bài học ngữ pháp, bộ từ vựng theo chương mục, phục vụ học viên trên bản đồ lộ trình học tiếng Hàn.
          </p>
        </div>

        {/* Dual-Control Info Pill */}
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-slate-200 space-y-1 max-w-xs">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cơ chế kiểm soát kép (Dual Control)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            Nội dung sau khi lưu bản nháp sẽ được gửi sang Ban kiểm duyệt (Publisher/Admin) thẩm định trước khi xuất bản tới học viên.
          </p>
        </div>
      </div>

      {/* Teacher Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-border/60 scrollbar-none">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-white border border-brand-border text-brand-secondary hover:text-brand-navy hover:bg-brand-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main View Area */}
      <div>{children}</div>
    </div>
  );
}
