"use client";

import React, { useState, useEffect } from "react";
import {
  TheoryCollectionCard,
  INITIAL_THEORY_COLLECTIONS,
} from "@/lib/data/theory-collections-data";
import { loadTheoryCollections } from "@/lib/services/theory-storage-service";
import { RoadmapCollectionDetailModal } from "./RoadmapCollectionDetailModal";
import {
  Check,
  Search,
  BookOpen,
  Award,
  Sparkles,
  ChevronDown,
  Layers,
  GraduationCap,
} from "lucide-react";
import { formatNumber } from "@/lib/format";

interface Props {
  mode: "grammar" | "vocab-topik" | "vocab-topic";
}

export function RoadmapTheoryLibrary({ mode }: Props) {
  const [collections, setCollections] = useState<TheoryCollectionCard[]>(INITIAL_THEORY_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<TheoryCollectionCard | null>(null);
  const [vocabLevelFilter, setVocabLevelFilter] = useState<string>("topik-1");
  const [grammarLevelFilter, setGrammarLevelFilter] = useState<string>("all");
  const [isTestQuizModalOpen, setIsTestQuizModalOpen] = useState(false);

  // Load from local storage or listener
  useEffect(() => {
    const loaded = loadTheoryCollections();
    setCollections(loaded);

    const handleUpdate = () => {
      setCollections(loadTheoryCollections());
    };
    window.addEventListener("jh_theory_updated", handleUpdate);
    return () => window.removeEventListener("jh_theory_updated", handleUpdate);
  }, []);

  // 1. TOPIK Vocabulary Collections
  const vocabTopikCollections = collections.filter((c) => {
    if (c.type !== "vocab") return false;
    if (c.id === "vocab-unlearned") return true; // always show unlearned card
    if (vocabLevelFilter === "all") return true;
    return c.topikLevel === vocabLevelFilter;
  });

  // 2. Grammar Collections (TOPIK 1 to 6)
  const grammarCollections = collections.filter((c) => {
    if (c.type !== "grammar") return false;
    if (grammarLevelFilter === "all") return true;
    if (grammarLevelFilter === "beginner") return c.topikLevel === "topik-1" || c.topikLevel === "topik-2";
    if (grammarLevelFilter === "intermediate") return c.topikLevel === "topik-3" || c.topikLevel === "topik-4";
    if (grammarLevelFilter === "advanced") return c.topikLevel === "topik-5" || c.topikLevel === "topik-6";
    return true;
  });

  // 3. Topic Vocabulary Collections
  const topicCollections = collections.filter((c) => c.type === "topic");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* =========================================================================
          TAB 1: TỪ VỰNG CẤP TOPIK (CHỈ HIỂN THỊ TỪ VỰNG CẤP ĐỘ TOPIK)
          ========================================================================= */}
      {mode === "vocab-topik" && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border/60">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                  Từ vựng cấp độ TOPIK
                </h2>
                {/* Level Filter Dropdown */}
                <div className="relative">
                  <select
                    value={vocabLevelFilter}
                    onChange={(e) => setVocabLevelFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand-navy shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
                  >
                    <option value="topik-1">Cấp độ 1 (Sơ cấp 1)</option>
                    <option value="topik-2">Cấp độ 2 (Sơ cấp 2)</option>
                    <option value="all">Tất cả cấp độ</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-muted absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Kiểm tra Button */}
                <button
                  type="button"
                  onClick={() => setIsTestQuizModalOpen(true)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand-navy hover:bg-brand-surface shadow-xs transition-colors"
                >
                  Kiểm tra
                </button>
              </div>
              <p className="text-xs text-brand-secondary mt-1">
                Bộ từ vựng chuẩn hóa theo 6 cấp độ thi TOPIK Viện Ngôn ngữ Seoul.
              </p>
            </div>
          </div>

          {/* Cards Grid: 2 columns matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {vocabTopikCollections.map((col) => (
              <div
                key={col.id}
                onClick={() => setSelectedCollection(col)}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Left Icon matching Image 2 */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex flex-col items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tighter">Aa</span>
                    <div className="w-6 h-0.5 bg-white/60 rounded-full mt-0.5" />
                    <div className="w-4 h-0.5 bg-white/40 rounded-full mt-0.5" />
                  </div>

                  {/* Title & Progress */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                      {col.titleVi}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span className="num-tabular">
                        {formatNumber(col.completedCount)}/{formatNumber(col.totalCount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Badge / Action Indicator */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-xs font-medium text-brand-secondary bg-brand-surface px-3 py-1 rounded-full border border-brand-border/60">
                    Học từng mục &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: NGỮ PHÁP THEO LỘ TRÌNH (CHỈ HIỂN THỊ NGỮ PHÁP TOPIK 1 - 6)
          ========================================================================= */}
      {mode === "grammar" && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border/60">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                  Ngữ pháp
                </h2>
                {/* Level Filter Dropdown */}
                <div className="relative">
                  <select
                    value={grammarLevelFilter}
                    onChange={(e) => setGrammarLevelFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand-navy shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/30 cursor-pointer"
                  >
                    <option value="all">Theo cấp độ</option>
                    <option value="beginner">Sơ cấp (TOPIK 1 - 2)</option>
                    <option value="intermediate">Trung cấp (TOPIK 3 - 4)</option>
                    <option value="advanced">Cao cấp (TOPIK 5 - 6)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-muted absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
              <p className="text-xs text-brand-secondary mt-1">
                Các cấu trúc ngữ pháp trọng tâm theo 6 cấp độ thi TOPIK. Bấm vào từng cấp độ để học theo chương mục.
              </p>
            </div>
          </div>

          {/* Cards Grid: 2 columns x 3 rows matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {grammarCollections.map((col) => (
              <div
                key={col.id}
                onClick={() => setSelectedCollection(col)}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Left Icon matching Image 2: ABC with magnifying glass */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex flex-col items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <span className="font-extrabold text-xs sm:text-sm tracking-tighter">ABC</span>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-xs">
                      <Search className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                  </div>

                  {/* Title & Progress */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                      {col.titleVi}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span className="num-tabular">
                        {formatNumber(col.completedCount)}/{formatNumber(col.totalCount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-xs font-medium text-brand-secondary bg-brand-surface px-3 py-1 rounded-full border border-brand-border/60">
                    Xem mục &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: TỪ VỰNG THEO CHỦ ĐỀ (CHỈ HIỂN THỊ CÁC BỘ THẺ THEO CHỦ ĐỀ GIAO TIẾP)
          ========================================================================= */}
      {mode === "vocab-topic" && (
        <section className="space-y-5">
          <div className="pb-3 border-b border-brand-border/60">
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
              Từ vựng theo chủ đề thực chiến
            </h2>
            <p className="text-xs text-brand-secondary mt-1">
              Hệ thống từ vựng chuyên sâu theo từng bối cảnh đời sống, công sở và giao tiếp tại Hàn Quốc.
            </p>
          </div>

          {/* Topic Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {topicCollections.map((col) => (
              <div
                key={col.id}
                onClick={() => setSelectedCollection(col)}
                className="group rounded-2xl bg-white border border-brand-border/80 hover:border-brand-primary/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Card Green Top Header Banner */}
                <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-700 p-3.5 flex items-start justify-between text-white relative overflow-hidden">
                  <div className="space-y-0.5 z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs">
                      {col.levelBadge}
                    </span>
                  </div>
                  <BookOpen className="w-5 h-5 text-white/80 z-10" />
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-brand-navy group-hover:text-brand-primary transition-colors line-clamp-1">
                      {col.titleVi}
                    </h3>
                    <p className="text-xs text-brand-secondary font-korean line-clamp-1">
                      {col.koreanTitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="num-tabular">
                        {formatNumber(col.completedCount)}/{formatNumber(col.totalCount)}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-secondary font-normal">
                      {col.chapters.length} chương
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          MODAL: CHAPTER & ITEM DETAIL STUDY MODAL (DÙNG CHUNG KHI BẤM BẤT KỲ THẺ NÀO)
          ========================================================================= */}
      {selectedCollection && (
        <RoadmapCollectionDetailModal
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
          onCollectionUpdated={(updated) => {
            setSelectedCollection(updated);
            setCollections(loadTheoryCollections());
          }}
        />
      )}

      {/* Quick Test / Quiz Modal */}
      {isTestQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-navy">
                  Kiểm tra từ vựng nhanh
                </h3>
                <p className="text-xs text-brand-secondary">
                  Đánh giá vốn từ vựng hiện tại của bạn
                </p>
              </div>
            </div>

            <p className="text-xs text-brand-navy leading-relaxed bg-brand-surface p-3.5 rounded-xl border border-brand-border/60">
              Hệ thống sẽ chọn ngẫu nhiên 15 từ vựng trong Cấp độ 1 để kiểm tra nghĩa, phát âm và cách dùng trong câu. Sau khi hoàn thành, các từ làm đúng sẽ tự động cập nhật vào tiến độ đã thuộc!
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsTestQuizModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-secondary hover:bg-brand-surface"
              >
                Để sau
              </button>
              <button
                onClick={() => {
                  setIsTestQuizModalOpen(false);
                  if (collections.length > 0) {
                    setSelectedCollection(collections[0]);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-primary text-white shadow-xs hover:bg-brand-primary/90"
              >
                Bắt đầu kiểm tra ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
