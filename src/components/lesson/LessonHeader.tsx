"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";

interface LessonHeaderProps {
  title: string;
  levelBadge: string;
  progressPercent: number;
  currentXp: number;
  showRomaja: boolean;
  onToggleRomaja: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}

export function LessonHeader({
  title,
  levelBadge,
  progressPercent,
  currentXp,
  showRomaja,
  onToggleRomaja,
  showTranslation,
  onToggleTranslation,
}: LessonHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border py-3 px-4 sm:px-6">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Back to roadmap button */}
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-bold transition-all shrink-0"
          title="Quay lại Bản đồ lộ trình"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Lộ trình</span>
        </Link>

        {/* Thanh tiến độ bài học trung tâm */}
        <div className="flex-1 max-w-md mx-auto space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-foreground truncate pr-2">{title}</span>
            <span className="text-junghyeon-teal num shrink-0">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-junghyeon-teal to-emerald-400 transition-all duration-300 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Công cụ hỗ trợ học tập: Bật/Tắt Romaja, Nghĩa Việt, Điểm XP */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Toggle Romaja */}
          <button
            onClick={onToggleRomaja}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
              showRomaja
                ? "bg-junghyeon-teal/15 border-junghyeon-teal text-junghyeon-teal"
                : "bg-secondary/60 border-border text-muted-foreground"
            }`}
            title="Bật/Tắt phiên âm Romaja"
          >
            <span>Romaja</span>
          </button>

          {/* Toggle Dịch nghĩa tiếng Việt */}
          <button
            onClick={onToggleTranslation}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
              showTranslation
                ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-yellow-400"
                : "bg-secondary/60 border-border text-muted-foreground"
            }`}
            title="Bật/Tắt dịch nghĩa tiếng Việt"
          >
            <span>Dịch nghĩa</span>
          </button>

          {/* XP nhận được */}
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-junghyeon-yellow/20 text-amber-700 dark:text-yellow-400 text-xs font-bold font-num">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{currentXp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
