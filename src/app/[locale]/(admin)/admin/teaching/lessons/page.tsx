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
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";

interface LessonDraftItem {
  id: string;
  slug: string;
  lessonNumber: number;
  titleVi: string;
  koreanSubtitle: string;
  kind: "grammar" | "topic_vocabulary";
  levelBadge: string;
  status: "draft" | "submitted" | "changes_requested" | "published";
  durationMinutes: number;
  xpReward: number;
  updatedAt: string;
}

export default function TeacherLessonsPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "draft" | "submitted" | "changes_requested" | "published"
  >("all");
  const [search, setSearch] = useState("");

  const [lessons, setLessons] = useState<LessonDraftItem[]>([
    {
      id: "lesson-1",
      slug: "so-cap-1-bai-1-danh-tu-la-gi",
      lessonNumber: 1,
      titleVi: "Bài 1: Giới thiệu bản thân (은/는 & 이에요/예요)",
      koreanSubtitle: "자기소개 · N은/는 N이에요/예요",
      kind: "grammar",
      levelBadge: "TOPIK 1",
      status: "published",
      durationMinutes: 20,
      xpReward: 35,
      updatedAt: "Hôm nay",
    },
    {
      id: "lesson-2",
      slug: "so-cap-1-bai-2-co-va-khong-co",
      lessonNumber: 2,
      titleVi: "Bài 2: Tồn tại & Sở hữu (이/가 & 있어요/없어요)",
      koreanSubtitle: "존재와 소유 · N이/가 있어요/없어요",
      kind: "grammar",
      levelBadge: "TOPIK 1",
      status: "published",
      durationMinutes: 20,
      xpReward: 35,
      updatedAt: "Hôm qua",
    },
    {
      id: "lesson-3",
      slug: "so-cap-1-bai-3-duoi-cau-ayo-eoyo",
      lessonNumber: 3,
      titleVi: "Bài 3: Đuôi câu thân mật (-아요 / -어요 / -여요)",
      koreanSubtitle: "해요체 기본 종결어미",
      kind: "grammar",
      levelBadge: "TOPIK 1",
      status: "submitted",
      durationMinutes: 25,
      xpReward: 40,
      updatedAt: "2 giờ trước",
    },
    {
      id: "lesson-4",
      slug: "so-cap-1-bai-4-tan-ngu-va-dia-diem",
      lessonNumber: 4,
      titleVi: "Bài 4: Hành động & Địa điểm (-을/를 & -에 가요)",
      koreanSubtitle: "목적격 조사 · N을/를 & 장소-에 가요",
      kind: "grammar",
      levelBadge: "TOPIK 1",
      status: "draft",
      durationMinutes: 20,
      xpReward: 35,
      updatedAt: "Đang soạn thảo",
    },
    {
      id: "lesson-5",
      slug: "tu-vung-chu-de-quan-ca-phe",
      lessonNumber: 1,
      titleVi: "Từ vựng Quán Cà phê & Đặt đồ uống tại Seoul",
      koreanSubtitle: "카페 주문 실전 어휘",
      kind: "topic_vocabulary",
      levelBadge: "Giao tiếp",
      status: "draft",
      durationMinutes: 15,
      xpReward: 30,
      updatedAt: "Vừa xong",
    },
  ]);

  const filtered = lessons.filter((item) => {
    if (activeTab !== "all" && item.status !== activeTab) return false;
    if (
      search &&
      !item.titleVi.toLowerCase().includes(search.toLowerCase()) &&
      !item.koreanSubtitle.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSubmitForReview = (id: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "submitted" } : l))
    );
    alert(
      "Đã gửi bài học sang Ban kiểm duyệt (Publisher). Bạn sẽ nhận được thông báo khi có phản hồi!"
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
              Quản lý bài giảng
            </span>
            <span className="text-xs text-brand-secondary">
              Danh sách các bản nháp & bài học được phân công
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy">
            Bài Học Ngữ Pháp & Từ Vựng Của Tôi
          </h2>
        </div>

        <Link href="/admin/teaching/lessons/new">
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Soạn bài học mới
          </Button>
        </Link>
      </div>

      {/* Filter and Tab Bar */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: "all", label: "Tất cả" },
            { id: "draft", label: "Bản nháp" },
            { id: "submitted", label: "Đã gửi duyệt" },
            { id: "changes_requested", label: "Cần sửa" },
            { id: "published", label: "Đã xuất bản" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-brand-surface text-brand-secondary hover:text-brand-navy hover:bg-brand-border/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề, tiếng Hàn..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-brand-border bg-white text-brand-navy placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
        </div>
      </div>

      {/* Lessons Table */}
      <div className="rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/60 text-brand-secondary font-semibold">
                <th className="py-3 px-4">Bài số</th>
                <th className="py-3 px-4">Tiêu đề bài học</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4">Cấp độ</th>
                <th className="py-3 px-4">Thời lượng / XP</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {filtered.map((item) => {
                const isDraft = item.status === "draft";
                const isSubmitted = item.status === "submitted";
                const isPublished = item.status === "published";

                return (
                  <tr key={item.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      #{item.lessonNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-sm text-brand-navy hover:text-brand-primary cursor-pointer">
                          {item.titleVi}
                        </div>
                        <span className="text-xs text-brand-secondary font-korean font-medium">
                          {item.koreanSubtitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-surface border border-brand-border text-brand-secondary">
                        {item.kind === "grammar" ? "Ngữ pháp" : "Từ vựng chuyên đề"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-brand-navy">
                      {item.levelBadge}
                    </td>

                    <td className="py-3.5 px-4 text-brand-secondary">
                      <span className="font-semibold text-brand-navy">{item.durationMinutes}p</span> · +{item.xpReward} XP
                    </td>

                    <td className="py-3.5 px-4">
                      {isPublished && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã xuất bản
                        </span>
                      )}
                      {isSubmitted && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Chờ duyệt
                        </span>
                      )}
                      {isDraft && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 w-fit">
                          Bản nháp
                        </span>
                      )}
                      {item.status === "changes_requested" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                          Cần chỉnh sửa
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isDraft && (
                          <button
                            type="button"
                            onClick={() => handleSubmitForReview(item.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Gửi duyệt
                          </button>
                        )}
                        <Link
                          href={`/admin/teaching/lessons/new?edit=${item.id}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-surface border border-brand-border text-brand-navy hover:bg-brand-border/40 transition-colors"
                        >
                          Chỉnh sửa
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
