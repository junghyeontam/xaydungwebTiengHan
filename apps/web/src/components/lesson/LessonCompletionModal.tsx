"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { MascotHoney } from "@/components/ui/MascotHoney";
import {
  Sparkles,
  Star,
  Repeat,
  Compass,
  ArrowRight,
  Trophy,
} from "lucide-react";

interface LessonCompletionModalProps {
  isOpen: boolean;
  lessonTitle: string;
  totalXpEarned: number;
  onClose: () => void;
}

export function LessonCompletionModal({
  isOpen,
  lessonTitle,
  totalXpEarned,
  onClose,
}: LessonCompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Bắn pháo hoa confetti ăn mừng rực rỡ
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3DBBA8", "#F5B93A", "#E8604C", "#2F5D9E"],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Linh vật Honey ăn mừng */}
        <div className="relative inline-block">
          <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center mx-auto shadow-soft">
            <MascotHoney mood="celebrate" size={88} />
          </div>
          {/* 3 Sao vàng */}
          <div className="flex items-center justify-center gap-1 mt-3 text-amber-400">
            <Star className="w-6 h-6 fill-amber-400" />
            <Star className="w-8 h-8 fill-amber-400 -mt-2" />
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
        </div>

        {/* Tiêu đề chúc mừng */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-junghyeon-teal uppercase tracking-wider">
            Xuất sắc hoàn thành bài học!
          </span>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            {lessonTitle}
          </h2>
          <p className="text-xs text-muted-foreground">
            Bạn vừa tưới thêm nước nuôi dưỡng Cây JungHyeon phát triển mạnh mẽ!
          </p>
        </div>

        {/* Khối nhận thưởng XP */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-yellow-400">
            <Trophy className="w-6 h-6" />
            <span className="text-sm font-bold">Kinh nghiệm đạt được:</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-yellow-400 font-num">
            +{totalXpEarned} XP
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/roadmap"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white text-xs sm:text-sm font-bold shadow-coral-glow transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Tiếp tục chặng đường trên Lộ trình</span>
          </Link>

          <Link
            href="/review"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-background hover:bg-secondary text-xs sm:text-sm font-bold text-foreground transition-all"
          >
            <Repeat className="w-4 h-4 text-junghyeon-teal" />
            <span>Ôn tập từ vựng vừa học (SRS)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
