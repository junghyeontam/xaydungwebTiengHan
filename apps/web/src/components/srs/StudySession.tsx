"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { SrsCard, useSrs } from "@/lib/context/SrsContext";
import { ReviewGrade } from "@/lib/srs/sm2";
import { playKoreanSpeech } from "@/lib/utils/speech";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  Volume2,
  RotateCw,
  X,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export type StudyMode = "flip" | "quiz" | "type" | "listen";

interface StudySessionProps {
  cards: SrsCard[];
  deckTitle: string;
  onFinish: () => void;
}

export function StudySession({ cards, deckTitle, onFinish }: StudySessionProps) {
  const { reviewCard } = useSrs();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<StudyMode>("flip");
  const [isFlipped, setIsFlipped] = useState(false);

  // Trạng thái cho chế độ Gõ (Type) & Trắc nghiệm (Quiz)
  const [typeInput, setTypeInput] = useState("");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = cards[currentIndex];

  // Generate quiz options from cards list
  const cardMeaning = currentCard ? (currentCard.meaning || currentCard.vietnamese || "") : "";
  const cardExampleMeaning = currentCard ? (currentCard.exampleMeaning || currentCard.exampleVietnamese || "") : "";

  const quizOptions = React.useMemo(() => {
    if (!currentCard) return [];
    const distractors = cards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => c.meaning || c.vietnamese || "")
      .slice(0, 3);
    const options = [cardMeaning, ...distractors];
    return options.sort(() => Math.random() - 0.5);
  }, [currentCard, cardMeaning, cards]);

  if (!currentCard || isCompleted) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-brand-surface border border-brand-border/80 text-center space-y-6 shadow-card">
        <div className="w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center mx-auto shadow-2xs">
          <MascotHoney mood="celebrate" size={76} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-2xl font-extrabold text-brand-navy">
            Hoàn thành phiên ôn tập!
          </h3>
          <p className="text-xs text-brand-secondary">
            Bạn đã ôn tập xong {cards.length} thẻ theo thuật toán Spaced Repetition SM-2.
          </p>
        </div>
        <button
          onClick={onFinish}
          className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          Trở về danh sách bộ thẻ
        </button>
      </div>
    );
  }

  const handleGrade = (grade: ReviewGrade) => {
    reviewCard(currentCard.id, grade);
    setIsFlipped(false);
    setTypeInput("");
    setSelectedQuizAnswer(null);
    setIsAnswerChecked(false);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3DBBA8", "#F5B93A", "#E8604C"],
      });
      setIsCompleted(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header phiên học */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onFinish}
            className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Thoát phiên ôn"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-xs font-bold text-foreground truncate max-w-[200px]">
              {deckTitle}
            </h3>
            <span className="text-[10px] text-muted-foreground font-num">
              Thẻ {currentIndex + 1} / {cards.length}
            </span>
          </div>
        </div>

        {/* Chuyển đổi 4 chế độ ôn */}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode("flip")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === "flip" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground"
            }`}
          >
            Lật thẻ
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === "quiz" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground"
            }`}
          >
            Trắc nghiệm
          </button>
          <button
            onClick={() => setMode("type")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === "type" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground"
            }`}
          >
            Gõ chữ
          </button>
          <button
            onClick={() => setMode("listen")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mode === "listen" ? "bg-card text-foreground shadow-xs font-bold" : "text-muted-foreground"
            }`}
          >
            Nghe
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CHẾ ĐỘ 1: LẬT THẺ 3D (FLIP CARD) */}
      {/* ============================================================== */}
      {mode === "flip" && (
        <div className="space-y-6">
          <div
            onClick={() => {
              setIsFlipped(!isFlipped);
              if (!isFlipped) playKoreanSpeech(currentCard.korean);
            }}
            className="w-full min-h-[300px] rounded-3xl bg-card border-2 border-border/80 shadow-card hover:border-junghyeon-teal/60 cursor-pointer p-8 flex flex-col items-center justify-center text-center relative transition-all select-none"
          >
            <span className="absolute top-4 right-4 text-[11px] text-muted-foreground flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Bấm để lật thẻ
            </span>

            {!isFlipped ? (
              // Mặt trước: Chữ Hàn + Nút phát âm
              <div className="space-y-4 animate-in fade-in">
                <div className="font-korean font-extrabold text-4xl sm:text-5xl text-junghyeon-dark dark:text-white tracking-wide">
                  {currentCard.korean}
                </div>
                {currentCard.romaja && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {currentCard.romaja}
                  </p>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playKoreanSpeech(currentCard.korean);
                  }}
                  className="w-11 h-11 rounded-2xl bg-junghyeon-teal/15 text-junghyeon-teal hover:bg-junghyeon-teal hover:text-white flex items-center justify-center mx-auto transition-all shadow-xs"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Back: Meaning + Example
              <div className="space-y-4 animate-in fade-in">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
                  {cardMeaning}
                </div>
                <div className="h-px bg-border w-24 mx-auto my-2" />
                {currentCard.exampleKorean && (
                  <div className="space-y-1 text-xs">
                    <p className="font-korean font-bold text-foreground">
                      {currentCard.exampleKorean}
                    </p>
                    <p className="text-muted-foreground italic">
                      {cardExampleMeaning}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4 Nút đánh giá SM-2 */}
          {isFlipped && (
            <div className="space-y-2 animate-in fade-in">
              <p className="text-xs text-center text-muted-foreground font-medium">
                Đánh giá mức độ ghi nhớ của bạn (Thuật toán SM-2):
              </p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleGrade(0)}
                  className="p-3 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-all text-center group"
                >
                  <div className="text-xs font-bold">Quên</div>
                  <div className="text-[10px] opacity-75 mt-0.5">Ngày mai</div>
                </button>

                <button
                  onClick={() => handleGrade(1)}
                  className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white transition-all text-center group"
                >
                  <div className="text-xs font-bold">Khó</div>
                  <div className="text-[10px] opacity-75 mt-0.5">1-2 ngày</div>
                </button>

                <button
                  onClick={() => handleGrade(2)}
                  className="p-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white transition-all text-center group"
                >
                  <div className="text-xs font-bold">Tốt</div>
                  <div className="text-[10px] opacity-75 mt-0.5">4-6 ngày</div>
                </button>

                <button
                  onClick={() => handleGrade(3)}
                  className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-all text-center group"
                >
                  <div className="text-xs font-bold">Dễ</div>
                  <div className="text-[10px] opacity-75 mt-0.5">8+ ngày</div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* CHẾ ĐỘ 2: TRẮC NGHIỆM (QUIZ) */}
      {/* ============================================================== */}
      {mode === "quiz" && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-card space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs text-muted-foreground">Chọn nghĩa đúng của từ:</span>
            <div className="font-korean font-extrabold text-4xl text-foreground">
              {currentCard.korean}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((opt, i) => {
              const isSelected = selectedQuizAnswer === opt;
              const isCorrect = opt === cardMeaning;
              return (
                <button
                  key={i}
                  disabled={isAnswerChecked}
                  onClick={() => {
                    setSelectedQuizAnswer(opt);
                    setIsAnswerChecked(true);
                  }}
                  className={`p-4 rounded-2xl border text-sm font-bold text-left transition-all ${
                    isAnswerChecked
                      ? isCorrect
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : isSelected
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-background border-border opacity-50"
                      : "bg-background hover:bg-secondary border-border"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswerChecked && (
            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() =>
                  handleGrade(selectedQuizAnswer === cardMeaning ? 2 : 0)
                }
                className="px-6 py-2.5 rounded-xl bg-junghyeon-teal text-white font-bold text-xs shadow-teal-glow"
              >
                Tiếp tục
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: TYPING */}
      {/* ============================================================== */}
      {mode === "type" && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-card space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs text-muted-foreground">Gõ lại từ tiếng Hàn tương ứng với:</span>
            <div className="text-2xl font-extrabold text-junghyeon-coral">
              {cardMeaning}
            </div>
          </div>

          <input
            type="text"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            placeholder="Gõ chữ Hangul..."
            className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background font-korean font-bold text-xl text-center focus:ring-2 focus:ring-junghyeon-teal outline-none"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => playKoreanSpeech(currentCard.korean)}
              className="inline-flex items-center gap-1.5 text-xs text-brand-primary font-bold"
            >
              <Volume2 className="w-4 h-4" /> Nghe gợi ý
            </button>

            <button
              onClick={() => {
                const isMatch =
                  typeInput.trim().toLowerCase() === currentCard.korean.trim().toLowerCase();
                handleGrade(isMatch ? 3 : 0);
              }}
              className="px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs shadow-sm transition-all"
            >
              Kiểm tra
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: LISTENING */}
      {/* ============================================================== */}
      {mode === "listen" && (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-card text-center space-y-6">
          <div className="space-y-3">
            <span className="text-xs text-muted-foreground">Nghe phát âm và chọn nghĩa tiếng Việt:</span>
            <div>
              <button
                onClick={() => playKoreanSpeech(currentCard.korean)}
                className="w-16 h-16 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center mx-auto shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <Volume2 className="w-8 h-8" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {quizOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleGrade(opt === cardMeaning ? 2 : 0)}
                className="p-3.5 rounded-2xl border border-border bg-background hover:bg-secondary text-xs sm:text-sm font-bold text-left transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
