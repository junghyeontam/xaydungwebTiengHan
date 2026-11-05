"use client";

import React, { useState } from "react";
import { VocabItem, GrammarRule, playKoreanSpeech } from "@junghyeon/features";
import { Volume2, BookmarkPlus, Check, Sparkles, BookOpen } from "lucide-react";

interface LessonTheoryProps {
  introduction: string;
  vocabulary: VocabItem[];
  grammarRules: GrammarRule[];
  showRomaja: boolean;
  showTranslation: boolean;
  onAddToReview: (item: { korean: string; vietnamese: string }) => void;
}

export function LessonTheory({
  introduction,
  vocabulary,
  grammarRules,
  showRomaja,
  showTranslation,
  onAddToReview,
}: LessonTheoryProps) {
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});

  const handleSaveToReview = (id: string, korean: string, vietnamese: string) => {
    onAddToReview({ korean, vietnamese });
    setSavedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSavedItems((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-10">
      {/* 1. Lời mở đầu bài học */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-junghyeon-teal/10 text-junghyeon-teal text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mục tiêu bài học</span>
        </div>
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
          {introduction}
        </p>
      </div>

      {/* 2. Từ vựng cốt lõi trong bài */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Từ vựng trọng tâm</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-junghyeon-teal/15 text-junghyeon-teal font-num">
              {vocabulary.length} từ
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Bấm vào loa 🔊 để nghe phát âm bản xứ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {vocabulary.map((vocab) => {
            const isSaved = savedItems[vocab.id];
            return (
              <div
                key={vocab.id}
                className="p-4 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Dòng chữ Hàn chính + Nút nghe + Nút + Ôn tập */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playKoreanSpeech(vocab.audioText)}
                      className="w-10 h-10 rounded-xl bg-junghyeon-teal/15 hover:bg-junghyeon-teal text-junghyeon-teal hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                      title="Phát âm từ vựng"
                      aria-label={`Nghe phát âm ${vocab.korean}`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <div>
                      <div className="font-korean font-extrabold text-xl text-junghyeon-dark dark:text-white group-hover:text-junghyeon-teal transition-colors">
                        {vocab.korean}
                      </div>
                      {showRomaja && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {vocab.romaja}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SRS Review bookmark button */}
                  <button
                    onClick={() =>
                      handleSaveToReview(vocab.id, vocab.korean, vocab.meaning || (vocab as any).vietnamese)
                    }
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSaved
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-secondary/70 hover:bg-junghyeon-teal hover:text-white text-foreground"
                    }`}
                    title="Thêm từ này vào Bộ thẻ Flashcard SRS để ôn tập"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã lưu!</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>+ Ôn tập</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Vietnamese meaning translation */}
                {showTranslation && (
                  <div className="mt-2 pt-2 border-t border-border/50 text-xs font-semibold text-junghyeon-coral dark:text-emerald-400">
                    Nghĩa: {vocab.meaning || (vocab as any).vietnamese}
                  </div>
                )}

                {/* Câu ví dụ minh họa */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-secondary/40 text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span
                      onClick={() => playKoreanSpeech(vocab.exampleKorean)}
                      className="font-korean font-bold text-foreground cursor-pointer hover:text-junghyeon-teal"
                      title="Bấm để nghe câu ví dụ"
                    >
                      🗣️ {vocab.exampleKorean}
                    </span>
                  </div>
                  {showRomaja && (
                    <div className="text-[11px] text-muted-foreground">
                      {vocab.exampleRomaja}
                    </div>
                  )}
                  {showTranslation && (
                    <div className="text-[11px] text-muted-foreground italic">
                      {vocab.exampleMeaning}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Các cấu trúc ngữ pháp chi tiết */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-foreground tracking-tight">
          Cấu trúc ngữ pháp trọng điểm
        </h3>

        <div className="space-y-6">
          {grammarRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-4"
            >
              {/* Tiêu đề quy tắc */}
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-junghyeon-teal text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    {rule.title}
                  </h4>
                  {/* Khung công thức ngữ pháp */}
                  <div className="inline-block px-3 py-1 rounded-xl bg-junghyeon-teal/10 border border-junghyeon-teal/30 text-junghyeon-teal font-korean font-bold text-xs sm:text-sm">
                    {rule.formula}
                  </div>
                </div>
              </div>

              {/* Giải thích chi tiết */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-11">
                {rule.explanation}
              </p>

              {/* Bảng ví dụ chia câu */}
              <div className="pl-11 space-y-2">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Ví dụ thực tế:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {rule.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-secondary/50 border border-border/80 space-y-1 hover:border-junghyeon-teal transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          onClick={() => playKoreanSpeech(ex.korean)}
                          className="font-korean font-bold text-sm text-foreground cursor-pointer hover:text-junghyeon-teal"
                          title="Bấm để nghe phát âm"
                        >
                          🔊 {ex.korean}
                        </span>
                      </div>
                      {showRomaja && (
                        <div className="text-[10px] text-muted-foreground">
                          {ex.romaja}
                        </div>
                      )}
                      {showTranslation && (
                        <div className="text-[11px] text-junghyeon-coral dark:text-emerald-400 font-medium">
                          {ex.meaning || (ex as any).vietnamese}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
