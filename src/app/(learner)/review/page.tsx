"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSrs, SrsDeck } from "@/lib/context/SrsContext";
import { StudySession } from "@/components/srs/StudySession";
import { CreateDeckModal } from "@/components/srs/CreateDeckModal";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  Repeat,
  Plus,
  Play,
  Sparkles,
  BookOpen,
  Compass,
  FileSpreadsheet,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

export default function ReviewPage() {
  const { decks, cards, stats, getDeckStats, getDueCardsForDeck } = useSrs();

  const [activeStudyDeck, setActiveStudyDeck] = useState<SrsDeck | null>(null);
  const [isStudyAllDue, setIsStudyAllDue] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // If currently active in a study review session
  if (activeStudyDeck || isStudyAllDue) {
    const studyCards = isStudyAllDue
      ? cards.filter((c) => c.repetitions === 0 || c.nextReviewDate <= new Date().toISOString())
      : getDueCardsForDeck(activeStudyDeck!.id);

    return (
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <StudySession
          cards={studyCards.length > 0 ? studyCards : (activeStudyDeck ? cards.filter(c => c.deckId === activeStudyDeck.id) : cards)}
          deckTitle={isStudyAllDue ? "Tất cả thẻ cần ôn hôm nay" : activeStudyDeck!.title}
          onFinish={() => {
            setActiveStudyDeck(null);
            setIsStudyAllDue(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Review Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-brand-primary dark:text-[#BFD9F7] text-xs font-semibold border border-[#D5E5FA] dark:border-white/10 shadow-2xs mb-2">
            <BrainCircuit className="w-4 h-4 text-brand-primary" />
            <span>Thuật toán Lặp lại ngắt quãng (SM-2 SRS)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy">
            Bộ thẻ Flashcard ghi nhớ dài hạn
          </h1>
          <p className="text-sm text-brand-secondary mt-1 max-w-2xl">
            Ôn đúng thời điểm vàng bạn sắp quên. Ghi nhớ 3.000+ từ vựng tiếng Hàn vĩnh viễn với chỉ 15 phút mỗi ngày.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#D5E5FA] dark:border-brand-border bg-white dark:bg-brand-surface hover:bg-[#F7F9FC] text-xs font-bold text-brand-navy dark:text-white transition-all shadow-2xs"
          >
            <Compass className="w-4 h-4 text-brand-primary" />
            <span>Về Lộ trình</span>
          </Link>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bộ thẻ mới</span>
          </button>
        </div>
      </div>

      {/* 2. SM-2 Four Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Due Today */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-brand-secondary font-medium">Cần ôn hôm nay</div>
            <div className="text-2xl font-extrabold text-brand-navy font-num">
              {stats.dueToday} <span className="text-xs text-amber-600 font-semibold">thẻ 🔥</span>
            </div>
          </div>
        </div>

        {/* New Cards */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5FF] dark:bg-blue-950/40 text-brand-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-brand-secondary font-medium">Thẻ mới tinh</div>
            <div className="text-2xl font-extrabold text-brand-navy font-num">
              {stats.newCards} <span className="text-xs text-brand-secondary">thẻ</span>
            </div>
          </div>
        </div>

        {/* Learning */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-brand-secondary font-medium">Đang học</div>
            <div className="text-2xl font-extrabold text-brand-navy font-num">
              {stats.learning} <span className="text-xs text-brand-secondary">thẻ</span>
            </div>
          </div>
        </div>

        {/* Mastered */}
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-brand-secondary font-medium">Đã thuộc vĩnh viễn</div>
            <div className="text-2xl font-extrabold text-brand-navy font-num">
              {stats.mastered} <span className="text-xs text-emerald-600 font-semibold">thẻ ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Review All Due Cards Banner */}
      {stats.dueToday > 0 && (
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#EEF5FF] dark:bg-[#111F36] border border-[#D5E5FA] dark:border-[#1E3252] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-brand-surface border border-[#D5E5FA] dark:border-brand-border flex items-center justify-center shrink-0 shadow-2xs">
              <MascotHoney mood="study" size={42} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-navy">
                Hôm nay bạn có {stats.dueToday} thẻ đã đến hạn ôn tập!
              </h3>
              <p className="text-xs sm:text-sm text-brand-secondary mt-0.5">
                Ôn ngay để đưa các từ này vào trí nhớ dài hạn vĩnh viễn và không bị quên lãng.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStudyAllDue(true)}
            className="px-7 py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Ôn tất cả ngay ({stats.dueToday} thẻ)</span>
          </button>
        </div>
      )}

      {/* 4. Flashcard Decks Collection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
            Bộ thẻ của bạn ({decks.length})
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-primary" />
            <span>Nhập nhanh từ Excel / Google Sheets</span>
          </button>
        </div>

        {decks.length === 0 ? (
          // Empty state with Mascot Honey guidance
          <div className="p-12 rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 text-center space-y-4 shadow-xs">
            <div className="w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center mx-auto shadow-2xs">
              <MascotHoney mood="wave" size={76} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-brand-navy">Chưa có bộ thẻ nào</h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto">
                Hãy tạo bộ thẻ đầu tiên hoặc bấm &quot;+ Ôn tập&quot; khi học các bài học trên lộ trình!
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Tạo bộ thẻ đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {decks.map((deck) => {
              const deckStat = getDeckStats(deck.id);
              return (
                <div
                  key={deck.id}
                  className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#EEF5FF] dark:bg-brand-tint text-xs font-bold text-brand-primary">
                        {deck.category}
                      </span>
                      {deck.isCurated && (
                        <span className="text-[10px] font-bold text-brand-primary flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Chuẩn hoá
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                      {deck.title}
                    </h3>
                    <p className="text-xs text-brand-secondary line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>

                    {/* Deck cards summary */}
                    <div className="pt-2 flex items-center justify-between text-xs font-semibold text-brand-secondary border-t border-brand-border/60">
                      <span>{deckStat.total} thẻ tổng</span>
                      <span className="text-amber-600 font-bold">
                        {deckStat.dueToday} cần ôn
                      </span>
                    </div>
                  </div>

                  {/* Start review button */}
                  <div className="pt-4 mt-4 border-t border-brand-border/60">
                    <button
                      onClick={() => setActiveStudyDeck(deck)}
                      className="w-full py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Ôn tập ngay ({deckStat.total} thẻ)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Create Deck Modal & Excel Import */}
      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
