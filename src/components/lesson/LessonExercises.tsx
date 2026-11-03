"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/data/lessons-data";
import { playKoreanSpeech } from "@/lib/utils/speech";
import {
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  HelpCircle,
} from "lucide-react";

interface LessonExercisesProps {
  exercises: ExerciseItem[];
  onExerciseComplete: (xpEarned: number) => void;
  onAllCompleted: () => void;
}

export function LessonExercises({
  exercises,
  onExerciseComplete,
  onAllCompleted,
}: LessonExercisesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Trạng thái cho từng câu
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);
  const [typingInput, setTypingInput] = useState<string>("");

  // Trạng thái cho dạng Ghép cặp (Matching)
  const [selectedKorean, setSelectedKorean] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Trạng thái chấm điểm
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentExercise = exercises[currentIndex];
  if (!currentExercise) return null;

  // Xử lý nộp bài
  const handleCheckAnswer = () => {
    let correct = false;

    if (
      currentExercise.type === "multiple-choice" ||
      currentExercise.type === "fill-blank" ||
      currentExercise.type === "listening"
    ) {
      correct = selectedOption === currentExercise.correctAnswer;
    } else if (currentExercise.type === "reorder") {
      const targetArray = currentExercise.correctAnswer as string[];
      correct =
        JSON.stringify(reorderedWords) === JSON.stringify(targetArray);
    } else if (currentExercise.type === "matching") {
      const totalPairs = currentExercise.pairs?.length || 0;
      correct = Object.keys(matchedPairs).length === totalPairs;
    } else if (currentExercise.type === "typing") {
      correct =
        typingInput.trim().toLowerCase() ===
        (currentExercise.correctAnswer as string).trim().toLowerCase();
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      onExerciseComplete(currentExercise.xp);
    }
  };

  // Chuyển sang câu tiếp theo
  const handleNext = () => {
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedOption("");
    setReorderedWords([]);
    setTypingInput("");
    setSelectedKorean(null);
    setMatchedPairs({});

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onAllCompleted();
    }
  };

  // Thử lại câu hiện tại nếu sai
  const handleRetry = () => {
    setIsAnswered(false);
    setSelectedOption("");
    setReorderedWords([]);
    setTypingInput("");
    setSelectedKorean(null);
    setMatchedPairs({});
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-card space-y-6">
      {/* Header câu hỏi */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-junghyeon-coral/10 text-junghyeon-coral font-extrabold text-xs flex items-center justify-center">
            {currentIndex + 1}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Câu hỏi {currentIndex + 1} / {exercises.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold font-num">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+{currentExercise.xp} XP</span>
        </div>
      </div>

      {/* Chỉ dẫn dạng bài */}
      <div className="text-xs font-bold text-junghyeon-teal">
        {currentExercise.instruction}
      </div>

      {/* Đề bài câu hỏi */}
      <div className="text-base sm:text-lg font-bold text-foreground">
        {currentExercise.question}
      </div>

      {/* ============================================================== */}
      {/* DẠNG 1, 2: TRẮC NGHIỆM & ĐIỀN TỪ */}
      {/* ============================================================== */}
      {(currentExercise.type === "multiple-choice" ||
        currentExercise.type === "fill-blank") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentExercise.options?.map((opt, i) => {
            const isSelected = selectedOption === opt;
            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => setSelectedOption(opt)}
                className={`p-4 rounded-2xl border text-left font-medium text-sm transition-all ${
                  isSelected
                    ? "border-junghyeon-teal bg-junghyeon-teal/15 font-bold shadow-soft ring-2 ring-junghyeon-teal/20"
                    : "border-border bg-background hover:bg-secondary/60"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* DẠNG 3: SẮP XẾP TRẬT TỰ CÂU */}
      {/* ============================================================== */}
      {currentExercise.type === "reorder" && (
        <div className="space-y-4 pt-2">
          {/* Vùng các từ đã chọn */}
          <div className="min-h-[56px] p-3 rounded-2xl border-2 border-dashed border-junghyeon-teal/40 bg-secondary/30 flex items-center gap-2 flex-wrap">
            {reorderedWords.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">
                Bấm vào các từ bên dưới để ghép thành câu hoàn chỉnh...
              </span>
            ) : (
              reorderedWords.map((word, i) => (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() =>
                    setReorderedWords(reorderedWords.filter((_, idx) => idx !== i))
                  }
                  className="px-3 py-1.5 rounded-xl bg-junghyeon-teal text-white text-xs font-bold shadow-xs hover:bg-red-500 transition-colors"
                  title="Bấm để xoá từ này"
                >
                  {word} ✕
                </button>
              ))
            )}
          </div>

          {/* Ngân hàng từ vựng (Word Bank) */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentExercise.wordBank?.map((word, i) => {
              const isUsed = reorderedWords.includes(word);
              return (
                <button
                  key={i}
                  disabled={isUsed || isAnswered}
                  onClick={() => setReorderedWords([...reorderedWords, word])}
                  className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    isUsed
                      ? "opacity-30 bg-secondary cursor-not-allowed"
                      : "bg-background hover:bg-secondary border-border shadow-xs active:scale-95"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DẠNG 4: GHÉP CẶP TỪ VỰNG (MATCHING) */}
      {/* ============================================================== */}
      {currentExercise.type === "matching" && (
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Bấm chọn 1 từ tiếng Hàn ở cột trái, rồi chọn 1 từ tiếng Việt ở cột phải:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* Cột tiếng Hàn */}
            <div className="space-y-2">
              {currentExercise.pairs?.map((p) => {
                const isMatched = Boolean(matchedPairs[p.korean]);
                const isSelected = selectedKorean === p.korean;
                return (
                  <button
                    key={p.korean}
                    disabled={isMatched || isAnswered}
                    onClick={() => setSelectedKorean(p.korean)}
                    className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                      isMatched
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 line-through opacity-60"
                        : isSelected
                        ? "bg-junghyeon-teal text-white border-junghyeon-teal shadow-soft"
                        : "bg-background hover:bg-secondary border-border"
                    }`}
                  >
                    {p.korean}
                  </button>
                );
              })}
            </div>

            {/* Meaning Column */}
            <div className="space-y-2">
              {currentExercise.pairs?.map((p) => {
                const targetMeaning = p.meaning || (p as any).vietnamese;
                const isMatched = Object.values(matchedPairs).includes(targetMeaning);
                return (
                  <button
                    key={targetMeaning}
                    disabled={isMatched || isAnswered || !selectedKorean}
                    onClick={() => {
                      if (selectedKorean) {
                        // Check if pair matches
                        const foundPair = currentExercise.pairs?.find(
                          (x) => x.korean === selectedKorean
                        );
                        const correctTarget = foundPair?.meaning || (foundPair as any)?.vietnamese;

                        if (correctTarget === targetMeaning) {
                          setMatchedPairs((prev) => ({
                            ...prev,
                            [selectedKorean]: targetMeaning,
                          }));
                        }
                        setSelectedKorean(null);
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                      isMatched
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 line-through opacity-60"
                        : selectedKorean
                        ? "bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20"
                        : "bg-background border-border opacity-70"
                    }`}
                  >
                    {targetMeaning}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DẠNG 5: NGHE AUDIO CHỌN ĐÁP ÁN */}
      {/* ============================================================== */}
      {currentExercise.type === "listening" && (
        <div className="space-y-4 pt-2">
          {/* Nút bấm nghe to rõ */}
          <div className="flex items-center justify-center p-6 rounded-2xl bg-secondary/50 border border-border">
            <button
              onClick={() => playKoreanSpeech(currentExercise.audioPrompt || "")}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-junghyeon-coral text-white font-bold text-sm shadow-coral-glow hover:opacity-95 active:scale-95 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>Bấm vào đây để nghe âm mẫu 🔊</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentExercise.options?.map((opt, i) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-4 rounded-2xl border text-left font-medium text-xs sm:text-sm transition-all ${
                    isSelected
                      ? "border-junghyeon-teal bg-junghyeon-teal/15 font-bold shadow-soft ring-2 ring-junghyeon-teal/20"
                      : "border-border bg-background hover:bg-secondary/60"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DẠNG 6: GÕ CHỮ HÀN (TYPING) */}
      {/* ============================================================== */}
      {currentExercise.type === "typing" && (
        <div className="space-y-3 pt-2">
          <input
            type="text"
            disabled={isAnswered}
            value={typingInput}
            onChange={(e) => setTypingInput(e.target.value)}
            placeholder="Gõ đáp án tiếng Hàn tại đây (ví dụ: 사랑해요)..."
            className="w-full px-4 py-3.5 rounded-xl border border-border bg-background font-korean font-bold text-base text-foreground focus:ring-2 focus:ring-junghyeon-teal outline-none transition-all"
          />
          <p className="text-[11px] text-muted-foreground">
            💡 Gợi ý: Bạn có thể bật bàn phím tiếng Hàn (Hangul) trên máy tính/điện thoại hoặc sao chép mẫu từ vựng đã học.
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* KHỐI KẾT QUẢ & LỜI GIẢI THÍCH CHI TIẾT */}
      {/* ============================================================== */}
      {isAnswered && (
        <div
          className={`p-5 rounded-2xl border animate-in fade-in space-y-2 ${
            isCorrect
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Chính xác tuyệt đối! (+{currentExercise.xp} XP)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>Chưa chính xác rồi, hãy xem giải thích nhé:</span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-7">
            {currentExercise.explanation}
          </p>
        </div>
      )}

      {/* ============================================================== */}
      {/* NÚT ĐIỀU HƯỚNG BÀI TẬP */}
      {/* ============================================================== */}
      <div className="pt-4 flex items-center justify-between border-t border-border">
        {!isAnswered ? (
          <button
            onClick={handleCheckAnswer}
            className="px-6 py-3 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white font-bold text-xs sm:text-sm shadow-coral-glow transition-all active:scale-95 ml-auto"
          >
            Kiểm tra đáp án
          </button>
        ) : (
          <div className="w-full flex items-center justify-between">
            {!isCorrect ? (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử làm lại</span>
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-junghyeon-teal hover:bg-junghyeon-teal-hover text-white font-bold text-xs sm:text-sm shadow-teal-glow transition-all active:scale-95 ml-auto"
            >
              <span>{currentIndex < exercises.length - 1 ? "Câu tiếp theo" : "Hoàn thành bài học"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
