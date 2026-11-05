"use client";

import React from "react";
import { RoadmapLevel } from "@/lib/data/roadmap-data";
import { Lock, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

interface RoadmapLeftSidebarProps {
  levels: RoadmapLevel[];
  selectedLevelId: string;
  onSelectLevel: (levelId: string) => void;
  onOpenChallenge: () => void;
}

export function RoadmapLeftSidebar({
  levels,
  selectedLevelId,
  onSelectLevel,
  onOpenChallenge,
}: RoadmapLeftSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Sidebar Header */}
      <div className="px-1">
        <h3 className="text-base font-bold text-brand-navy tracking-tight">
          Cấp độ học tập
        </h3>
        <p className="text-xs text-brand-secondary mt-0.5">
          Hoàn thành ≥80% hoặc vượt qua thử thách để mở khoá cấp kế tiếp.
        </p>
      </div>

      {/* Levels List */}
      <div className="space-y-2.5">
        {levels.map((lvl) => {
          const isSelected = selectedLevelId === lvl.id;
          const percent =
            lvl.totalLessons > 0
              ? Math.round((lvl.completedLessons / lvl.totalLessons) * 100)
              : 0;
          const isCompleted = percent === 100;

          return (
            <button
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
              className={`w-full text-left p-4 rounded-card border transition-all duration-200 relative group ${
                isSelected
                  ? "bg-brand-bg border-brand-primary shadow-xs ring-2 ring-brand-primary/15"
                  : lvl.isLocked
                  ? "bg-brand-surface/70 border-brand-border opacity-70 cursor-not-allowed"
                  : "bg-brand-bg hover:bg-brand-surface border-brand-border shadow-2xs hover:border-brand-border-strong"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant={lvl.isLocked ? "neutral" : isCompleted ? "success" : "tint"} size="sm">
                    {lvl.levelBadge}
                  </Badge>
                  <span className="font-korean font-semibold text-xs text-brand-muted">
                    {lvl.koreanName}
                  </span>
                </div>

                {lvl.isLocked ? (
                  <span className="p-1 rounded-md bg-brand-surface text-brand-muted">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-brand-success" />
                ) : null}
              </div>

              <div className="space-y-1">
                <div className="font-bold text-xs sm:text-sm text-brand-navy group-hover:text-brand-primary transition-colors">
                  {lvl.name}
                </div>
                <div className="text-[11px] text-brand-secondary line-clamp-1">
                  {lvl.description}
                </div>
              </div>

              {/* Progress Bar */}
              {!lvl.isLocked && (
                <div className="mt-3 pt-2.5 border-t border-brand-border/70 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-brand-secondary">
                    <span>{lvl.completedLessons}/{lvl.totalLessons} bài học</span>
                    <span className="font-bold text-brand-primary">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-brand-surface border border-brand-border/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-primary transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Challenge Button */}
      <button
        onClick={onOpenChallenge}
        className="w-full p-3.5 rounded-card bg-brand-gold-tint border border-brand-gold/40 text-amber-800 dark:text-yellow-400 font-bold text-xs flex items-center justify-between hover:bg-brand-gold-tint/80 transition-all shadow-2xs"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-gold fill-brand-gold" />
          <span>Kiểm tra vượt cấp nhanh</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-gold text-white font-extrabold uppercase">
          Thi thử
        </span>
      </button>
    </div>
  );
}

export default RoadmapLeftSidebar;
