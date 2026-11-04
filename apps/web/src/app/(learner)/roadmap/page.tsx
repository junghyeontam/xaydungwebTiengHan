"use client";

import React, { useState } from "react";
import {
  ROADMAP_LEVELS_DATA,
  ROADMAP_CATEGORIES,
  RoadmapNode,
} from "@/lib/data/roadmap-data";
import { RoadmapLeftSidebar } from "@/components/roadmap/RoadmapLeftSidebar";
import { RoadmapNodeMap } from "@/components/roadmap/RoadmapNodeMap";
import { LessonPreviewModal } from "@/components/roadmap/LessonPreviewModal";
import { RoadmapTheoryLibrary } from "@/components/roadmap/RoadmapTheoryLibrary";
import { PlacementTestModal } from "@/components/consultation/PlacementTestModal";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import {
  Compass,
  Zap,
  LayoutGrid,
  GitBranch,
} from "lucide-react";

export default function RoadmapPage() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState("grammar");
  const [grammarViewMode, setGrammarViewMode] = useState<"library" | "timeline">("library");
  const [selectedLevelId, setSelectedLevelId] = useState("topik-1");
  const [previewNode, setPreviewNode] = useState<RoadmapNode | null>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  const currentLevel =
    ROADMAP_LEVELS_DATA.find((l) => l.id === selectedLevelId) || ROADMAP_LEVELS_DATA[1];

  return (
    <div className="min-h-screen bg-brand-bg transition-colors py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 space-y-8">
        {/* 1. Roadmap page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border">
          <div className="space-y-2">
            <Badge variant="tint">
              <Compass className="w-3.5 h-3.5 mr-1" />
              <span>
                {isEn
                  ? "Standardized 6 TOPIK Levels Roadmap"
                  : "Lộ trình chuẩn hóa 6 cấp độ TOPIK"}
              </span>
            </Badge>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
              {isEn ? "Korean Mastery Roadmap" : "Bản đồ chinh phục tiếng Hàn"}
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-2xl leading-relaxed">
              {isEn
                ? "Clear stages from scratch to TOPIK 6. Master each lesson before progressing!"
                : "Từng chặng đường rõ ràng từ con số 0 đến TOPIK 6. Học xong bài nào, nắm chắc bài đó!"}
            </p>
          </div>

          {/* Level skip challenge button */}
          <Button
            onClick={() => setIsChallengeModalOpen(true)}
            variant="cta"
            size="md"
            icon={<Zap className="w-4 h-4" />}
          >
            {isEn ? "Skip Level Challenge" : "Kiểm tra vượt cấp"}
          </Button>
        </div>

        {/* 2. Category Tabs & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border/60">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {ROADMAP_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    if (cat.id === "hangul") setSelectedLevelId("hangul");
                    if (cat.id === "grammar") setSelectedLevelId("topik-1");
                  }}
                  className={`px-4 py-2 rounded-control text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-brand-bg border border-brand-border text-brand-secondary hover:text-brand-navy hover:bg-brand-surface"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle when on grammar tab */}
          {activeTab === "grammar" && (
            <div className="flex items-center gap-1 bg-brand-surface p-1 rounded-xl border border-brand-border/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setGrammarViewMode("library")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  grammarViewMode === "library"
                    ? "bg-white text-brand-navy shadow-xs"
                    : "text-brand-secondary hover:text-brand-navy"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Bộ thẻ ngữ pháp</span>
              </button>
              <button
                type="button"
                onClick={() => setGrammarViewMode("timeline")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  grammarViewMode === "timeline"
                    ? "bg-white text-brand-navy shadow-xs"
                    : "text-brand-secondary hover:text-brand-navy"
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Chuỗi bài học</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Main Content: Strictly separated by Category */}
        {activeTab === "grammar" && grammarViewMode === "library" ? (
          /* TAB NGỮ PHÁP -> CHỈ HIỂN THỊ CÁC THẺ NGỮ PHÁP (TOPIK 1 - 6) */
          <div className="pt-2">
            <RoadmapTheoryLibrary mode="grammar" />
          </div>
        ) : activeTab === "vocab-topik" ? (
          /* TAB TỪ VỰNG CẤP TOPIK -> CHỈ HIỂN THỊ TỪ VỰNG CẤP ĐỘ TOPIK */
          <div className="pt-2">
            <RoadmapTheoryLibrary mode="vocab-topik" />
          </div>
        ) : activeTab === "vocab-topic" ? (
          /* TAB TỪ VỰNG THEO CHỦ ĐỀ -> CHỈ HIỂN THỊ CÁC CHỦ ĐỀ GIAO TIẾP THỰC CHIẾN */
          <div className="pt-2">
            <RoadmapTheoryLibrary mode="vocab-topic" />
          </div>
        ) : (
          /* TIMELINE VIEW (ÁP DỤNG KHI CHỌN CHUỖI BÀI HỌC HOẶC HANGUL / HỘI THOẠI) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột trái (4 cols): Danh sách cấp độ */}
            <div className="lg:col-span-4 sticky top-24">
              <RoadmapLeftSidebar
                levels={ROADMAP_LEVELS_DATA}
                selectedLevelId={selectedLevelId}
                onSelectLevel={setSelectedLevelId}
                onOpenChallenge={() => setIsChallengeModalOpen(true)}
              />
            </div>

            {/* Cột phải (8 cols): Bản đồ chuỗi bài học */}
            <div className="lg:col-span-8">
              <RoadmapNodeMap
                level={currentLevel}
                onSelectNode={(node) => setPreviewNode(node)}
              />
            </div>
          </div>
        )}

        {/* Modal xem trước bài học */}
        {previewNode && (
          <LessonPreviewModal
            node={previewNode}
            onClose={() => setPreviewNode(null)}
          />
        )}

        {/* Modal kiểm tra vượt cấp */}
        <PlacementTestModal
          isOpen={isChallengeModalOpen}
          onClose={() => setIsChallengeModalOpen(false)}
        />
      </div>
    </div>
  );
}
