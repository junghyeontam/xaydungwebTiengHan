"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  MoreVertical,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LESSONS_DATABASE } from "@/lib/data/lessons-data";

export default function AdminLessonsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft" | "in_review">("all");
  const [search, setSearch] = useState("");

  const lessonItems = Object.entries(LESSONS_DATABASE).map(([slug, detail]) => ({
    id: slug,
    slug,
    title: detail.title,
    koreanTitle: detail.koreanTitle,
    levelBadge: detail.levelBadge,
    levelName: detail.levelName,
    estimatedMinutes: detail.estimatedMinutes,
    totalXp: detail.totalXp,
    status: slug.includes("draft") ? "draft" : "published",
    updatedAt: "Hôm nay",
  }));

  const filteredLessons = lessonItems.filter((item) => {
    if (activeTab !== "all" && item.status !== activeTab) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.koreanTitle.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Content & Curriculum"
        title="Lessons Library"
        titleMuted={`· ${lessonItems.length} Lessons`}
        description="Quản lý toàn bộ danh mục bài học từ Hangul đến TOPIK 6. Hỗ trợ biên tập khối lý thuyết, ngữ pháp và bài tập tương tác."
        primaryAction={{
          label: "New Lesson Draft",
          icon: Plus,
          href: "/admin/teaching/lessons/new",
        }}
      />

      {/* Tabs and Filter Bar */}
      <div className="p-4 rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Tất cả" },
            { id: "published", label: "Đã xuất bản" },
            { id: "draft", label: "Bản nháp" },
            { id: "in_review", label: "Chờ duyệt" },
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-admin-text-placeholder absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên bài hoặc tiếng Hàn..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-admin-control border border-admin-border bg-admin-surface text-admin-text-primary placeholder:text-admin-text-placeholder focus:outline-none focus:ring-2 focus:ring-admin-brand-teal/30 focus:border-admin-brand-teal"
            />
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="rounded-admin-card bg-admin-surface border border-admin-border shadow-admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-admin-border bg-admin-subtle/40 text-admin-text-muted">
                <th className="py-3 px-4 font-medium">Tên Bài Học</th>
                <th className="py-3 px-4 font-medium">Cấp độ</th>
                <th className="py-3 px-4 font-medium">Thời lượng</th>
                <th className="py-3 px-4 font-medium">Thưởng XP</th>
                <th className="py-3 px-4 font-medium">Trạng thái</th>
                <th className="py-3 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/50">
              {filteredLessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-admin-subtle/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-admin-text-primary">{lesson.title}</p>
                      <p className="text-[11px] font-korean text-admin-text-muted">{lesson.koreanTitle}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-admin-pill bg-admin-subtle border border-admin-border text-[10px] font-semibold text-admin-text-secondary">
                      {lesson.levelBadge}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 num-tabular text-admin-text-secondary">
                    {lesson.estimatedMinutes} phút
                  </td>
                  <td className="py-3.5 px-4 num-tabular font-semibold text-admin-brand-teal">
                    +{lesson.totalXp} XP
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-admin-pill text-[10px] font-semibold bg-admin-success-tint text-admin-success border border-admin-success/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-admin-success" />
                      Xuất bản
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        target="_blank"
                        className="p-1 rounded-md text-admin-text-muted hover:text-admin-text-primary hover:bg-admin-subtle"
                        title="Xem live trên web học viên"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
