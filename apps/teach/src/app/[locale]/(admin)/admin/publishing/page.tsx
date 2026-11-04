"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, RotateCcw, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function AdminPublishingPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "published" | "scheduled" | "archived">("pending");

  const versions = [
    {
      id: "ver-101",
      slug: "beginner-1-lesson-4",
      title: "Bài 14: Kính ngữ & Đuôi câu trang trọng -(으)시-",
      versionNumber: 2,
      author: "Trần Hương (Teacher)",
      status: "in_review",
      submittedAt: "15 phút trước",
      changes: "Cập nhật 4 ví dụ ngữ pháp kính ngữ và thêm 2 bài tập nghe",
    },
    {
      id: "ver-102",
      slug: "beginner-1-lesson-5",
      title: "Bài 15: Cấu trúc biểu đạt ý định -(으)려고 하다",
      versionNumber: 1,
      author: "Nguyễn Văn Đạt (Editor)",
      status: "draft",
      submittedAt: "1 giờ trước",
      changes: "Khởi tạo bản nháp bài học mới",
    },
    {
      id: "ver-103",
      slug: "beginner-1-lesson-3-ayo-eoyo-endings",
      title: "Bài 3: Đuôi câu thân mật -아요/어요",
      versionNumber: 1,
      author: "Curriculum Team",
      status: "published",
      submittedAt: "Hôm qua",
      changes: "Phiên bản chuẩn đang hiển thị trên web học viên",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Publishing Workflow"
        title="Publishing & Review Inbox"
        titleMuted="· Zero-Downtime Rollback"
        description="Quy trình xuất bản nghiêm ngặt: Soạn thảo $\rightarrow$ Gửi duyệt $\rightarrow$ Phê duyệt $\rightarrow$ Xuất bản. Học viên không bao giờ bị ảnh hưởng bởi bản nháp đang chỉnh sửa."
      />

      <div className="p-4 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex items-center gap-2 overflow-x-auto">
        {[
          { id: "pending", label: "Chờ duyệt (2)" },
          { id: "published", label: "Đang hiển thị Live" },
          { id: "scheduled", label: "Đã lên lịch" },
          { id: "archived", label: "Lịch sử & Rollback" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-admin-control text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-admin-brand-teal/10 text-admin-brand-teal"
                : "text-admin-text-secondary hover:bg-admin-subtle hover:text-admin-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {versions.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="num text-[10px] font-bold px-1.5 py-0.2 rounded bg-admin-subtle border border-admin-border text-admin-text-muted">
                  v{v.versionNumber}
                </span>
                <h2 className="text-sm font-semibold text-admin-text-primary truncate">
                  {v.title}
                </h2>
                <span className="px-2 py-0.5 rounded-admin-pill bg-admin-warning-tint text-admin-warning text-[10px] font-semibold">
                  {v.status}
                </span>
              </div>
              <p className="text-xs text-admin-text-secondary">{v.changes}</p>
              <p className="text-[11px] text-admin-text-muted">
                Soạn bởi: <span className="font-medium text-admin-text-secondary">{v.author}</span> · {v.submittedAt}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="px-3 py-1.5 rounded-admin-control border border-admin-border bg-admin-surface hover:bg-admin-subtle text-xs font-medium text-admin-text-primary transition-colors"
              >
                Xem chi tiết
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-admin-control bg-admin-brand-coral hover:bg-admin-brand-coral/90 text-white text-xs font-semibold shadow-xs transition-all"
              >
                Phê duyệt & Xuất bản
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
