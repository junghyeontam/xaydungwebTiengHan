"use client";

import React from "react";
import Link from "next/link";
import { RoadmapNode } from "@junghyeon/features";
import { MascotHoney } from "@junghyeon/ui";
import {
  X,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface LessonPreviewModalProps {
  node: RoadmapNode | null;
  onClose: () => void;
}

export function LessonPreviewModal({ node, onClose }: LessonPreviewModalProps) {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header bài học */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-junghyeon-dark to-junghyeon-teal text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
            {node.nodeNumber}
          </div>
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="font-korean font-bold text-xs text-junghyeon-teal">
                {node.koreanTitle}
              </span>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= node.stars ? "fill-amber-400" : "text-border fill-border"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {node.title}
            </h3>
            <p className="text-xs text-muted-foreground">{node.shortDesc}</p>
          </div>
        </div>

        {/* Thông số bài học */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-secondary/60 border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời lượng</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">
              {node.estimatedMinutes} phút
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-secondary/60 border border-border text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Từ vựng</span>
            </div>
            <div className="text-sm font-bold text-foreground mt-0.5">
              {node.vocabCount} từ mới
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phần thưởng</span>
            </div>
            <div className="text-sm font-extrabold text-amber-600 dark:text-yellow-400 mt-0.5 font-num">
              +{node.xpReward} XP
            </div>
          </div>
        </div>

        {/* Điểm ngữ pháp trọng tâm */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Nội dung trọng tâm bài học:
          </h4>
          <div className="space-y-1.5">
            {node.grammarFocus.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-background border border-border/80 text-xs text-foreground/90 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lời nhắn từ Honey */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-junghyeon-cream dark:bg-junghyeon-dark-surface border border-border/70 text-xs text-foreground/80">
          <MascotHoney mood="study" size={40} className="shrink-0" />
          <span>
            Hoàn thành bài tập cuối bài để đạt <strong>3 sao</strong> xuất sắc và nuôi Cây JungHyeon lớn nhanh nhé!
          </span>
        </div>

        {/* Nút hành động */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Đóng
          </button>

          {node.status === "locked" ? (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-xs font-bold text-muted-foreground cursor-not-allowed">
              <Lock className="w-4 h-4" />
              <span>Cần mở khoá cấp độ trước</span>
            </div>
          ) : (
            <Link
              href={`/lessons/${node.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-junghyeon-coral hover:bg-junghyeon-coral-hover text-white text-xs sm:text-sm font-bold shadow-coral-glow transition-all active:scale-95 ml-auto"
            >
              <span>{node.status === "completed" ? "Ôn lại bài học" : "Bắt đầu học ngay"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
