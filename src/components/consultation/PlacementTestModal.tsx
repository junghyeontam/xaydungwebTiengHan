"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { PLACEMENT_TEST_QUESTIONS } from "@/lib/data/placement-test-data";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
} from "lucide-react";

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToConsultation?: () => void;
}

export function PlacementTestModal({
  isOpen,
  onClose,
  onGoToConsultation,
}: PlacementTestModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_TEST_QUESTIONS[currentIndex];

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleNext = () => {
    if (currentIndex < PLACEMENT_TEST_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Nộp bài & tính kết quả
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3DBBA8", "#F5B93A", "#E8604C"],
      });
      setIsSubmitted(true);
    }
  };

  // Tính điểm số
  let score = 0;
  PLACEMENT_TEST_QUESTIONS.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      score += 1;
    }
  });

  // Evaluate proficiency level
  let resultLevel = "Nhập môn Bảng chữ cái (Hangul)";
  let resultDesc =
    "Bạn nên bắt đầu từ bảng chữ cái Hangul để xây dựng nền tảng phát âm và nhận diện mặt chữ vững chắc.";
  let suggestedRoadmap = "/roadmap?tab=hangul";

  if (score >= 10) {
    resultLevel = "Trung cấp (TOPIK 3 - 4)";
    resultDesc =
      "Nền tảng của bạn rất vững chắc! Bạn hoàn toàn đủ năng lực bắt đầu học các cấu trúc viết luận và giao tiếp nâng cao.";
    suggestedRoadmap = "/roadmap?tab=intermediate";
  } else if (score >= 6) {
    resultLevel = "Sơ cấp 2 (TOPIK 2)";
    resultDesc =
      "Bạn đã nắm được các câu chào hỏi và ngữ pháp cơ bản. Hãy học tiếp thì quá khứ, tương lai và bổ sung vốn từ.";
    suggestedRoadmap = "/roadmap?tab=beginner-2";
  } else if (score >= 3) {
    resultLevel = "Sơ cấp 1 (TOPIK 1)";
    resultDesc =
      "Bạn đã biết một số từ vựng cơ bản. Lộ trình TOPIK 1 Sơ cấp sẽ giúp bạn tự tin ghép thành các câu hoàn chỉnh.";
    suggestedRoadmap = "/roadmap?tab=beginner-1";
  }

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header thanh tiến độ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="text-junghyeon-teal">
                  Bài kiểm tra xếp lớp miễn phí (12 câu)
                </span>
                <span className="font-num">
                  Câu {currentIndex + 1} / {PLACEMENT_TEST_QUESTIONS.length}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-junghyeon-teal to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${
                      ((currentIndex + 1) / PLACEMENT_TEST_QUESTIONS.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {currentQ.question}
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-[#EEF5FF] dark:bg-brand-tint border-brand-primary text-brand-navy shadow-2xs ring-2 ring-brand-primary/20"
                          : "bg-white dark:bg-brand-surface hover:bg-[#F7F9FC] border-brand-border text-brand-secondary hover:text-brand-navy"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Điều hướng chuyển câu */}
            <div className="pt-4 flex items-center justify-between border-t border-brand-border">
              {currentIndex > 0 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="px-5 py-2.5 rounded-full border border-brand-border text-xs font-bold text-brand-secondary hover:text-brand-navy"
                >
                  Câu trước
                </button>
              ) : (
                <div />
              )}

              <button
                disabled={!selectedAnswers[currentQ.id]}
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <span>
                  {currentIndex < PLACEMENT_TEST_QUESTIONS.length - 1
                    ? "Câu kế tiếp"
                    : "Xem kết quả xếp lớp"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* MÀN HÌNH KẾT QUẢ ĐÁNH GIÁ TRÌNH ĐỘ */
          <div className="text-center space-y-6 animate-in fade-in">
            <div className="w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center mx-auto shadow-2xs">
              <MascotHoney
                mood={score >= 6 ? "celebrate" : "study"}
                size={76}
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Kết quả đánh giá trình độ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                {resultLevel}
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#EEF5FF] text-brand-primary font-extrabold text-sm font-num mt-1">
                Điểm số: {score} / {PLACEMENT_TEST_QUESTIONS.length} câu đúng
              </div>
              <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto pt-2 leading-relaxed">
                {resultDesc}
              </p>
            </div>

            {/* Các nút hành động chuyển đổi */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onGoToConsultation) onGoToConsultation();
                }}
                className="w-full py-3.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                Đăng ký nhận lộ trình & Học thử 7 ngày miễn phí
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-brand-secondary hover:text-brand-navy"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại bài kiểm tra</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
