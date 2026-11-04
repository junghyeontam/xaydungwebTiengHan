"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Languages,
  FileText,
  Milestone,
  Send,
  GraduationCap,
  CheckSquare,
  LineChart,
  FolderKanban,
  Plus,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { Num, Percent } from "@/components/shared";

export default function TeacherStudioHomePage() {
  const { user, currentRole } = useAdminAuth();

  const studioCards = [
    {
      title: "Bài giảng của tôi (Lessons)",
      desc: "Soạn thảo, chỉnh sửa bài học Ngữ pháp & Từ vựng theo lộ trình TOPIK 1–6.",
      href: "/lessons",
      icon: BookOpen,
      badge: "12 bài",
    },
    {
      title: "Kho Từ vựng (Vocabulary Bank)",
      desc: "Quản lý thư mục bài học và danh sách từ vựng, ví dụ, âm thanh chuẩn.",
      href: "/banks/vocabulary",
      icon: Languages,
      badge: "3-Tier Sync",
    },
    {
      title: "Kho Ngữ pháp (Grammar Bank)",
      desc: "Quản lý cấu trúc ngữ pháp, quy tắc chia đuôi câu và bài tập vận dụng.",
      href: "/banks/grammar",
      icon: FileText,
      badge: "TOPIK 1–6",
    },
    {
      title: "Sơ đồ Lộ trình (Roadmap Planner)",
      desc: "Sắp xếp thứ tự bài học và điều kiện mở khoá giữa các chặng.",
      href: "/roadmap-planner",
      icon: Milestone,
      badge: "Planner",
    },
    {
      title: "Phản hồi & Duyệt bài (Review & Feedback)",
      desc: "Xem nhận xét biên tập và phê duyệt xuất bản giáo trình (Two-Person Rule).",
      href: "/review-feedback",
      icon: Send,
      badge: "3 chờ duyệt",
    },
    {
      title: "Lớp học phụ trách (My Classes)",
      desc: "Theo dõi danh sách học viên và tiến độ hoàn thành trong lớp được phân công.",
      href: "/classes",
      icon: GraduationCap,
      badge: "4 lớp",
    },
    {
      title: "Chấm bài & Đánh giá (Grading)",
      desc: "Chấm điểm bài tập viết, phát âm và phản hồi trực tiếp cho học viên.",
      href: "/grading",
      icon: CheckSquare,
      badge: "8 bài nộp",
    },
    {
      title: "Thư viện Học liệu (Media Library)",
      desc: "Quản lý tệp âm thanh phát âm chuẩn Seoul, hình ảnh minh họa và PDF.",
      href: "/media",
      icon: FolderKanban,
      badge: "Audio & PDF",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-card bg-brand-tint border border-brand-frame/70 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-bg border border-brand-frame text-brand-primary font-bold text-xs uppercase tracking-wider">
              Teacher Studio • teach.junghyeon.com
            </span>
            <span className="text-xs text-brand-secondary">
              Vai trò: <strong className="text-brand-navy capitalize">{currentRole}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
            Xin chào, {user?.name || "Giảng viên"}!
          </h1>
          <p className="text-xs text-brand-secondary max-w-2xl">
            Không gian biên soạn giáo trình, kho từ vựng & ngữ pháp TOPIK 1–6, chấm bài và theo dõi lớp học phụ trách.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/lessons/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-control bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài giảng mới</span>
          </Link>
        </div>
      </div>

      {/* Studio KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-xs">
          <div className="text-xs font-medium text-admin-text-muted">Bài giảng đang phụ trách</div>
          <div className="text-2xl font-bold text-admin-text-primary mt-1">
            <Num value={24} /> <span className="text-xs font-normal text-admin-text-muted">bài học</span>
          </div>
        </div>
        <div className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-xs">
          <div className="text-xs font-medium text-admin-text-muted">Tỉ lệ học viên hoàn thành bài</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            <Percent value={0.864} />
          </div>
        </div>
        <div className="p-5 rounded-card bg-admin-surface border border-admin-border shadow-xs">
          <div className="text-xs font-medium text-admin-text-muted">Học viên trong lớp phụ trách</div>
          <div className="text-2xl font-bold text-admin-text-primary mt-1">
            <Num value={128} /> <span className="text-xs font-normal text-admin-text-muted">học viên</span>
          </div>
        </div>
      </div>

      {/* Studio Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studioCards.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group p-5 rounded-card bg-admin-surface hover:bg-admin-subtle border border-admin-border transition-all shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-admin-subtle border border-admin-border text-admin-text-secondary">
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-admin-text-primary group-hover:text-brand-primary transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs text-admin-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="text-[11px] font-semibold text-brand-primary flex items-center gap-1">
                <span>Mở phân hệ</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
