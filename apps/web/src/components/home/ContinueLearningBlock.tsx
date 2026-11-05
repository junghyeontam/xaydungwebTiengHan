"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { PlayCircle, ArrowRight, Flame, Sparkles, Layers } from "lucide-react";

export function ContinueLearningBlock() {
  const { locale, t } = useI18n();
  const isEn = locale === "en";

  const progress = {
    currentLessonSlug: "so-cap-1-bai-3-duoi-cau-ayo-eoyo",
    currentLessonTitle: isEn
      ? "Lesson 3: Informal Polite Ending -아요 / -어요"
      : "Bài 3: Đuôi câu thân mật -아요 / -어요",
    levelName: isEn ? "TOPIK 1 • Beginner" : "TOPIK 1 • Sơ cấp 1",
    percentComplete: 65,
    streakDays: 7,
    cardsDueToday: 14,
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 my-10">
      <ScrollReveal animation="fade-up" distance={20} duration={0.5}>
        <div className="rounded-card bg-brand-tint border border-brand-frame/70 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all">
          {/* Left Column: Lesson info & progress */}
          <div className="space-y-3 max-w-xl w-full">
            <div className="flex items-center gap-2">
              <Badge variant="tint">{progress.levelName}</Badge>
              <span className="text-xs font-semibold text-brand-secondary">
                {isEn ? "Continue where you left off" : "Tiếp tục bài học gần nhất"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-brand-navy tracking-tight">
              {progress.currentLessonTitle}
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-brand-secondary font-medium">
                <span>{isEn ? "Progress" : "Tiến độ bài học"}</span>
                <span className="font-bold text-brand-primary">{progress.percentComplete}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-brand-bg border border-brand-frame/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all duration-500"
                  style={{ width: `${progress.percentComplete}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Streak & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="px-4 py-3 rounded-control bg-brand-bg border border-brand-border flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-brand-navy">
                  {progress.streakDays} {isEn ? "days" : "ngày"}
                </div>
                <div className="text-[10px] text-brand-muted">
                  {isEn ? "Study streak" : "Chuỗi học đều"}
                </div>
              </div>
            </div>

            <Button
              href={`/lessons/${progress.currentLessonSlug}`}
              variant="primary"
              size="md"
              pill
              icon={<PlayCircle className="w-4 h-4" />}
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="shadow-sm hover:shadow-card font-bold"
            >
              {isEn ? "Resume Lesson" : "Học tiếp bài học"}
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default ContinueLearningBlock;
