"use client";

import React from "react";
import { RoadmapLevel, RoadmapNode } from "@/lib/data/roadmap-data";
import { getAllPublishedLessons } from "@/features/content-publishing/content-service";
import { MascotHoney } from "@/components/shared/MascotHoney";
import { Badge } from "@/components/shared/Badge";
import { ProBadge } from "@/components/shared/ProBadge";
import {
  Star,
  Lock,
  CheckCircle2,
  Play,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
} from "lucide-react";

interface RoadmapNodeMapProps {
  level: RoadmapLevel;
  onSelectNode: (node: RoadmapNode) => void;
}

export function RoadmapNodeMap({ level, onSelectNode }: RoadmapNodeMapProps) {
  if (level.isLocked) {
    return (
      <div className="rounded-card bg-brand-bg border border-brand-border p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border text-brand-muted flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-navy">
          Cấp độ {level.name} đang bị khoá
        </h3>
        <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto leading-relaxed">
          {level.description} Bạn cần hoàn thành các bài học ở cấp độ trước hoặc làm bài kiểm tra thử thách vượt cấp để mở khoá.
        </p>
      </div>
    );
  }

  const rawNodes = level.nodes || [];
  const publishedLessons = getAllPublishedLessons();
  const additionalNodes: RoadmapNode[] = publishedLessons
    .filter((l) => !rawNodes.some((n) => n.slug === l.slug))
    .map((l, idx) => ({
      id: `dyn-node-${l.slug}`,
      slug: l.slug,
      nodeNumber: rawNodes.length + idx + 1,
      title: l.title,
      koreanTitle: "새 강의",
      shortDesc: "Bài học mới đã được duyệt & xuất bản chính thức",
      estimatedMinutes: 20,
      xpReward: 35,
      stars: 0,
      status: "in-progress",
      grammarFocus: ["Ngữ pháp thực hành"],
      vocabCount: 15,
    }));
  const nodes = [...rawNodes, ...additionalNodes];

  return (
    <div className="space-y-6">
      {/* Current Level Header Banner */}
      <div className="p-6 sm:p-7 rounded-card bg-brand-tint border border-brand-frame/70 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
            <span>{level.levelBadge}</span>
            <span>•</span>
            <span className="font-korean">{level.koreanName}</span>
          </div>
          <h2 className="text-2xl font-bold text-brand-navy tracking-tight">
            {level.name}
          </h2>
          <p className="text-xs sm:text-sm text-brand-secondary max-w-2xl leading-relaxed">
            {level.description}
          </p>
        </div>
      </div>

      {/* Nodes Connected by a Dashed Light-Blue Line (#BFD9F7) */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-brand-frame space-y-6 ml-4 sm:ml-6">
        {nodes.map((node) => {
          const isCompleted = node.status === "completed";
          const isLocked = node.status === "locked";
          const isInProgress = node.status === "in-progress";

          return (
            <div key={node.id} className="relative group">
              {/* Node Number Circle on the dashed line */}
              <div
                className={`absolute -left-[35px] sm:-left-[43px] top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCompleted
                    ? "bg-brand-success text-white border-white"
                    : isInProgress
                    ? "bg-brand-primary text-white border-white animate-pulse"
                    : "bg-brand-surface text-brand-muted border-brand-frame"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{node.nodeNumber}</span>
                )}
              </div>

              {/* Lesson Card */}
              <div
                onClick={() => onSelectNode(node)}
                className={`p-5 sm:p-6 rounded-card border transition-all duration-200 cursor-pointer ${
                  isInProgress
                    ? "bg-brand-bg border-brand-primary/60 shadow-xs hover:shadow-card hover:-translate-y-0.5"
                    : isLocked
                    ? "bg-brand-surface/60 border-brand-border opacity-70"
                    : "bg-brand-bg border-brand-border hover:border-brand-primary/40 hover:shadow-card hover:-translate-y-0.5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-korean font-bold text-xs text-brand-primary">
                        {node.koreanTitle}
                      </span>
                      {isCompleted && <Badge variant="success" size="sm">Đã học</Badge>}
                      {isInProgress && <Badge variant="tint" size="sm">Đang học</Badge>}
                      {isLocked && <Badge variant="neutral" size="sm">Khoá</Badge>}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-primary transition-colors">
                      {node.title}
                    </h3>

                    <p className="text-xs text-brand-secondary line-clamp-2 leading-relaxed">
                      {node.shortDesc}
                    </p>
                  </div>

                  {/* Stars & Meta */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < node.stars ? "fill-brand-gold text-brand-gold" : "text-brand-border"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{node.estimatedMinutes}p</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-brand-primary">
                        <Sparkles className="w-3 h-3" />
                        <span>+{node.xpReward} XP</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grammar tags & action */}
                <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {node.grammarFocus.map((g, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-brand-surface text-brand-secondary border border-brand-border text-[10px] font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Vào học</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadmapNodeMap;
